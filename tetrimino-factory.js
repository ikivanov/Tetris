(function() {
	window.TetrisNamespace = window.TetrisNamespace || {};

	var TetriminoName = {
		"I": "ITetrimino",
		"J": "JTetrimino",
		"L": "LTetrimino",
		"O": "OTetrimino",
		"S": "STetrimino",
		"T": "TTetrimino",
		"Z": "ZTetrimino"
	}

	function TetriminoFactory() {
	}

	TetriminoFactory.prototype = {
		GetNextTetrimino: function() {

		},

		CreateById: function(id, config) {
			var name = TetriminoName[id];

			if (!name) {
				throw new Error("Invalid tetrimino identifier!");
			}

			var tetrimino = new TetrisNamespace[name](config);
			return tetrimino;
		}
	};

	TetrisNamespace.TetriminoName = TetriminoName;
	TetrisNamespace.TetriminoFactory = new TetriminoFactory();
}) ();

