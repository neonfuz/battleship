var shipLengths = [5, 4, 3, 3, 2];

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
