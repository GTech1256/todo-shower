// just self-writen mini logger

const fs = require('fs');
const path = require('path');

function createOrWriteFile(text, isError) {
	const time = new Date().toISOString().split('T'); // 2019-02-06T12:30:20.228Z -> 2019-02-06

	let pathToFile;
	if (isError) {
		pathToFile = path.join(__dirname, `../../logs/errors.log`); // if error - write in errors file
	} else {
		pathToFile = path.join(__dirname, `../../logs/${time[0]}.log`); // calculate path for write
	}

	const formatedText = `${text}${time}\r\n`;

	// write all data with date
	fs.appendFile(pathToFile, formatedText, (err) => {
		if (err) throw err;
	});
}

function errorLogger(error) {
	if (typeof error === 'string') {
		createOrWriteFile(error, true);
	} else { // Error object
		createOrWriteFile(`\n${error.message}\n${error.stack}\n`, true); // calculate error txt
	}
}
function dataLogger(text) {
	if (process.env.NODE_ENV === 'development') {
		if (typeof text !== 'string') {
			errorLogger(new Error(`${text} is not string`));
			return;
		}
		console.log(text); // if is dev - all txt to console
	}


	createOrWriteFile(text);
}

module.exports = {
	error: errorLogger,
	log: dataLogger,
};
