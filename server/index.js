/* eslint-disable no-template-curly-in-string */
const http = require('http');
const url = require('url');
const eventBus = require('../core/eventBus');
const localDB = require('../db');
const createConsoleTable = require('../core/createTable');
const { matchDate } = require('../helpers/validator');
const {
	date: getDateByCommand,
	important: getImportantByCommand,
	show: getShowByCommand,
	user: getUserByCommand,
	sort: getSortByCommand,
} = require('../core/processCommands');
const { server } = require('../config');


const { port } = server;


http.createServer((req, res) => {
	res.writeHead(200, { // set headers for every request
		Connection: 'keep-alive',
		'Content-Type': 'text/event-stream; charset=utf-8',
		'Cache-Control': 'no-cache',
	});

	eventBus.on('newTodos', () => { // show txt in front by new todos
		res.write(`\nAVILABLE NEW TODOS. \nPlease reload page: ${new Date().toLocaleString()} \n`);
	});

	const srvUrl = url.parse(`http://${req.url}`); // parse url for swith by pathname and query validate


	switch (srvUrl.pathname) {
	case '/important': {
		res.write(createConsoleTable(getImportantByCommand(localDB.todos), false)); // send txt table
		break;
	}


	case '/show': {
		res.write(createConsoleTable(getShowByCommand(localDB.todos), false)); // send txt table
		break;
	}

	case '/user': {
		const [key, value] = srvUrl.query.split('=');

		if (key !== 'user' || !value) { // query validate
			res.end('wrong query: localhost:${port}/user?user={username}'); // send error and end
			break;
		}

		res.write(createConsoleTable(getUserByCommand(localDB.todos, `someCommand ${value}`), false)); // send txt table
	}
		break;
	case '/date': {
		const [key, value] = srvUrl.query.split('=');

		if (key !== 'date' || matchDate(value) === null) { // query validate
			res.end('wrong query or date: localhost:${port}/date?date={yyyy[-mm-dd]}​'); // send error and end
			break;
		}

		res.write(createConsoleTable(getDateByCommand(localDB.todos, `someCommand ${value}`), false)); // send txt table
	}
		break;
	case '/sort': {
		const [key, value] = srvUrl.query.split('=');

		const allowedValues = ['importance', 'user', 'date'];

		if (key !== 'by' || !allowedValues.includes(value)) { // query validate
			res.end('wrong query: localhost:${port}/sort?by={importance | user | date}'); // send error and end
			break;
		}

		res.write(createConsoleTable(getSortByCommand(localDB.todos, `someCommand ${value}`), false)); // send txt table
	}

		break;
	default: { // 'waterfall'
		const commands =
				`
localhost:${port} - show all commands.

localhost:${port}/show - show all todo withoit filters

localhost:${port}/important​ - only show todo that has an exclamation mark. The comment may contain an exclamation point (!), which means that this is a high priority task.

localhost:${port}/user?user={username} - show only comments from specified user's. 
    The user name is case-insensitive. Example command: "user veronika.​ ". 
    Initial letters of the user name list also showed up. That is, the result of the "user ve" command​ "is include same results as the "user veronika" command​ "(and maybe more, if there are other users with a name starting with ve)

localhost:${port}/sort?by={importance | user | date} - displays sorted todo If the argument importance​ , then first the comments with exclamation points, then everyone else. The more exclamation points, the higher the priority and the higher in the list this comment. 
    If the user argument​, it displays tasks grouped by user, and in the end ring. 
    If the date argument​, then the newest are displayed first, then older, then without date.

localhost:${port}/date?date={yyyy[-mm-dd]}​ - shows all comments that were created after a supplied date (inclusive). 
    The date can only be a year, a year with a month (hyphenated), or a year with a month and in the daytime. 
    Example commands: "date 2015​ ", "date 2016-02​ ", "date 2018-03-02​ ". 
    In response to the "date 2015" command​ "expected a list of t odo​ that were created in 2015 and later.
`;
		res.write(commands); // send commands
		break;
	}
	}

	setInterval(() => {
		res.write('\nWaiting for new todos...\n');
	}, 3000); // every 3 second send to front text about waiting
}).listen(port);

console.log('--------------------------------');
console.log(`Server started localhost:${port}`);
console.log('--------------------------------');
