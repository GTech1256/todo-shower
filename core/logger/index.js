const fs = require('fs');
const path = require('path');


function createOrWriteFile(text, isError) {
	let pathToFile;
	if (isError) {
		pathToFile = path.join(__dirname, `../../logs/errors.log`);
	} else {
		const time = new Date().toISOString().split('T')[0]; // 2019-02-06T12:30:20.228Z -> 2019-02-06
		pathToFile = path.join(__dirname, `../../logs/${time}.log`);
	}

	const formatedText = `${text}\r\n`;


	fs.appendFile(pathToFile, formatedText, (err) => {
		if (err) throw err;
	});
}

function errorLogger(error) {
	if (typeof error === 'string') {
		createOrWriteFile(error, true);
	} else { // Error object
		createOrWriteFile(`\n${error.message}\n${error.stack}\n`, true);
	}
}
function dataLogger(text) {
	if (process.env.NODE_ENV === 'development') {
		if (typeof text !== 'string') {
			errorLogger(new Error(`${text} is not string`));
			return;
		}
		console.log(text);
	}


	createOrWriteFile(text);
}

module.exports = {
	error: errorLogger,
	log: dataLogger,
};
