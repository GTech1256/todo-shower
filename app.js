/* eslint-disable no-irregular-whitespace */
const getAllTodos = require('./core/fileSystem/getAllTodos');
const { readLine } = require('./console');

const {
	date: dateCommand,
	important: importantCommand,
	show: showCommand,
	user: userCommand,
	sort: sortCommand,
} = require('./core/processCommands');
const logger = require('./core/logger');


// localDB
let localTodos = [];

function processCommand(command) {
	// command = command.replace(/\s/g, '');
	logger.log(`user input: ${command}`);

	// todo text to config.
	const commands =
		`
refresh - load all TODO's again

help - show all commands.

exit - program shutdown.

show - show all todo withoit filters

important​ - only show todo that has an exclamation mark. The comment may contain an exclamation point (!), which means that this is a high priority task.

user {username} - show only comments from specified user's. 
    The user name is case-insensitive. Example command: "user veronika.​ ". 
    Initial letters of the user name list also showed up. That is, the result of the "user ve" command​ "is include same results as the "user veronika" command​ "(and maybe more, if there are other users with a name starting with ve)

    sort {importance | user / date} - displays sorted todo If the argument importance​ , then first the comments with exclamation points, then everyone else. The more exclamation points, the higher the priority and the higher in the list this comment. 
    If the user argument​, it displays tasks grouped by user, and in the end ring. 
    If the date argument​, then the newest are displayed first, then older, then without date.

date {yyyy[-mm-dd]}​ - shows all comments that were created after a supplied date (inclusive). 
    The date can only be a year, a year with a month (hyphenated), or a year with a month and in the daytime. 
    Example commands: "date 2015​ ", "date 2016-02​ ", "date 2018-03-02​ ". 
    In response to the "date 2015" command​ "expected a list of t odo​ that were created in 2015 and later.
`;

	switch (command) {
	case (command.match(/help/) || {}).input: // show all commands
		console.log(commands);
		break;
	case (command.match(/exit/) || {}).input: // exit from util
		process.exit(0);
		break;
	case (command.match(/show/) || {}).input: // show all T.O.D.O.
		showCommand(localTodos);
		break;
	case (command.match(/important/) || {}).input: // show all T.O.D.O with '!'.
		importantCommand(localTodos);
		break;
	case (command.match(/user /) || {}).input: // show all T.O.D.O with username.
		userCommand(localTodos, command);
		break;
	case (command.match(/sort /) || {}).input: // show all sorted T.O.D.O's by priority or username or date.
		sortCommand(localTodos, command);
		break;
	case (command.match(/date /) || {}).input: // show all T.O.D.O with match date.
		dateCommand(localTodos, command);
		break;
	case (command.match(/refresh/) || {}).input: // refresh Todos
		logger.log('start search files');
		getAllTodos().then((todos) => {
			localTodos = todos;
			console.log('new todos loaded!');
		});
		break;
	default: // output wrong command
		console.log('wrong command');
		break;
	}
}

// TODO you can do it!

// main function
module.exports = () => {
	try {
		logger.log('start search files');
		getAllTodos().then((todos) => {
			localTodos = todos;
			console.log('Please, write your command!');

			if (process.env.NODE_ENV === 'development') {
				console.log('help - for show all commands.');
			}
		});

		readLine(processCommand); // do some magic with command from terminal

		// const data = getFiles();
	} catch (e) {
		logger.error(e); // logging all unhandled errors
	}
};

// Пробелы не входят в итоговый результат

/*

в sort user пользователь gar и GAR один user или два разных? Имеет ли тут регистр значение?
Сделать конфиг
*/

// // TODO terminator;;i'll be back
// // TODO terminator;;i'll be back
// // TODO terminator;;i'll be back
// // TODO terminator;;i'll be back
// // TODO terminator;;i'll be back
// // TODO terminator;;i'll be back
// // TODO terminator;2016-10-10;i'll be back
// // TODO terminator;2016-10;i'll be back
// // TODO terminator;2016;i'll be back

/*

Для минимальной реализации у вас будут строго правильные комментарии. Валидные, с полной датой и все такое. В остальных тестах есть куча всяких невалидных и странных случаев. Чем больше из них вы учтете, тем больше баллов за тесты получите.


*/

// date не нужно сортировать, как и аналогичные ей user и important

/*

Artem Gafetinov, [04.02.19 12:23]
А если команды user, date, sort введены без параметров, то выводить wrong command?

Veronika, [04.02.19 12:58]
да

*/
