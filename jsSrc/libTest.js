//	1,1	1,2	1,3	1,4	1,5	1,6
//	2,1	2,2	2,3	2,4	2,5	2,6
//	3,1	3,2	WW	BB	3,5	3,6 == 3,3
//	4,1	4,2	BB	WW	4,5	4,6
//	5,1	5,2	5,3	5,4	5,5	5,6
//	6,1	6,2	6,3	6,4	6,5	6,6

//	1,1	1,2	1,3	1,4	1,5	1,6
//	2,1	2,2	2,3	2,4	2,5	2,6
//	3,1	BB	BB	BB	3,5	3,6  == 2,2
//	4,1	4,2	BB	WW	4,5	4,6
//	5,1	5,2	5,3	5,4	5,5	5,6
//	6,1	6,2	6,3	6,4	6,5	6,6

//	1,1	1,2	1,3	1,4	1,5	1,6
//	2,1	2,2	2,3	2,4	2,5	2,6
//	3,1	BB	WW	BB	3,5	3,6 == 5,2
//	4,1	WW	WW	WW	4,5	4,6
//	5,1	5,2	5,3	5,4	5,5	5,6
//	6,1	6,2	6,3	6,4	6,5	6,6

var assert = require('chai').assert;
var lib = require('./lib.js').lib;
var Grid = new require('./createGrid.js').createGrid;

var grid;
describe('findNeighbours',function() {
	before(function(){
		grid = new Grid(6,6,'p',{enabled: true, value: 'empty'});
		grid['[3,3]'].value = 'W';
		grid['[3,4]'].value = 'B';
		grid['[4,3]'].value = 'B';
		grid['[4,4]'].value = 'W';
	});
	it("should return [{id:'[3,3]', direction:[1,-1]}] for [3,2] in initially ", function() {
		var neighbours = lib.findNeighbours(grid,'[3,2]','B');
		assert.deepEqual(neighbours,[{id:'[3,3]', direction:[0,1]}]);
	});
	it("should return [{id:'[3,3]', direction:[1,-1]}] for [2,4] in initially ", function() {
		var neighbours = lib.findNeighbours(grid,'[2,4]','B');
		assert.deepEqual(neighbours,[{id:'[3,3]', direction:[1,-1]}]);
	});
	it("should return [] for [1,1] in initially ", function() {
		var neighbours = lib.findNeighbours(grid,'[1,1]','B');
		assert.deepEqual(neighbours,[]);
	});

});

describe('findOutflank',function() {
	beforeEach(function(){
		grid = new Grid(6,6,'p',{enabled: true, value: 'empty'});
		grid['[3,3]'].value = 'W';
		grid['[3,4]'].value = 'B';
		grid['[4,3]'].value = 'B';
		grid['[4,4]'].value = 'W';
	});
	it("should return ['[3,3]'] for [3,2] in initially ", function() {
		var outflanks = lib.findOutflank(grid,'[3,2]','B');
		assert.deepEqual(outflanks,['[3,3]']);
	});
	it("should return [] for [2,4] in initially ", function() {
		var outflanks = lib.findOutflank(grid,'[2,4]','B');
		assert.deepEqual(outflanks,[]);
	});
	it("should return ['[3,3]'] for [2,2] after few steps", function() {
		grid['[3,2]'].value = 'B';
		grid['[3,3]'].value = 'B';
		var outflanks = lib.findOutflank(grid,'[2,2]','W');
		assert.deepEqual(outflanks,['[3,3]']);
	});
	it("should return ['[3,3]','[4,4]'] for [2,2] after few steps ", function() {
		grid['[5,5]'].value = 'B';
		var outflanks = lib.findOutflank(grid,'[2,2]','B');
		assert.deepEqual(outflanks,['[3,3]','[4,4]']);
	});
	it("should return ['[4,2]','[4,3]'] for [5,2] after few steps ", function() {
		grid['[3,2]'].value = 'B';
		grid['[4,2]'].value = 'W';
		grid['[4,3]'].value = 'W';
		var outflanks = lib.findOutflank(grid,'[5,2]','B');
		assert.deepEqual(outflanks,['[4,2]','[4,3]']);
	});
});