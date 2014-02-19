var Rx = require('rx');
module.exports = function(string) {
	return Rx.Observable.fromArray([string]);
};