define(['tetrimino'], function(Tetrimino) {
	class ITetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			const horizontal =
				[
					[1, 1, 1, 1]
				],
				vertical =
				[
					[1],
					[1],
					[1],
					[1]
				];


			this.color = "cyan";

			this.matrix = {
				"0": horizontal,
				"90": vertical,
				"180": horizontal,
				"270": vertical
			};
		}
	}

	return ITetrimino;
});