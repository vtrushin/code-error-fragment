export default (string, targetLength, padString) => {
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