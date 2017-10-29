define(['tetrimino'], function(Tetrimino) {
	class ZTetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			const horizontal =
				[
					[1, 1, 0],
					[0, 1, 1]
				],
				vertical =
				[
					[0, 1],
					[1, 1],
					[1, 0]
				];

			this.color = "red";
			this.matrix = {
				"0": horizontal,
				"90": vertical,
				"180": horizontal,
				"270": vertical
			};
		}
	}

	return ZTetrimino;
});