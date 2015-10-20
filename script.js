var rowNames =    ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
var columnNames = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
var shipLengths = [5, 4, 3, 3, 2];

var feilds = new Array();

var outConsole = document.getElementById("console-window");

function print(string) {
	outConsole.innerHTML += string;
	outConsole.scrollTop = outConsole.scrollHeight;
}

function println(string) {
	print(string + "<br/>");
}

// This breaks IE
function alertPosition() {
	var x = parseInt(this.getAttribute("x"));
	var y = parseInt(this.getAttribute("y"));

	var feild = feilds[this.getAttribute("feildIndex")];

	if(feild.data[y][x].peg === undefined) {
		var pegholder = document.createElement("div");
		var peg = document.createElement("div");
		pegholder.appendChild(peg);

		pegholder.className = "peg-holder";
		if(feild.data[y][x].id === 0) {
			peg.className = "white-peg";
            println(feild.id + ": Miss!");
		} else {
			peg.className = "red-peg";
		}

		feild.data[y][x].domCell.appendChild(pegholder);
		feild.data[y][x].peg = peg;
	}

	var shipId = feild.data[y][x].id
	if(shipId !== 0) {
		feild.data[y][x].id = 0;
		feild.ships[shipId-1].health--;
		if(feild.ships[shipId-1].health <= 0) {
			var domobj = feild.ships[shipId-1].dom;
		    domobj.parentNode.removeChild(domobj);
            --feild.shipsRemaining;
            feild.updateScore();
            println(feild.id + ": Sunk!");
		} else {
            println(feild.id + ": Hit!");
        }
	}
}

function Ship(id, length, x, y, axis) {
	this.id = id;
	this.length = length;
	this.health = length;
	this.x = x;
	this.y = y;
	this.axis = axis;
}

Ship.prototype.randomizePlacement = function() {
	var other;
	if(Math.random() < .5) {
		this.axis = "x";
		other = "y";
	} else {
		this.axis = "y";
		other = "x";
	}
	
	this[this.axis] = Math.floor(Math.random() * (this.length + 1));
	this[other] = Math.floor(Math.random() * 10);
}

/* returns true upon success and false upon failure. */
Ship.prototype.place = function(feild) {
	var point = {
		x: this.x,
		y: this.y
	};
	var goal = this[this.axis] + this.length;

	for (; point[this.axis]<goal; ++point[this.axis])
		if (feild.data[point.y][point.x].id !== 0)
			return false; // TODO: Throw error instead?

	// Reset the axis we iterated over
	point[this.axis] = this[this.axis];

	var direction = this.axis === "x" ? "width" : "height";
	var style = direction + ":calc(" + (2.25 * this.length - .25) + "em + " + (this.length-1)*2 + "px);";

	this.dom = document.createElement("div");
	this.dom.className = "ship";
    this.dom.className += " hide-" + feild.id;
	this.dom.style=style;
//	this.dom.className += " hidden";
	feild.data[point.y][point.x].domCell.appendChild(this.dom);

	for (; point[this.axis]<goal; ++point[this.axis]) {
		feild.data[point.y][point.x].id = this.id;
	}
	
	return true;
}

function Feild(id, scoreId) {
	/* Create grid, a 2 dimensional array representing the in game grid. Each
	 * element in grid is an index to a ship, zero if no ship is placed there,
	 * or a negative number if a ship has been hit there. */

	this.table = this.createTable(id);

    this.id = id;
	feilds[id] = this;

	this.data = new Array(10);
	for(var y=0; y<this.data.length; ++y) {
		this.data[y] = new Array(10);
		for(var x=0; x<this.data[y].length; ++x) {
			this.data[y][x] = { id: 0 };
			this.data[y][x].domCell = this.table.firstChild.children[y+1].children[x+1].firstChild;
			this.data[y][x].domCell.setAttribute("x", x);
			this.data[y][x].domCell.setAttribute("y", y);
			this.data[y][x].domCell.setAttribute("feildIndex", id);
			this.data[y][x].domCell.onclick = alertPosition;
		}
	}

	this.ships = new Array(shipLengths.length);
	for(var i = 0; i<this.ships.length; ++i) {
		this.ships[i] = new Ship(i+1, shipLengths[i]);
	}

	this.shipsRemaining = shipLengths.length;
    this.scoreDisplay = document.getElementById(scoreId);
    this.updateScore();
}

Feild.prototype.updateScore = function() {
    this.scoreDisplay.innerHTML = "" + this.shipsRemaining;
}

Feild.prototype.createTable = function (id) {
	var tbl  = document.createElement('table');
	tbl.id = id;

	for(var y = 0; y < 11; ++y){
		var tr = tbl.insertRow();
		for(var x = 0; x < 11; ++x){
			if (x === 0 || y === 0) {
				var cell = document.createElement("th");
				if (x === 0) {
					cell.innerHTML = rowNames[y];
				} else { // y === 0
					cell.innerHTML = columnNames[x];
				}
				tr.appendChild(cell);
			} else {
				var cell = tr.insertCell();
				cell.innerHTML = '<div class="cell"></div>';
			}
		}
	}

	return tbl;
}

Feild.prototype.randomize = function () {
	for(var i=0; i<this.ships.length; ++i) {
		var loop;
		do {
			this.ships[i].randomizePlacement();
			loop = !this.ships[i].place(this);
		} while (loop);
	}
}

// TODO: replace feildx and playerx-score with just x
var feild1 = new Feild("feild1", "player1-score", 1);
var feild2 = new Feild("feild2", "player2-score", 2);

document.body.appendChild(feild1.table);
document.body.appendChild(feild2.table);

feild1.randomize();
feild2.randomize();

$('.ship').toggle();

$('#player1').click(function() {
    $('.hide-feild1').toggle();
});

$('#player2').click(function() {
    $('.hide-feild2').toggle();
});



