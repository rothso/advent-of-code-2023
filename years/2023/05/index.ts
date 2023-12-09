import _ from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 5;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/05/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/05/data.txt
// problem url  : https://adventofcode.com/2023/day/5

interface Almanac {
  seeds: number[];
  maps: Map[];
}

interface Map {
  from: string;
  to: string;
  ranges: MapRange[];
}

interface MapRange extends Range {
  dest: number;
}

interface Range {
  start: number;
  end: number;
}

const parseInput = (input: string): Almanac => {
  const [seedList, ...sectionList] = input.split('\n\n');
  const [, seeds] = /seeds: (.*)/.exec(seedList) || [];

  return {
    seeds: seeds.split(' ').map(seed => +seed),
    maps: sectionList.map(section => {
      const [name, ...ranges] = section.split('\n');
      const [, from, to] = /(.*)-to-(.*) map:/.exec(name) || [];
      return {
        from,
        to,
        ranges: ranges.map(range => {
          const [dest, start, length] = range.split(' ');
          return {
            dest: +dest,
            start: +start,
            end: +start + +length,
          };
        }),
      };
    }),
  };
};

async function p2023day5_part1(input: string, ...params: any[]) {
  const almanac = parseInput(input);

  return Math.min(
    ...almanac.seeds.map(seed =>
      almanac.maps.reduce((number, map) => {
        const range = map.ranges.find(range => number >= range.start && number < range.end);
        return range !== undefined ? number - range.start + range.dest : number;
      }, seed)
    )
  );
}

async function p2023day5_part2(input: string, ...params: any[]) {
  const almanac = parseInput(input);

  const ranges: Range[] = almanac.seeds
    .reduce((chunks: number[][], seed, i) => {
      const chunk = Math.floor(i / 2);
      chunks[chunk] = [...(chunks[chunk] || []), seed];
      return chunks;
    }, [])
    .map(chunk => ({ start: chunk[0], end: chunk[0] + chunk[1] }));

  for (let map of almanac.maps) {
    // Sort the ranges
    map.ranges.sort((a, b) => a.start - b.start);

    // Plug any holes with the identity transform
    let updatedRanges: MapRange[] = [];
    for (let i = 0; i < map.ranges.length; i++) {
      const currentRange = map.ranges[i];
      const nextRange = map.ranges[i + 1];

      // Push a range that starts at 0 if there isn't one
      if (i == 0 && currentRange.start !== 0) {
        updatedRanges.push({
          dest: 0,
          start: 0,
          end: currentRange.start,
        });
      }

      // Push the current range
      updatedRanges.push(currentRange);

      // Push the range between this and the next one of it's missing
      if (nextRange !== undefined && currentRange.end < nextRange.start) {
        updatedRanges.push({
          dest: currentRange.end,
          start: currentRange.end,
          end: nextRange.start,
        });
      }
    }
    map.ranges = updatedRanges;
  }

  return Math.min(
    ...almanac.maps
      .reduce(
        (fromRanges, { ranges: toRanges }) =>
          fromRanges.flatMap(({ start, end }) =>
            toRanges
              .filter(toRange => end > toRange.start && start < toRange.end)
              .map(toRange => ({
                start: Math.max(start, toRange.start) - toRange.start + toRange.dest,
                end: Math.min(toRange.end, end) - toRange.start + toRange.dest,
              }))
          ),
        ranges
      )
      .map(({ start }) => start)
  );
}

async function run() {
  const part1tests: TestCase[] = [];
  const part2tests: TestCase[] = [];

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of part1tests) {
      test.logTestResult(testCase, String(await p2023day5_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of part2tests) {
      test.logTestResult(testCase, String(await p2023day5_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2023day5_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2023day5_part2(input));
  const part2After = performance.now();

  logSolution(5, 2023, part1Solution, part2Solution);

  log(chalk.gray('--- Performance ---'));
  log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
  log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
  log();
}

run()
  .then(() => {
    process.exit();
  })
  .catch(error => {
    throw error;
  });
