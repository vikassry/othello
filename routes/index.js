var express = require('express');
var router = express.Router();
//var app = require('express')();

module.exports = router;


router.get('/', function(req, res){
  res.render('index');
});

router.get('/game',function(req,res){
  res.render('othello');
});

//io.on('connection', function(socket){
//  socket.on('chat message', function(msg){
//    io.emit('chat message', msg);
//  });
//});

//http.listen(3000, function(){
//  console.log('listening on *:3000');
//});

