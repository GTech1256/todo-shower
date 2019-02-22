const { matchDate } = require('../../helpers/validator');

/**
 * @param {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} todos - all todos from fileSystem.js
 * @param {String} command user command from console (stdin)
 * @returns {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} filtered todos by inputed data
 */
module.exports = (todos, command) => {
	const userInputedDate = command.split(' ')[1]; // get date from user input

	if (!matchDate(userInputedDate)) { // check user input date
		console.log('wrong input date');
		return []; // return empty array
	}

	const timeFromCommand = new Date(userInputedDate).getTime(); // getTime from user inputed

	return todos.filter(
		todo => {
			if (!todo.date) {
				return false; // remove todo if date not exist
			}

			// getTime by date in todo (date valid by check in fileSystem)
			const timeFromTodo = new Date(todo.date.output).getTime();

			if (timeFromCommand > timeFromTodo) { // matching dates
				return false;
			}

			return true;
		},
	);
};
