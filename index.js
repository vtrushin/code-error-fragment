import createSyntaxError from './create-syntax-error.js';
import padStart from './pad-start.js';

const OVERFLOW_SYMBOLS = '\u2026'; // …
const MAX_LINE_LENGTH = 100;
const OFFSET_CORRECTION = 60;

function printLine(line, position, maxNumLength, settings) {
	const num = String(position);
	const formattedNum = padStart(num, maxNumLength, ' ');

	return formattedNum + ' | ' + line.replace(/\t/g, ' '.repeat(settings.tabSize));
}

function printLines(lines, start, end, maxNumLength, settings) {
	return lines
		.slice(start, end)
		.map((line, i) => printLine(line, start + i + 1, maxNumLength, settings))
		.join('\n');

	// return lines.slice(start, end).map((line, i) => {
	// 	const num = String(start + i + 1);
	// 	const formattedNum = padStart(num, maxNumLength, ' ');
  //
	// 	return formattedNum + DELIMITER + convertTabsToSpaces(line);
	// }).join('\n');
}

const defaultSettings = {
	extraLines: 2,
	tabSize: 4,
	cursor: '^', // '👆'
};

export default (input, linePos, columnPos, settings) => {
	settings = { ...defaultSettings, ...settings };

	const lines = input.split(/\r\n?|\n|\f/);
	const startLinePos = Math.max(1, linePos - settings.extraLines) - 1;
	const endLinePos = Math.min(linePos + settings.extraLines, lines.length);
	const maxNumLength = String(endLinePos).length;

	const prevLines = printLines(lines, startLinePos, linePos, maxNumLength, settings);
	const targetLineBeforeCursor = printLine(lines[linePos - 1].substring(0, columnPos - 1), linePos, maxNumLength, settings);
	const cursorLine = ' '.repeat(targetLineBeforeCursor.length) + settings.cursor;
	const nextLines = printLines(lines, linePos, endLinePos, maxNumLength, settings);

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