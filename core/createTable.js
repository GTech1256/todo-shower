const settings = {
	minSpaceAround: 2,
	headers: [{ output: '!' }, { output: 'user' }, { output: 'date' }, { output: 'comment' }, { output: 'fileName' }],
};

/**
 *
 * @param {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} data array of row
 * @returns {[{ maxLength: Number, !: Number, user: Number, date: Number, comment: Number, fileName: Number }]} Numbers of max length in column
 */
function calculateLengthEveryVariable(data) {
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
/**
 *
 * @param {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} object array of row
 * @param {[{ maxLength: Number, !: Number, user: Number, date: Number, comment: Number, fileName: Number }]} Numbers of max length in column
 * @returns {String} -  variable  | variable  |  variable
 */
function getLine(object, lengths) {
	let lineString = '';

	const maximalLenghts = Object.values(lengths); // calculated spaces for every column
	const spaces = ' '.repeat(settings.minSpaceAround); // firstSpaces


	object.forEach((value = ({ output: '' }), i) => { // every data row calculate
		// calculate spaces by (columnt length - valut length - minimal spaces from one side)
		// i + 1 - 0 is maxLength
		const countSpaces = maximalLenghts[i + 1] - value.output.length - settings.minSpaceAround;
		const lastSpaces = ' '.repeat(countSpaces <= 0 ? settings.minSpaceAround : countSpaces);

		lineString += `${spaces}${value.output}${lastSpaces}`; // write in row

		if (i !== object.length - 1) {
			lineString += '|'; // add '|' between rows
		}
	});


	return lineString;
}

/**
 *
 * @param {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} data array of todos
 * @returns {String} - normalized table of todos
 */
module.exports = (data, isShow = true) => {
	const lengths = calculateLengthEveryVariable(data); // get lenght for spaces in every data row
	const header = getLine(settings.headers, lengths); // get row
	const lines = '-'.repeat(header.length); // get lines for upper and bottom content


	let content = '';
	for (const item of data) {
		content += `${getLine(Object.values(item), lengths)}\n`; // get content from data(todos)
	}

	const output = `
${header}
${lines}
${content}${lines}`;

	if (isShow) {
		console.log(output); // output console
	}

	return output; // for server
};
