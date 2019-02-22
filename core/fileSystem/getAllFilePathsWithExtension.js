const fs = require('fs');
const path = require('path');

const logger = require('../logger');
const config = require('../../config');

/**
 *
 * @param {String} directoryPath path of directory for getting all paths
 * @param {String} extension .js
 * @param {String} filePaths @default {Array} empty array []
 */
const getAllFilePathsWithExtension =
	async (directoryPath, extension, filePaths = []) => new Promise((resolve, reject) => {
		fs.readdir(directoryPath, async (error, fileNames) => { // get names of files
			if (error) { // catch error
				logger.error(error);
				reject(error);
				return;
			}

			// calculate every file name from fs.readdir()
			for (const fileName of fileNames) {
				if (config.fileSystem.ignoreNameFiles.includes(fileName)) continue; // next iteration


				filePath = path.resolve(directoryPath, fileName);
				// eslint-disable-next-line no-await-in-loop
				const newPaths = await checkPath(filePath, extension); // loop

				filePaths = [...filePaths, ...newPaths]; // concat arrays

				if (fileNames.indexOf(fileName) === fileNames.length - 1) { // return Promise.then
					resolve(filePaths);
				}
			}
		});
	});

/**
 *
 * @param {String} filePath - file path for check
 * @param {String} extension - .js
 * @returns {Promise} | resolve - {Array} array of paths | reject {Error}
 */
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

// TODO WinDev; ; Убедиться, что будет работать под Windows.
