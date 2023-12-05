import _ from 'lodash';
import { isCharNumber } from '../../../util/helpers';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 3;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/03/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/03/data.txt
// problem url  : https://adventofcode.com/2023/day/3

interface Symbol {
  value: number | string;
  isPartNumber: boolean;
}

type Schematic = (Symbol | undefined)[][];

const parseInput = (input: string): Schematic =>
  input.split('\n').map(row =>
    row.split('').map(symbol =>
      symbol === '.'
        ? undefined
        : {
            value: isCharNumber(symbol) ? +symbol : symbol,
            isPartNumber: false,
          }
    )
  );

const getPartNumber = (schematic: Schematic, row: number, col: number, left: boolean, right: boolean): string => {
  const symbol = schematic[row]?.[col];
  if (symbol === undefined || typeof symbol?.value !== 'number') return '';

  symbol.isPartNumber = true;

  return (
    (left ? getPartNumber(schematic, row, col - 1, true, false) : '') +
    `${symbol.value}` +
    (right ? getPartNumber(schematic, row, col + 1, false, true) : '')
  );
};

async function p2023day3_part1(input: string, ...params: any[]) {
  const schematic = parseInput(input);

  let partNumbers = 0;
  for (const [row, rows] of schematic.entries()) {
    for (const [col, symbol] of rows.entries()) {
      if (symbol !== undefined && typeof symbol.value !== 'number') {
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let colOffset = -1; colOffset <= 1; colOffset++) {
            const symbol = schematic[row + rowOffset][col + colOffset];
            if (typeof symbol?.value == 'number' && !symbol.isPartNumber) {
              partNumbers += +getPartNumber(schematic, row + rowOffset, col + colOffset, true, true);
            }
          }
        }
      }
    }
  }

  return partNumbers;
}

async function p2023day3_part2(input: string, ...params: any[]) {
  const schematic = parseInput(input);

  let gearRatios = 0;
  for (const [row, rows] of schematic.entries()) {
    for (const [col, symbol] of rows.entries()) {
      if (symbol?.value === '*') {
        const partNumbers = [];
        for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
          for (let colOffset = -1; colOffset <= 1; colOffset++) {
            const symbol = schematic[row + rowOffset][col + colOffset];
            if (typeof symbol?.value == 'number' && !symbol.isPartNumber) {
              partNumbers.push(+getPartNumber(schematic, row + rowOffset, col + colOffset, true, true));
            }
          }
        }

        if (partNumbers.length === 2) {
          gearRatios += partNumbers[0] * partNumbers[1];
        }
      }
    }
  }

  return gearRatios;
}

async function run() {
  const part1tests: TestCase[] = [];
  const part2tests: TestCase[] = [];

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of part1tests) {
      test.logTestResult(testCase, String(await p2023day3_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of part2tests) {
      test.logTestResult(testCase, String(await p2023day3_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2023day3_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2023day3_part2(input));
  const part2After = performance.now();

  logSolution(3, 2023, part1Solution, part2Solution);

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
