(function() {
	window.TetrisNamespace = window.TetrisNamespace || {};

	const TetriminoName = {
		"I": "ITetrimino",
		"J": "JTetrimino",
		"L": "LTetrimino",
		"O": "OTetrimino",
		"S": "STetrimino",
		"T": "TTetrimino",
		"Z": "ZTetrimino"
	}

	class TetriminoFactory {
		constructor() {
			this.angles = [0, 90, 180, 270];
			this.probabilities = ["I", "J", "L", "O", "S", "T", "Z"];
		}

		getNextTetrimino(tetris) {
			const probabilityIndex = Math.floor(Math.random() * this.probabilities.length),
				id = this.probabilities[probabilityIndex],
				angleIndex = Math.floor(Math.random() * this.angles.length),
				angle = this.angles[angleIndex];

			return this.createById(id, {tetris: tetris, angle: angle});
		}

		createById(id, config) {
			const name = TetriminoName[id];

			if (!name) {
				throw new Error("Invalid tetrimino identifier!");
			}

			const tetrimino = new TetrisNamespace[name](config);
			return tetrimino;
		}
	}

	TetrisNamespace.TetriminoName = TetriminoName;
	TetrisNamespace.TetriminoFactory = new TetriminoFactory();
}) ();