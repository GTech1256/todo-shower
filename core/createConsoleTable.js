const settings = {
	minSpaceAround: 2,
	headers: ['!', 'user', 'date', 'comment', 'fileName'],
};


function calculateLengthEveryVariable(data) {
	const basicLength = settings.minSpaceAround * 2 + 1; // __!__

	const lengths = {
		'!': basicLength,
		username: basicLength,
		date: basicLength,
		comment: basicLength,
		fileName: basicLength,
		maxLength: basicLength,
	};


	for (const item of data) {
		for (const keysOfItems of Object.keys(item)) {
			if (!item[keysOfItems]) continue; // if payload null

			const payloadLength = item[keysOfItems].length + (settings.minSpaceAround * 2);

			if (lengths[keysOfItems] < payloadLength) { // set param length
				lengths[keysOfItems] = payloadLength;

				if (lengths.maxLength < payloadLength) { // set maxLength
					lengths.maxLength = payloadLength;
				}
			}
		}
	}
	return lengths;
}

function getLine(object, lengths) {
	let lineString = '';

	const valuesOfLengths = Object.values(lengths);

	const spaces = ' '.repeat(settings.minSpaceAround);

	object.forEach((value = '', i) => {
		const lastSpaces = ' '.repeat(valuesOfLengths[i] - settings.minSpaceAround - value.length);

		lineString += `${spaces}${value}${lastSpaces}`;
		if (i !== object.length - 1) {
			lineString += '|';
		}
	});

	return lineString;
}


module.exports = (data) => {
	const lengths = calculateLengthEveryVariable(data);

	const header = getLine(settings.headers, lengths);
	const lines = '-'.repeat(header.length);


	let content = '';
	for (const item of data) {
		content += `${getLine(Object.values(item), lengths)}\n`;
	}

	const output = `
${header}
${lines}
${content}${lines}`;


	console.log(output);
};
