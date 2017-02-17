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
		var that = this;

		that.angles = [0, 90, 180, 270];
		that.probabilities = ["I", "J", "L", "O", "S", "T", "Z"];
	}

	TetriminoFactory.prototype = {
		getNextTetrimino: function(tetris) {
			var that = this,
				probabilityIndex = Math.floor(Math.random() * that.probabilities.length),
				id = that.probabilities[probabilityIndex],
				angleIndex = Math.floor(Math.random() * that.angles.length),
				angle = that.angles[angleIndex];

			return that.createById(id, {tetris: tetris, angle: angle});
		},

		createById: function(id, config) {
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

