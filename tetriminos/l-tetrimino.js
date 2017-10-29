define(['tetrimino'], function(Tetrimino) {
	class LTetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			this.color = "orange";

			this.matrix = {
				"0":
				[
					[1, 0],
					[1, 0],
					[1, 1]
				],
				"90":
				[
					[0, 0, 1],
					[1, 1, 1]
				],
				"180":
				[
					[1, 1],
					[0, 1],
					[0, 1]
				],
				"270":
				[
					[1, 1, 1],
					[1, 0, 0]
				]
			};
		}
	}

	return LTetrimino;
});