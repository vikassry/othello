// var createGrid = require('./createGrid.js').createGrid;
// var lib = require('./lib.js').lib;

var findInitials = function(size){
	var offsets = [
		{o:[0,0],v:'W'},
		{o:[0,1],v:'B'},
		{o:[1,0],v:'B'},
		{o:[1,1],v:'W'}];
	var centre = JSON.stringify([size/2,size/2]);
	return offsets.map(function(offset){
		return {id: lib.idParser(centre,offset.o), value: offset.v};
	});
};

var othello = function(size,attributes) {
	if(size % 2 != 0) return false;
	var allAttributes = attributes || {};
	allAttributes.enabled = 'true';
	allAttributes.value = 'empty';
	this.grid = new createGrid(size,size,'button',allAttributes);
	this.allIds = Object.keys(this.grid).filter(function(id){
		return !(id.match('CRNL'));
	});
	this.player = 'B';
	this.initials = findInitials(size);
};

othello.prototype = {
	start : function() {
		var grid = this.grid;
		this.initials.forEach(function(initial) {
			grid[initial.id].value = initial.value;
			grid[initial.id].enabled = false;
		});
	},
	findOutflank : function(id) {
		return lib.findOutflank(this.grid,id,this.player);
	},
	isValidMove : function(id,game) {
		var thiS = game || this;
		var enabled = thiS.grid[id].enabled;
		var outflanks = thiS.findOutflank(id);
		return enabled && outflanks.length;
	},
	changePlayer : function() {
		this.player = (this.player == 'B') ? 'W' : 'B';
	},
	placer : function(id) {
		this.grid[id].enabled = false;
		this.grid[id].value = this.player;
	},
	flipper : function(fields_ids) {
		var grid = this.grid;
		fields_ids.forEach(function(id) {
			grid[id].value = (grid[id].value == 'B') ? 'W' : 'B';
		});
	},
	attacker : function(id) {
		this.flipper(this.findOutflank(id));
	},
	update : function(id) {
		var enabled = this.grid[id].enabled;
		if(this.isValidMove(id)){
			this.placer(id);
			this.attacker(id);
			this.changePlayer();
		}
	},
	toBeContinued : function() {
		var game = this;
		var possibility = game.allIds.some(function(id){
			return game.isValidMove(id,game);
		});
		return possibility;
	},
	declareWinner : function() {
		var game = this;
		var whites = this.allIds.reduce(function(carry,id){
			game.grid[id].value == 'W' && carry++;
			return carry;
		},0);
		var blacks = this.allIds.reduce(function(carry,id){
			game.grid[id].value == 'B' && carry++;
			return carry;
		},0)
		return (blacks > whites) ? "B" : (whites > blacks) ? "W" : "tie";
	}
};

// exports.othello = othello;