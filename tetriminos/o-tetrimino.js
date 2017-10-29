define(['tetrimino'], function(Tetrimino) {
	class OTetrimino extends Tetrimino {
		constructor(config) {
			super(config);

			this.color = "yellow";

			const rotation =
			[
				[1, 1],
				[1, 1]
			];

			this.matrix = {
				"0": rotation,
				"90": rotation,
				"180": rotation,
				"270": rotation
			};
		}
	}

	return OTetrimino;
});