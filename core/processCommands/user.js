const createConsoleTable = require('../createConsoleTable');

module.exports = (todos, command) => {
	const userRegExp = new RegExp(command.split(' ')[1], 'i');

	createConsoleTable(todos.filter(
		todo => todo.user && todo.user.output.match(userRegExp),
	));
};
