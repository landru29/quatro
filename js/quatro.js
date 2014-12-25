"use strict";


var quatroLib = function() {

	var init = function() {
		var result = {};
		for (var x = 0; x < 4; x++) {
			var xLine = {};
			for (var y = 0; y < 4; y++) {
				var yLine = {};
				for (var z = 0; z < 4; z++) {
					yLine['z' + z] = {
						value: null,
						highlight: false
					};
				}
				xLine['y' + y] = (yLine);
			}
			result['x' + x] = xLine;
		}
		return result;
	};

	var clean = function(data, keep) {
		if (!keep) keep = [];
		for (var x = 0; x < 4; x++) {
			for (var y = 0; y < 4; y++) {
				for (var z = 0; z < 4; z++) {
					var element = getElement(data, x, y, z);
					for (var index in element) {
						if (keep.indexOf(index) === -1) {
							element[index] = null;
						}
					}
				}
			}
		}
	}

	var checkXLines = function(data) {
		for (var y = 0; y < 4; y++) {
			for (var z = 0; z < 4; z++) {
				var series = [];
				for (var x = 0; x < 4; x++) {
					series.push(getElement(data, x, y, z));
				}
				var result = checkSeries(series);
				if (result) {
					return result;
				}
			}
		}
		return false;
	};

	var checkYLines = function(data) {
		for (var x = 0; x < 4; x++) {
			for (var z = 0; z < 4; z++) {
				var series = [];
				for (var y = 0; y < 4; y++) {
					series.push(getElement(data, x, y, z));
				}
				var result = checkSeries(series);
				if (result) {
					return result;
				}
			}
		}
		return false;
	};

	var checkZLines = function(data) {
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 4; x++) {
				var series = [];
				for (var z = 0; z < 4; z++) {
					series.push(getElement(data, x, y, z));
				}
				var result = checkSeries(series);
				if (result) {
					return result;
				}
			}
		}
		return null;
	};

	var checkZYDiag = function(data) {
		for (var x = 0; x < 4; x++) {
			var series = [
				[],
				[]
			];
			for (var i = 0; i < 4; i++) {
				series[0].push(getElement(data, x, i, i));
				series[1].push(getElement(data, x, i, 4 - 1 - i));
			}
			for (var j in series) {
				var result = checkSeries(series[j]);
				if (result) return result;
			}
		}
		return null;
	};

	var checkXZDiag = function(data) {
		for (var y = 0; y < 4; y++) {
			var series = [
				[],
				[]
			];
			for (var i = 0; i < 4; i++) {
				series[0].push(getElement(data, i, y, i));
				series[1].push(getElement(data, i, y, 4 - 1 - i));
			}
			for (var j in series) {
				var result = checkSeries(series[j]);
				if (result) return result;
			}
		}
		return null;
	};

	var checkXYDiag = function(data) {
		for (var z = 0; z < 4; z++) {
			var series = [
				[],
				[]
			];
			for (var i = 0; i < 4; i++) {
				series[0].push(getElement(data, i, i, z));
				series[1].push(getElement(data, i, 4 - 1 - i, z));
			}
			for (var j in series) {
				var result = checkSeries(series[j]);
				if (result) return result;
			}
		}
		return null;
	};

	var checkSuperDiag = function(data) {
		var series = [
			[],
			[],
			[],
			[]
		];
		for (var i = 0; i < 4; i++) {
			series[0].push(getElement(data, i, i, i));
			series[1].push(getElement(data, 4 - 1 - i, i, i));
			series[2].push(getElement(data, i, 4 - 1 - i, i));
			series[3].push(getElement(data, i, i, 4 - 1 - i));
		}
		for (var j in series) {
			var result = checkSeries(series[j]);
			if (result) return result;
		}
		return null;
	};

	var checkSeries = function(series) {
		var first = true;
		var ref;
		for (var i in series) {
			if (first) {
				ref = series[i];
				first = false;
			} else {
				if ((!ref.value) || (ref.value != series[i].value)) {
					return null;
				}
			}
		}
		// this is a winner series
		for (var i in series) {
			series[i].highlight = true;
		}
		return ref;
	};

	var getElement = function(data, x, y, z) {
		return data['x' + x]['y' + y]['z' + z];
	};


	this.setElement = function(x, y, z, data) {
		this.game['x' + x]['y' + y]['z' + z] = data;
	};

	this.getElement = function(x, y, z) {
		return getElement(this.game, x, y, z);
	}

	this.getData = function() {
		return this.game;
	};

	this.checkWinner = function() {
		var xLines = checkXLines(this.game);
		var yLines = checkYLines(this.game);
		var zLines = checkZLines(this.game);
		var xzLines = checkXZDiag(this.game);
		var xyLines = checkXYDiag(this.game);
		var zyLines = checkZYDiag(this.game);
		var superDiag = checkSuperDiag(this.game);

		if (xLines) return xLines;
		if (yLines) return yLines;
		if (zLines) return zLines;
		if (xzLines) return xzLines;
		if (xyLines) return xyLines;
		if (zyLines) return zyLines;
		if (superDiag) return superDiag;
		return null;
	};

	this.cleanMetadata = function() {
		clean(this.game, ['value']);
	};

	this.reset = function() {
		this.game = init();
	};

	this.game = init();
};