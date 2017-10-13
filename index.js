import createSyntaxError from './create-syntax-error.js';
import padStart from './pad-start.js';

const OVERFLOW_SYMBOLS = '\u2026'; // …
const EXTRA_LINES = 2;
const MAX_LINE_LENGTH = 100;
const OFFSET_CORRECTION = 60;
const TAB_SIZE = 4;
const DELIMITER = ' | ';
const CURSOR = '^'; // '👆'

function printLine(line, position, maxNumLength) {
	const num = String(position);
	const formattedNum = padStart(num, maxNumLength, ' ');

	return formattedNum + DELIMITER + line.replace(/\t/g, ' '.repeat(TAB_SIZE));
}

function printLines(lines, start, end, maxNumLength) {
	return lines
		.slice(start, end)
		.map((line, i) => printLine(line, start + i + 1, maxNumLength))
		.join('\n');

	// return lines.slice(start, end).map((line, i) => {
	// 	const num = String(start + i + 1);
	// 	const formattedNum = padStart(num, maxNumLength, ' ');
  //
	// 	return formattedNum + DELIMITER + convertTabsToSpaces(line);
	// }).join('\n');
}

export default (input, linePos, columnPos) => {
	const lines = input.split(/\r\n?|\n|\f/);
	const startLinePos = Math.max(1, linePos - EXTRA_LINES) - 1;
	const endLinePos = Math.min(linePos + EXTRA_LINES, lines.length);
	const maxNumLength = String(endLinePos).length;

	const prevLines = printLines(lines, startLinePos, linePos, maxNumLength);
	const targetLineBeforeCursor = printLine(lines[linePos - 1].substring(0, columnPos - 1), linePos, maxNumLength);
	const cursorLine = ' '.repeat(targetLineBeforeCursor.length) + CURSOR;
	const nextLines = printLines(lines, linePos, endLinePos, maxNumLength);

	// let cutLeft = 0;

	// if (column > MAX_LINE_LENGTH) {
	// 	cutLeft = column - OFFSET_CORRECTION + 3;
	// 	column = OFFSET_CORRECTION - 2;
	// }

	// lines.slice(startLine, endLine).map((line, i) => {
	// 	return line.replace(/\t/g, ' '.repeat(TAB_SIZE));
	// });

  //
	// for (let i = startLine; i <= endLine; i++) {
	// 	lines[i] =
	// 		(cutLeft > 0 && lines[i].length > cutLeft ? OVERFLOW_SYMBOLS : '') +
	// 		lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) +
	// 		(lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? OVERFLOW_SYMBOLS : '');
	// }

	// console.log(lines[line - 1]);
	// console.log(
	// 	lines[line - 1].replace(/[^\t]/g, 's')
	// );

	return [
		prevLines,
		cursorLine,
		nextLines
	].filter(Boolean).join('\n');
}