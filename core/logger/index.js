const fs = require('fs');
const path = require('path');


function createOrWriteFile(text) {
	const time = new Date().toISOString().split('T')[0]; // 2019-02-06T12:30:20.228Z -> 2019-02-06

	const formatedText = `${text}\r\n`;

	const pathOfFile = path.join(__dirname, `../../logs/${time}.log`);


	fs.appendFile(pathOfFile, formatedText, (err) => {
		if (err) throw err;
	});
}

function errorLogger(error) {
	createOrWriteFile(error);
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
