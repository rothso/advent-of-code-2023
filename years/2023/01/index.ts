import _, { first } from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 1;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/01/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/01/data.txt
// problem url  : https://adventofcode.com/2023/day/1

function isCharNumber(c: string) {
  return c >= '0' && c <= '9';
}

const wordToNumber: { [key: string]: string } = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

async function p2023day1_part1(input: string, ...params: any[]) {
  const lines = input.split('\n');
  let calibrationValues = 0;

  for (const line of lines) {
    let firstNumber = null;
    let lastNumber = null;

    for (const char of line) {
      if (isCharNumber(char)) {
        firstNumber = firstNumber == null ? char : firstNumber;
        lastNumber = char;
      }
    }

    calibrationValues += +`${firstNumber}${lastNumber}`;
  }

  return calibrationValues;
}

async function p2023day1_part2(input: string, ...params: any[]) {
  const lines = input.split('\n');
  let calibrationValues = 0;

  for (const line of lines) {
    let firstNumber = null;
    let lastNumber = null;

    const regex = /^(1|2|3|4|5|6|7|8|9|one|two|three|four|five|six|seven|eight|nine)/;

    for (let i = 0; i < line.length; i++) {
      const matches = line.substring(i).match(regex);
      if (matches !== null) {
        const wordOrNumber = matches[0];
        const number = isCharNumber(wordOrNumber) ? wordOrNumber : wordToNumber[wordOrNumber];

        firstNumber = firstNumber == null ? number : firstNumber;
        lastNumber = number;
      }
    }

    calibrationValues += +`${firstNumber}${lastNumber}`;
  }

  return calibrationValues;
}

async function run() {
  const part1tests: TestCase[] = [];
  const part2tests: TestCase[] = [];

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of part1tests) {
      test.logTestResult(testCase, String(await p2023day1_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of part2tests) {
      test.logTestResult(testCase, String(await p2023day1_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2023day1_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2023day1_part2(input));
  const part2After = performance.now();

  logSolution(1, 2023, part1Solution, part2Solution);

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
