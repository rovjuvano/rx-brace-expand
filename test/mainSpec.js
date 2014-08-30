require('should');
var braceExpand = require('..');
var context = describe;
var _it = it;
it = function(message, pattern, expected) {
	if (!expected) {
		expected = [pattern];
	}
	_it(message, function(done) {
		var result = [];
		braceExpand(pattern).subscribe(
			function(string) { result.push(string) },
			function(err) { done(err) },
			function() {
				result.should.eql(expected);
				done();
			}
		);
	});
};
describe('rxjs-brace-expand', function() {
	context('with no braces', function() {
		it('expands to given string', ''+Math.random());
	})

	describe('{,}', function() {
		it('expands for each string in list', 'A{1,2,3}Z', ['A1Z', 'A2Z', 'A3Z']);
	});

	describe('{..}', function() {
		it('expands for each integer in range', 'A{1..3}Z', ['A1Z', 'A2Z', 'A3Z']);
		it('expands descending', 'A{3..1}Z', ['A3Z','A2Z','A1Z']);
		it('expands negative integers', 'A{-3..-1}Z', ['A-3Z','A-2Z','A-1Z']);
		it('expands ascending by step', 'A{1..5..2}Z', ['A1Z','A3Z','A5Z']);
		it('expands descending by step', 'A{5..1..2}Z', ['A5Z','A3Z','A1Z']);
		it('ignores negative in step (positive)', 'A{1..5..-2}Z', ['A1Z','A3Z','A5Z']);
		it('ignores negative in step (negative)', 'A{5..1..-2}Z', ['A5Z','A3Z','A1Z']);
		it('pads number (positive)', 'A{01..1111..555}Z', ['A0001Z', 'A0556Z', 'A1111Z']);
	});
})
