//	1,1	1,2	1,3	1,4	1,5	1,6
//	2,1	2,2	2,3	2,4	2,5	2,6
//	3,1	3,2	WW	BB	3,5	3,6 == 3,3
//	4,1	4,2	BB	WW	4,5	4,6
//	5,1	5,2	5,3	5,4	5,5	5,6
//	6,1	6,2	6,3	6,4	6,5	6,6

var assert = require('chai').assert;
var othello = require('./integration.js').othello;
var game;

describe("grid functionality",function() {
	describe("grid for 2x2 game with onClick attribute",function(){
		var size = 2;
		var attributes = {'onClick':'update()'};
		game = new othello(size,attributes);

		it("grid should accept only size of even number",function() {
			assert.notOk(Object.keys(new othello(3)).length);
			assert.ok(Object.keys(new othello(8)).length);
		});
		it("grid should contain 4 elements",function() {
			var gridLength = Object.keys(game.grid).length-size;
			assert.equal(gridLength,4);
		})
		it("allIds should contain allbutton ids [1,1], [1,2], [2,1], [2,2] ",function() {
			var buttonIds = ['[1,1]','[1,2]','[2,1]','[2,2]'];
			assert.deepEqual(game.allIds,buttonIds);
		})
		it("grid elements should have unique ids in stringified co-ordinate format",function() {
			var gridIds = Object.keys(game.grid);
			var checkFormat = function(id){return id.match(/\[[0-9]+\,[0-9]+\]/);};
			assert.ok(gridIds.every(checkFormat));
		})
		it("grid elements should contain default attributes {'value: empty', 'enabled:true', id: #id, tag: 'button'}",function() {
			var checkDefaults = function(id){
				var element = game.grid[id];
				return (element.value == 'empty') && element.enabled && (element.id == id) && (element.tag == 'button');
			};
			assert.ok(game.allIds.every(checkDefaults));
		})
		it("grid elements should contain given attributes also 'onClick:update()'", function() {
			var checkGiven = function(id){return game.grid[id]['onClick'] == 'update()'; };
			assert.ok(game.allIds.every(checkGiven));
		})
		it("the number of 'CRNL' elements should equals to the number of rows", function(){
			var crnls = Object.keys(game.grid).reduce(function(count,id){
				if(id.match('CRNL')) count++;
				return count;
			},0);
			assert.ok(size,crnls);
		})
		it("the initials should contain the central four elements ids ", function(){
			var initials = [
				{id:'[1,1]',value:'W'},
				{id:'[1,2]',value:'B'},
				{id:'[2,1]',value:'B'},
				{id:'[2,2]',value:'W'}];
			assert.deepEqual(initials,game.initials);
		})

	});
});

describe('Othello', function() {
	beforeEach(function() {
		game = new othello(6);
		game.start();
	});
	describe('start', function() {
		it("should initialize the game with 3,3 = w 3,4 = b 4,3 = b 4,4 = w", function() {
			assert.equal(game.grid['[3,3]'].value, 'W');
			assert.equal(game.grid['[3,4]'].value, 'B');
			assert.equal(game.grid['[4,3]'].value, 'B');
			assert.equal(game.grid['[4,4]'].value, 'W');
			assert.notOk(game.grid['[3,3]'].enabled);
			assert.notOk(game.grid['[3,4]'].enabled);
			assert.notOk(game.grid['[4,3]'].enabled);
			assert.notOk(game.grid['[4,4]'].enabled);
		});
	});
	describe('isValidMove',function() {
		it("should return false when disc is placed on a 'filled' field", function() {
			assert.notOk(game.isValidMove('[4,3]'));
		});
		it("should return true when outflanks are available", function() {
			assert.ok(game.isValidMove('[2,3]'));
		});
		it("should return false when outflank is not available", function() {
			assert.notOk(game.isValidMove('[2,4]'));
		});
	});
	describe('update',function() {
		it("should flip the 3,3 disc when a Black disc is placed on 3,2 -initially", function() {
			game.update('[3,2]');
			assert.equal(game.grid['[3,3]'].value, 'B');
			assert.notOk(game.grid['[3,2]'].enabled);
			assert.equal(game.player, 'W');
			game.update('[3,2]');
			assert.equal(game.grid['[3,3]'].value, 'B');
		});
	});
	describe("toBeContinued",function() {
		it("should return true when there are valid moves", function() {
			assert.ok(game.toBeContinued());
		})
		it("should return false when there is no valid move", function() {
			game.allIds.forEach(function(field){game.grid[field].enabled = false });
			assert.notOk(game.toBeContinued());
		})
	})
	describe("judge",function() {
		describe("WHITE",function(){
			it("should return W when there are more white discs than black discs", function() {
				game.grid['[6,2]'].value = 'W';
				assert.equal(game.declareWinner(),'W');
			})
		})
		describe("BLACK",function(){
			it("should return B when there are more black discs than white discs", function() {
				game.grid['[6,2]'].value = 'B';
				assert.equal(game.declareWinner(),'B');
			})
		})
		describe("TIE",function(){
			it("should return tie when there are equal number of black and white discs", function() {
				assert.equal(game.declareWinner(),'tie');
			})
		})
	})
});