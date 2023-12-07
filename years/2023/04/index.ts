import _ from 'lodash';
import * as util from '../../../util/util';
import * as test from '../../../util/test';
import chalk from 'chalk';
import { log, logSolution, trace } from '../../../util/log';
import { performance } from 'perf_hooks';

const YEAR = 2023;
const DAY = 4;

// solution path: /home/rothanak/Projects/advent-of-code-2023/years/2023/04/index.ts
// data path    : /home/rothanak/Projects/advent-of-code-2023/years/2023/04/data.txt
// problem url  : https://adventofcode.com/2023/day/4

interface Card {
  id: number;
  winningNumbers: number[];
  heldNumbers: number[];
}

const parseInput = (input: string): Card[] => {
  return input.split('\n').map(card => {
    const [, id, winningNumbers, heldNumbers] = /Card\s+(\d+):\s+(.*) \|\s+(.*)/.exec(card) || [];
    return {
      id: +id,
      winningNumbers: winningNumbers.split(/\s+/).map(num => +num),
      heldNumbers: heldNumbers.split(/\s+/).map(num => +num),
    };
  });
};

async function p2023day4_part1(input: string, ...params: any[]) {
  const cards = parseInput(input);

  return cards
    .map(card => card.heldNumbers.filter(heldNumber => card.winningNumbers.includes(heldNumber)))
    .map(matches => (matches.length ? 2 ** (matches.length - 1) : 0))
    .reduce((sum, score) => sum + score);
}

async function p2023day4_part2(input: string, ...params: any[]) {
  const cards = parseInput(input);

  const numCards = cards.map(card => ({
    id: card.id,
    score: card.heldNumbers.filter(heldNumber => card.winningNumbers.includes(heldNumber)).length,
    count: 1,
  }));

  for (let [i, { score, count }] of numCards.entries()) {
    for (let j = 1; j <= score; j++) {
      numCards[i + j].count += count;
    }
  }

  return numCards.reduce((sum, numCard) => (sum += numCard.count), 0);
}

async function run() {
  const part1tests: TestCase[] = [];
  const part2tests: TestCase[] = [];

  // Run tests
  test.beginTests();
  await test.section(async () => {
    for (const testCase of part1tests) {
      test.logTestResult(testCase, String(await p2023day4_part1(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  await test.section(async () => {
    for (const testCase of part2tests) {
      test.logTestResult(testCase, String(await p2023day4_part2(testCase.input, ...(testCase.extraArgs || []))));
    }
  });
  test.endTests();

  // Get input and run program while measuring performance
  const input = await util.getInput(DAY, YEAR);

  const part1Before = performance.now();
  const part1Solution = String(await p2023day4_part1(input));
  const part1After = performance.now();

  const part2Before = performance.now();
  const part2Solution = String(await p2023day4_part2(input));
  const part2After = performance.now();

  logSolution(4, 2023, part1Solution, part2Solution);

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
