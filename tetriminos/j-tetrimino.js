define(['tetrimino'], function(Tetrimino) {
	class JTetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			this.color = "blue";

			this.matrix = {
				"0":
				[
					[0, 1],
					[0, 1],
					[1, 1]
				],
				"90":
				[
					[1, 1, 1],
					[0, 0, 1]
				],
				"180":
				[
					[1, 1],
					[1, 0],
					[1, 0]
				],
				"270":
				[
					[1, 0, 0],
					[1, 1, 1]
				]
			};
		}
	}

	return JTetrimino;
});