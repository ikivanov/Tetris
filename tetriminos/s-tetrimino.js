define(['tetrimino'], function(Tetrimino) {
	class STetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			const horizontal =
				[
					[0, 1, 1],
					[1, 1, 0]
				],
				vertical =
				[
					[1, 0],
					[1, 1],
					[0, 1]
				];

			this.color = "green";

			this.matrix = {
				"0": horizontal,
				"90": vertical,
				"180": horizontal,
				"270": vertical
			};
		}
	}

	return STetrimino;
});