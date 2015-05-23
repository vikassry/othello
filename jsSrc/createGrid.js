var copyObject = function(object){
	return JSON.parse(JSON.stringify(object));
};

var createGrid = function (totalRows, totalCols, element, attributes){
	var grid = this;
	var Element = element;
	var createCell = function(rowno,colno,returnTag){
		var element = returnTag || Element;
		var id = JSON.stringify([rowno,colno]);
		if(returnTag){
			grid[returnTag+id] = {tag: returnTag};
			return;
		}
		grid[id] = copyObject(attributes);
		grid[id].id = id;
		grid[id].tag = element;
	};
	var createRow = function (rowno,cols){
		if(totalCols < cols) return createCell(rowno,cols,'CRNL');
		createCell(rowno,cols);
		createRow(rowno,cols+1);
	};
	var createRows = function (rows,cols){
		if(totalRows < rows) return ;
		createRow(rows,cols);
		createRows(rows+1,1);
	};
	createRows(1,1);
	return grid;
};

createGrid.prototype = {
	asHtml: function(){
		var grid = this;
		var innerHTML = Object.keys(grid).map(function (elementName){
			var element = grid[elementName];
			var elementAttributes = Object.keys(element).map(function (att){
				return (att == 'tag')? '' : att+'="'+element[att]+'"';
			}).join(' ');
			return '<'+element['tag']+' '+elementAttributes+'>'+'O'+'</'+element['tag']+'>';
		}).join(' ');
		return innerHTML.replace(/<CRNL >O<\/CRNL>/g,'<br>');
	},
	setGrid: function (htmlParentElement, grid){
		htmlParentElement.innerHTML = grid.asHtml();
	}
};

exports.createGrid = createGrid;