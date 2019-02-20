/* eslint-disable eqeqeq */
const createConsoleTable = require('../createConsoleTable');

function compareParam(a, b, isRevert) {
	if (a == undefined && b) return 1;
	if (a == undefined && b == undefined) return 0;
	if (a && b == undefined) return -1;
	if (a === b) return 0;
	if (a > b) return isRevert ? 1 : -1;
	if (a < b) return isRevert ? -1 : 1;

	return 0;
}

module.exports = (todos, command) => {
	const sortBy = command.split(' ')[1];

	if (!sortBy) {
		console.log('wrong sort name (sort {importance | user | date})');
		return;
	}

	switch (sortBy) {
	case 'importance':
		createConsoleTable(todos.sort(({ '!': a }, { '!': b }) => compareParam(a.count, b.count)));
		break;
	case 'user':
		createConsoleTable(todos.sort(
			({ user: a }, { user: b }) => compareParam(
				(a != undefined ? a.output.length : undefined), // if time exist, get length
				(b != undefined ? b.output.length : undefined), // if time exist, get length
				true,
			),
		));
		break;
	case 'date':
		createConsoleTable(todos.sort(
			({ date: a }, { date: b }) => compareParam(
				(a ? new Date(a.output).getTime() : a), // if time exist, getTime
				(b ? new Date(b.output).getTime() : b), // if time exist, getTime
			),
		));
		break;
	default:
		console.log('wrong sort name (sort {importance | user | date})');
		break;
	}
};
