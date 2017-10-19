const fs = require('fs');
const path = require('path');
const assert = require('assert');
const codeErrorFragment = require('../build');

function readFile(file) {
	let src = fs.readFileSync(file, 'utf8');
	// normalize line endings
	src = src.replace(/\r\n/, '\n');
	// remove trailing newline
	src = src.replace(/\n$/, '');

	return src;
}

const folderPath = path.join(__dirname, 'fixtures');

describe('Test', () => {
	fs.readdirSync(folderPath).forEach(fileName => {
		const fixtureIndexOf = fileName.indexOf('.input');

		if (fixtureIndexOf === -1) {
			return;
		}

		const fixtureName = fileName.substring(0, fixtureIndexOf);

		it(fixtureName, () => {
			const input = readFile(path.join(folderPath, fileName));
			const params = require(path.join(folderPath, fixtureName + '.params.js'));
			const output = readFile(path.join(folderPath, fixtureName + '.output.txt'));
			const expectedOutput = codeErrorFragment(input, params.line, params.column);

			assert.deepEqual(expectedOutput, output, 'is valid');
		});
	});
});
