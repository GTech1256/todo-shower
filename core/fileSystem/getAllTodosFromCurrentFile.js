const fs = require('fs');
const path = require('path');
const { matchDate } = require('../../helpers/validator');

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

function normalizeData(text) {
	const normalizedDate = text.replace(/\t|\r/g, '').trim();

	if (normalizedDate.length === 0) {
		return undefined;
	}

	return {
		output: normalizedDate, // remove tabs, '\r' and spaces around text
	};
}

/**
 * @returns {{ importance: Number, user: String, date: Date, comment: String, fileName: String }}
 *
 */
function normalizationAllTodosInFile(dataArrayLines, fileName) {
	fileName = normalizeData(fileName);
	const filteredStrings = dataArrayLines.filter(string => string.replace(/\s/g, '').toLowerCase().match('//t\\odo'));


	const normalizedTodos = filteredStrings.map(string => {
		// remove '// t.o.d.o.' from first variable
		const index = string.search(/todo/i);
		string = string.substr(index + 4); // 4 - length of word 'todo'

		const countOfImportance = (string.match(/!/g) || []).length; // get score of importance

		const importance = {
			count: countOfImportance, // get score of importance
			output: countOfImportance > 0 ? '!' : '',
		};

		const variables = string.split(/(?<!\\);/g); // added screening for todo

		switch (variables.length) {
			case 0: {
				return {
					'!': undefined,
					user: undefined,
					date: undefined,
					comment: undefined,
					fileName,
				};
			}
			case 1: // only comment
				return {
					'!': importance,
					user: undefined,
					date: undefined,
					comment: normalizeData(variables[0]),
					fileName,
				};
			case 2: { // comment + [user||date]
				const indexOfTime = variables.findIndex(variable => matchDate(variable)); // xxxx || xxxx-xx || xxxx-xx-xx

				if (indexOfTime === -1) {
					return {
						'!': importance,
						user: normalizeData(variables[0]),
						date: undefined,
						comment: normalizeData(variables[1]),
						fileName,
					};
				}
				return {
					'!': importance,
					user: undefined,
					date: normalizeData(indexOfTime === 0 ? variables[0] : variables[1]),
					comment: normalizeData(indexOfTime === 0 ? variables[1] : variables[0]),
					fileName,
				};
			}
			case 3: { // full
				const isValidDate = matchDate(variables[1].trim());
				return {
					'!': importance,
					user: normalizeData(variables[0]),
					date: isValidDate ? normalizeData(variables[1]) : undefined,
					comment: normalizeData(variables[2]),
					fileName,
				};
			}
			default:
				// some wrong ?
				const isValidDate = matchDate(variables[1].trim());
				return {
					'!': importance,
					user: normalizeData(variables[0]),
					date: isValidDate ? normalizeData(variables[1]) : undefined,
					comment: normalizeData(variables[2]),
					fileName,
				};
		}
	});


	return normalizedTodos;
}

module.exports = getAllTodosFromCurrentFile;
