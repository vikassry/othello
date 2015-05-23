var othello = require('./integration.js').othello;
var game = new othello();
game.start();
game.changePlayer();
// var id = game.listener();
var id = '[3,2]';
(!game.update(id)) && console.log('not a valid move');
console.log(game);