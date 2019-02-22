const { matchDate } = require('../../helpers/validator');

module.exports = (todos, command) => {
	const date = command.split(' ')[1]; // get date from user input


	if (!matchDate(date)) { // check date
		console.log('wrong input date');
		return;
	}

	const timeFromCommand = new Date(date).getTime();

	// eslint-disable-next-line consistent-return
	return todos.filter(
		todo => {
			if (!todo.date) {
				return false;
			}

			const timeFromTodo = new Date(todo.date.output).getTime();

			if (timeFromCommand > timeFromTodo) { // matching dates
				return false;
			}

			return true;
		},
	);
};
