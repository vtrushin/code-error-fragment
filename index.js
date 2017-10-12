const errorStack = (new Error()).stack;

function createSyntaxError(props) {
	// use Object.create(), because some VMs prevent setting line/column otherwise
	// (iOS Safari 10 even throws an exception)
	const error = Object.create(SyntaxError.prototype);

	error.name = 'SyntaxError';
	Object.assign(error, props);
	Object.defineProperty(error, 'stack', {
		get() {
			return errorStack ? errorStack.replace(/^(.+\n){1,3}/, String(error) + '\n') : '';
		}
	});

	return error;
}

const OVERFLOW_SYMBOLS = '\u2026'; // …
const EXTRA_LINES = 10;
const MAX_LINE_LENGTH = 100;
const OFFSET_CORRECTION = 60;
const TAB_REPLACEMENT = '\t';
const TAB_SIZE = 4;
const DELIMITER = ' | ';
const CURSOR = '^'; // '👆'

// move to utils
function padStart(string, targetLength, padString) {
	if (String.prototype.padStart) {
		return string.padStart(targetLength, padString);
	}

	targetLength = targetLength >> 0; // Floor if number or convert non-number to 0;
	padString = String(padString || ' ');

	if (string.length > targetLength) {
		return String(string);
	} else {
		targetLength = targetLength - string.length;
		if (targetLength > padString.length) {
			padString += padString.repeat(targetLength / padString.length); // Append to original to ensure we are longer than needed
		}
		return padString.slice(0, targetLength) + String(string);
	}
}

function convertTabsToSpaces(string) {
	return string.replace(/\t/g, ' '.repeat(TAB_SIZE));
}

function printLine(line, position, maxNumLength) {
	const num = String(position);
	const formattedNum = padStart(num, maxNumLength, ' ');

	return formattedNum + DELIMITER + convertTabsToSpaces(line);
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

function prettyCodeError(input, linePos, columnPos) {
	const lines = input.split(/\r\n?|\n|\f/);
	const startLinePos = Math.max(1, linePos - EXTRA_LINES) - 1;
	const endLinePos = Math.min(linePos + EXTRA_LINES, lines.length);
	const maxNumLength = String(endLinePos).length;

	const linesBefore = printLines(lines, startLinePos, linePos, maxNumLength);
	const cursorLine = ' '.repeat(printLine(lines[linePos - 1].substring(0, columnPos - 1), linePos, maxNumLength).length) + CURSOR;
	const linesAfter = printLines(lines, linePos, endLinePos, maxNumLength);

	let cutLeft = 0;

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
		linesBefore,
		cursorLine,
		linesAfter
	].filter(Boolean).join('\n');
}

fetch('example.js')
	.then(data => data.text())
	.then(text => {
		console.log(
			prettyCodeError(text, 6, 10)
		);
	})
;