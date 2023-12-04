import _ from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 2;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/02/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/02/data.txt
// problem url  : https://adventofcode.com/2023/day/2

const MAX_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
};

type Color = keyof typeof MAX_CUBES;

type Game = {
  id: string;
  draws: Draw[];
};

type Draw = NumColor[];

type NumColor = {
  count: number;
  color: Color;
};

function parseInput(input: string): Game[] {
  return input.split('\n').map(game => {
    const [, id, draws] = /Game (\d+): (.*)/.exec(game) || [];
    return {
      id,
      draws: draws.split('; ').map(subset =>
        subset
          .split(', ')
          .map(numColor => numColor.split(' ') as [string, Color])
          .map(([count, color]) => ({ count: +count, color }))
      ),
    };
  });
}

async function p2023day2_part1(input: string, ...params: any[]) {
  const game = parseInput(input);

  return game
    .map(({ id, draws }) => (draws.every(d => d.every(({ count, color }) => count <= MAX_CUBES[color])) ? +id : 0))
    .reduce((acc, id) => acc + id);
}

async function p2023day2_part2(input: string, ...params: any[]) {
  const game = parseInput(input);

  return game
    .map(({ draws }) => {
      const minColors = draws
        .flatMap(draw => draw)
        .reduce(
          (minColors, { count, color }) => ({
            ...minColors,
            [color]: Math.max(count, minColors[color] ?? 0),
          }),
          {} as Record<Color, number>
        );

      return Object.values(minColors).reduce((power, count) => power * count);
    })
    .reduce((acc, power) => acc + power);
}

async function run() {
  const part1tests: TestCase[] = [];
  const part2tests: TestCase[] = [];

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of part1tests) {
      test.logTestResult(testCase, String(await p2023day2_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of part2tests) {
      test.logTestResult(testCase, String(await p2023day2_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2023day2_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2023day2_part2(input));
  const part2After = performance.now();

  logSolution(2, 2023, part1Solution, part2Solution);

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
