module.exports = {
	matchDate: (date) => date.match(/^[0-9]{4,4}$|^[0-9]{4,4}-[0-1]{1,1}[0-9]{1,1}$|^[0-9]{4,4}-[0-1]{1,1}[0-9]{1,1}-[0-9]{1,1}[0-9]{1,1}$/), // validate date - xxxx || xxxx-xx || xxxx-xx-xx
};
