var rowNames = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var columnNames = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
var shipLengths = [5, 4, 3, 3, 2];

function createTable(id) {
	var tbl  = document.createElement('table');
	tbl.id = id;

    for(var y = 0; y < 11; ++y){
        var tr = tbl.insertRow();
        for(var x = 0; x < 11; ++x){
			if (x === 0 || y === 0) {
				var cell = document.createElement("th");
				if (x === 0) {
					cell.innerHTML = columnNames[y];
				} else { // y === 0
					cell.innerHTML = rowNames[x];
				}
				tr.appendChild(cell);
			} else {
				tr.insertCell();
			}
        }
    }

	document.body.appendChild(tbl);
	return tbl;
}

// Create 2 tables
var tbl1 = createTable("table1");
var tbl2 = createTable("table2");

// Define some pegs
var redPeg = document.createElement("div");
var whitePeg = document.createElement("div");
redPeg.id = "red-peg";
whitePeg.id = "white-peg";

// Add some test pegs to the boards
tbl1.firstChild.children[2].children[2].appendChild(redPeg);
tbl2.firstChild.children[2].children[2].appendChild(whitePeg);

function Feild() {
	/* Create grid, a 2 dimensional array representing the in game grid. Each
	 * element in grid is an index to a ship, zero if no ship is placed there,
	 * or a negative number if a ship has been hit there. */
	this.grid = new Array(10);
	for(var y=0; y<this.grid.length; ++y) {
		this.grid[y] = new Array(10);
		for(var x=0; x<this.grid[y].length; ++x)
			this.grid[y][x] = 0;
	}

	var ships = new Array(5);
	for(var i = 0; i<ships.length; ++i) {
		ships[i] = new Ship(shipLengths[i]);
	}

	var shipsRemaining = 5;
}

Feild.prototype.Ship = function(length) {
	this.health = length;
}

var feild = new Array(10);
for(var i = 0; i<feild.length; ++i)
	feild[i] = new Array(10);
