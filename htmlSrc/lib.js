//	1,1	1,2	1,3	1,4	1,5	1,6
//	2,1	2,2	2,3	2,4	2,5	2,6
//	3,1	3,2	WW	BB	3,5	3,6
//	4,1	4,2	BB	WW	4,5	4,6
//	5,1	5,2	5,3	5,4	5,5	5,6
//	6,1	6,2	6,3	6,4	6,5	6,6
// grid , 3,2 B > 3,3

// var util = require('./util.js').util;
var lib = {};
// exports.lib = lib;

var directions = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
lib.idParser = function(id,offSet) {
	var id_ = JSON.parse(id);
	return JSON.stringify([
		id_[0]+offSet[0],
		id_[1]+offSet[1]
	]);
};

lib.findNeighbours = function(grid,id,player) {
	var allNeighbours = [];
	directions.forEach(function(direction) {
		var neighbour = {};
		var nId = lib.idParser(id,direction);
		if(grid[nId] && grid[nId].value != 'empty' && grid[nId].value != player){
			neighbour.id = nId;
			neighbour.direction = direction;
			allNeighbours.push(neighbour);
		}
	});
	return allNeighbours;
};

var getNeighbour = function(neighbour) {
	var id = neighbour.id;
	var offSet = neighbour.direction;
	var nextId = lib.idParser(id,offSet);
	var next = {
		id: nextId,
		direction: offSet
	};
	return next;
};

var isValid = function(neighbour,grid) {
	var id = neighbour.id;
	var state = grid[id] && grid[id].value != 'empty';
	return state;
};

var getRow = function(neighbour,grid) {
	if(!isValid(neighbour,grid)) return [];
	var next = getNeighbour(neighbour);
	var row = [neighbour].concat(getRow(next,grid));
	return row;
};

lib.trimRow = function(row,grid,player){
	var values = row.map(function(neighbour){return grid[neighbour.id].value;});
	var boundry = values.indexOf(player);
	if(boundry < 0) return [];
	return row.slice(0,boundry);
};

lib.findOutflank = function(grid,id,player) {
	var neighbours = lib.findNeighbours(grid,id,player);
	var outflanks = neighbours.map(function(neighbour) {
		var row = getRow(neighbour,grid);
		var outflank = lib.trimRow(row,grid,player);
		return outflank.map(function(o){
			return o.id;
		});
	});
	return util.flatArray(outflanks);
};