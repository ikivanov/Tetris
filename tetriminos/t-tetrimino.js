define(['tetrimino'], function(Tetrimino) {
	class TTetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			this.color = "purple";

			this.matrix = {
				"0":
				[
					[1, 1, 1],
					[0, 1, 0]
				],
				"90":
				[
					[0, 1],
					[1, 1],
					[0, 1]
				],
				"180":
				[
					[0, 1, 0],
					[1, 1, 1]
				],
				"270":
				[
					[1, 0],
					[1, 1],
					[1, 0]
				]
			};
		}
	}

	return TTetrimino;
});