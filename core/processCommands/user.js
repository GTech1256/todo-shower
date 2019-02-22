/**
 * @param {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} todos - all todos from fileSystem.js
 * @param {String} command user command from console (stdin)
 * @returns {[{ importance: Number, user: String, date: Date, comment: String, fileName: String }]} filter by username from user input
 */
module.exports = (todos, command) => {
	const userRegExp = new RegExp(command.split(' ')[1], 'i'); // get user regExp

	return todos.filter(
		todo => todo.user && todo.user.output.match(userRegExp), // filter todos by user
	);
};
