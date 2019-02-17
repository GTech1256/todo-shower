const createConsoleTable = require('../createConsoleTable');

module.exports = (todos) => {
	createConsoleTable(todos.filter(todo => todo['!'].length > 0));
};
