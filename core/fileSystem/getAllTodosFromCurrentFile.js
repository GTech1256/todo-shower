const fs = require('fs');
const path = require('path');

const getAllTodosFromCurrentFile = filePath => new Promise((resolve, reject) => {
	let allData = [];

	const stream = fs.createReadStream(filePath, { encoding: 'utf8' });

	stream.on('data', chunk => {
		allData = [...allData, ...chunk.split(/\n/)];
		// stream.destroy();
	});

	stream.on('close', () => {
		resolve(normalizationAllTodosInFile(allData, path.parse(filePath).base));
	});

	stream.on('error', error => {
		reject(error);
	});
});

function clearText(text) {
	return text.replace(/\t|\r/g, '').trim(); // remove tabs, '\r' and spaces around text
}

/**
 * @returns {{ importance: Number, username: String, date: Date, comment: String, fileName: String }}
 *
 */
function normalizationAllTodosInFile(dataArrayLines, fileName) {
	const todosStrings = dataArrayLines.filter(string => string.replace(/\s/g, '').toLowerCase().match('//todo'));


	const normalizedTodos = todosStrings.map(string => {
		const countOfImportance = (string.match(/!/g) || []).length; // get score of importance
		const importance = '!'.repeat(countOfImportance); // get score of importance

		const variables = string.split(';');

		// remove '// todo' from first variable
		const index = variables[0].search(/todo/i);
		variables[0] = variables[0].substr(index + 4); // 4 - length of word 'todo'

		switch (variables.length) {
		case 1: // only comment
			return {
				'!': importance,
				username: undefined,
				date: undefined,
				comment: clearText(variables[0]),
				fileName,
			};
		case 2: { // comment + [username||date]
			const indexOfTime = variables.findIndex(variable => variable.match(/^[0-9]{4,4}$|^[0-9]{4,4}-[0-1]{1,1}[0-9]{1,1}$|^[0-9]{4,4}-[0-1]{1,1}[0-9]{1,1}-[0-9]{1,1}[0-9]{1,1}$/)); // xxxx || xxxx-xx || xxxx-xx-xx

			if (indexOfTime === -1) {
				return {
					'!': importance,
					username: variables[0],
					date: undefined,
					comment: clearText(variables[1]),
					fileName,
				};
			}
			return {
				'!': importance,
				username: undefined,
				date: clearText(indexOfTime === 0 ? variables[0] : variables[1]),
				comment: clearText(indexOfTime === 0 ? variables[1] : variables[0]),
				fileName,
			};
		}
		case 3: { // full
			return {
				'!': importance,
				username: clearText(variables[0]),
				date: clearText(variables[1]),
				comment: clearText(variables[2]),
				fileName,
			};
		}
		default:
			// some wrong ?
			return {
				'!': importance,
				username: undefined,
				date: undefined,
				comment: undefined,
				fileName,
			};
		}
	});


	return normalizedTodos;
}

module.exports = getAllTodosFromCurrentFile;
