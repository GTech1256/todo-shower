const getAllFilePathsWithExtension = require('./getAllFilePathsWithExtension');
const getAllTodosFromCurrentFile = require('./getAllTodosFromCurrentFile');
const logger = require('../logger');
const config = require('../../config');

module.exports = () => getAllFilePathsWithExtension(process.cwd(), 'js').then(async filePaths => {
	logger.log('end search files');
	logger.log(`ignored: ${config.fileSystem.ignoreNameFiles.join(', ')}`);

	logger.log('start making files');

	let todos = [];
	// eslint-disable-next-line no-restricted-syntax
	for (const filePath of filePaths) {
		// eslint-disable-next-line no-await-in-loop
		todos = [...todos, ...(await getAllTodosFromCurrentFile(filePath))];
	}

	logger.log('end making files');

	return todos;
}).catch(logger.error);


// TODO Digi; 2018-09-21; Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js
// TODO PE; 2018-08-20; переименовать?
// TODsO Anonymous Developer; 2016-03-17; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла
// TODO WinDev; ; Убедиться, что будет работать под Windows.
// TODO Digi; 2018-09-21; Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js

// TODO Veronika; 2018-08-16; сделать кодировку настраиваемой

// TODsO Anonymous Developer; 2016-03-17; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла
// TODO PE; 2018-08-20; переименовать?
// TODO WinDev; ; Убедиться, что будет работать под Windows.

// TODsO Anonymous Developer; 2016-03-17; Необходимо переписать этот код и использовать асинхронные версии функций для чтения из файла
// TODO WinDev; ; Убедиться, что будет работать под Windows.

// TODO PE; 2018-08-20; переименовать?
// TODO WinDev; ; Убедиться, что будет работать под Windows.
// TODO Digi; 2018-09-21; Добавить функцию getFileName, которая по пути файла будет возвращать его имя. Воспользоваться модулем path из Node.js
// TODO PE; 2018-08-20; переименовать?
