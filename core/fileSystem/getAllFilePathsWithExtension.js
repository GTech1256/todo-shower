const fs = require('fs');
const path = require('path');

const logger = require('../logger');
const config = require('../../config');

const getAllFilePathsWithExtension =
	async (directoryPath, extension, filePaths = []) => new Promise((resolve, reject) => {
		fs.readdir(directoryPath, async (error, fileNames) => { // get names of files
			if (error) { // catch error
				logger.error(error);
				reject(error);
				return;
			}


			// eslint-disable-next-line no-restricted-syntax
			for (const fileName of fileNames) {
				// eslint-disable-next-line no-continue
				if (config.fileSystem.ignoreNameFiles.indexOf(fileName) > -1) continue; // next iteration

				// TODO WinDev; ; Убедиться, что будет работать под Windows.
				filePath = path.resolve(directoryPath, fileName);
				// eslint-disable-next-line no-await-in-loop
				const newPaths = await checkPath(filePath, extension);

				filePaths = [...filePaths, ...newPaths]; // concat arrays

				if (fileNames.indexOf(fileName) === fileNames.length - 1) { // return Promise.then
					resolve(filePaths);
				}
			}
		});
	});

const checkPath = (filePath, extension) => new Promise((resolve, reject) => {
	fs.stat(filePath, async (error, stats) => { // get async stats
		if (error) { // catch error
			logger.error(error);
			reject(error);
			return;
		}

		if (stats.isDirectory()) {
			resolve(await getAllFilePathsWithExtension(filePath, extension)); // loop while have folders
		} else if (filePath.endsWith(`.${extension}`)) {
			resolve([filePath]); // return path with js file
		} else {
			resolve([]); // return empty array without js file;
		}
	});
});

module.exports = getAllFilePathsWithExtension;
