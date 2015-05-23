var update = function(){

};
var startGame = function(){
	alert('pata hei kya?\r\nGAME OVER');
};
var initiate = function(html) {
	var initials = [['[4,4]','b'],['[5,4]','w'],['[4,5]','w'],['[5,5]','b']];
	initials.forEach(function(initial) {
		html.getElementById(initial[0]).innerHTML = initial[1];
	});
};