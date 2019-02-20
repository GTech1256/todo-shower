const createConsoleTable = require('../createConsoleTable');
const { matchDate } = require('../../helpers/validator');

module.exports = (todos, command) => {
	const date = command.split(' ')[1]; // get date from user input


	if (!matchDate(date)) { // check date
		console.log('wrong input date');
		return;
	}

	const timeFromCommand = new Date(date).getTime();

	createConsoleTable(todos.filter(
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
	));
};


/*

> В ответ на команду  "date 2015" ожидается список todo, которые были созданы в 2015 году и позже.
todo без даты неизвестно, когда созданы, поэтому не выводятся

Соответственно  на date 2015-05 не выводится todo 2015 тк не известно какого месяца созданы, я правильно понял?
> Да, все правильно

 */
