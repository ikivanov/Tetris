define(['tetriminos/i-tetrimino',
		'tetriminos/j-tetrimino',
		'tetriminos/l-tetrimino',
		'tetriminos/o-tetrimino',
		'tetriminos/s-tetrimino',
		'tetriminos/t-tetrimino',
		'tetriminos/z-tetrimino'],
	function(ITetrimino, JTetrimino, LTetrimino, OTetrimino, STetrimino, TTetrimino, ZTetrimino) {
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

			const tetrimino = eval(`new ${name}(config)`);
			return tetrimino;
		}
	}

	return TetriminoFactory;
});