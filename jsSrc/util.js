exports.util = {
	flatArray: function(array){
		return array.reduce(function(concated, element) {
			return concated.concat(element);
		},[]);
	}
};