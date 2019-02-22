const settings = {
	minSpaceAround: 2,
	headers: [{ output: '!' }, { output: 'user' }, { output: 'date' }, { output: 'comment' }, { output: 'fileName' }],
};


function calculateLengthEveryVariable(data) {
	/*
	const basicLength = settings.minSpaceAround * 2 + 1; // __!__


	const lengths = {
		'!': basicLength,
		user: basicLength,
		date: basicLength,
		comment: basicLength,
		fileName: basicLength,
		maxLength: basicLength,
	};
	*/

	const lengths = {
		maxLength: settings.minSpaceAround * 2,
	};

	for (const { output } of settings.headers) {
		lengths[output] = output.length + (settings.minSpaceAround * 2); // init headers length
	}


	for (const item of data) {
		for (const keyOfItems of Object.keys(item)) {
			if (!item[keyOfItems]) continue; // if payload null
			const payloadLength = item[keyOfItems].output.length + (settings.minSpaceAround * 2);

			if (lengths[keyOfItems] < payloadLength) { // set param length
				lengths[keyOfItems] = payloadLength;

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

	const maximalLenghts = Object.values(lengths);
	const spaces = ' '.repeat(settings.minSpaceAround);


	object.forEach((value = ({ output: '' }), i) => {
		// i + 1 - 0 is maxLength
		const countSpaces = maximalLenghts[i + 1] - value.output.length - settings.minSpaceAround;
		const lastSpaces = ' '.repeat(countSpaces <= 0 ? settings.minSpaceAround : countSpaces);

		lineString += `${spaces}${value.output}${lastSpaces}`;
		if (i !== object.length - 1) {
			lineString += '|';
		}
	});


	return lineString;
}


module.exports = (data, isShow = true) => {
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

	if (isShow) {
		console.log(output);
	}

	return output;
};
