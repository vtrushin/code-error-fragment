import repeatString from 'repeat-string';
import padStart from 'pad-start';

function printLine(line, position, maxNumLength, settings) {
	const num = String(position);
	const formattedNum = padStart(num, maxNumLength, ' ');
	const tabReplacement = repeatString(' ', settings.tabSize);

	return formattedNum + ' | ' + line.replace(/\t/g, tabReplacement);
}

function printLines(lines, start, end, maxNumLength, settings) {
	return lines
		.slice(start, end)
		.map((line, i) => printLine(line, start + i + 1, maxNumLength, settings))
		.join('\n');
}

const defaultSettings = {
	extraLines: 2,
	tabSize: 4
};

export default (input, linePos, columnPos, settings) => {
	settings = Object.assign({}, defaultSettings, settings);

	const lines = input.split(/\r\n?|\n|\f/);
	const startLinePos = Math.max(1, linePos - settings.extraLines) - 1;
	const endLinePos = Math.min(linePos + settings.extraLines, lines.length);
	const maxNumLength = String(endLinePos).length;
	const prevLines = printLines(lines, startLinePos, linePos, maxNumLength, settings);
	const targetLineBeforeCursor = printLine(lines[linePos - 1].substring(0, columnPos - 1), linePos, maxNumLength, settings);
	const cursorLine = repeatString(' ', targetLineBeforeCursor.length) + '^';
	const nextLines = printLines(lines, linePos, endLinePos, maxNumLength, settings);

	return [prevLines, cursorLine, nextLines]
		.filter(Boolean)
		.join('\n');
}