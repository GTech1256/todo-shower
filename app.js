const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { 
    date, 
    important, 
    show 
} = require('./core/processCommands');
const logger = require('./core/logger');

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand (command) {
    // todo text to config.
    const commands = 
    `
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
`
    switch (command) {
        case 'date': // show all T.O.D.O with match date.
            date(command)
            break;
        case 'important​': // show all T.O.D.O with '!'.
        console.log('imp')
            important(command)
            break;
        case 'show​': // show all T.O.D.O.
            show(command)
            break;
        case 'help': // show all commands
            console.log(command);
            break;
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!

// main function
module.exports = () => {
    try {
        const files = getFiles();
        console.log(files, 'files');
        console.log('Please, write your command!');
        console.log('help - for show all commands.');
        readLine(processCommand); // do some magic with command from terminal
    } catch(e) {
        logger.error(e); // logging all unhandled errors
    }
}