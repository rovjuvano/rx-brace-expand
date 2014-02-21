require('should');
var braceExpand = require('..');
var context = describe;
describe('rxjs-brace-expand', function() {
	context('with no braces', function() {
		it('expands to given string', function(done) {
			var pattern = ''+Math.random();
			var result = [];
			braceExpand(pattern).subscribe(
				function(string) { result.push(string) },
				function(err) { done(err) },
				function() {
					result.should.eql([pattern]);
					done();
				}
			);
		})
	})

	context('with a single pair of braces', function() {
		it('combines parts', function(done) {
			var pattern = 'A{1,2}Z';
			var result = [];
			braceExpand(pattern).subscribe(
				function(string) { result.push(string) },
				function(err) { done(err) },
				function() {
					var expect = ['A1Z', 'A2Z'];
					result.should.eql(expect);
					done();
				}
			);
		})
	})

	context('with a single sequence ascending', function() {
		it('combines parts', function(done) {
			var pattern = 'A{1..3}Z';
			var result = [];
			braceExpand(pattern).subscribe(
				function(string) { result.push(string) },
				function(err) { done(err) },
				function() {
					var expect = ['A1Z', 'A2Z', 'A3Z'];
					result.should.eql(expect);
					done();
				}
			);
		})
	})
})
