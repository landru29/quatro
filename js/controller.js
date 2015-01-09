"use strict";

angular.module('quatroApp').controller('myController', ['$scope', '$localStorage', function($scope, $localStorage) {

	$scope.cubeSize = 200;
	$scope.winner = null;
	$scope.winSound = new Audio('sounds/quatro-win.mp3');

	plate.init($scope.cubeSize);
	plate.createBase($scope.cubeSize, 'img/material.jpg');

	$scope.$storage = $localStorage.$default({
		players: {
			'player1-caption': 'Player1',
			'player2-caption': 'Player2'
		}
	});

	$scope.game = new quatroLib({
		players: [{
			name: 'Player1',
			caption: $scope.$storage.players['player1-caption'],
			textureUrl: 'img/texture1.jpg',
			sound: new Audio('sounds/quatro-player1.mp3')
		}, {
			name: 'Player2',
			caption: $scope.$storage.players['player2-caption'],
			textureUrl: 'img/texture2.jpg',
			sound: new Audio('sounds/quatro-player2.mp3')
		}]
	});

	$scope.currentPlayer = $scope.game.getCurrentPlayer();
	$scope.players = $scope.game.getPlayers();
	$scope.canUndo = false;

	$scope.undoLastTrick = function() {
		$scope.canUndo = false;
		var data = $scope.game.undo();
		if (data) {
			plate.removeCube($scope.cubeSize, data.x, data.y, data.z);
		}
		$scope.currentPlayer = $scope.game.getCurrentPlayer();
	}

	$scope.rotateCam = function(degree) {
		plate.rotateCam(degree);
	}

	$scope.checkWinner = function() {
		var winner = $scope.game.checkWinner();
		if (winner) {
			alert('Winner is ' + winner);
		}
	};

	$scope.cleanMetadata = function() {
		$scope.game.cleanMetadata();
	};

	$scope.reset = function() {
		$scope.game.reset();
	};

	$scope.checkPlayerTexture = function(player) {
		if (!player.texture) {
			player.texture = plate.createTexture(player.textureUrl);
		}
	}

	plate.setPlayCallback(function(x, y, me) {
		var obj = $scope.game.play(x, y);
		if (obj) {
			$scope.canUndo = true;
			obj.player.sound.play();
			$scope.checkPlayerTexture(obj.player);
			me.removeDummyCube(x, y);
			obj.cell.setData({
				mesh: me.addCube($scope.cubeSize, obj.player.textureUrl, obj.x, obj.y, obj.z)
			});
			if (obj.z < 4) {
				me.addDummyCube($scope.cubeSize, obj.x, obj.y, obj.z + 1);
			}
			$scope.winner = $scope.game.checkWinner();
			$scope.currentPlayer = $scope.game.getCurrentPlayer();
			$scope.allData = $scope.game.getAllData();
			$scope.$apply();
			if ($scope.winner) {
				$scope.winSound.play();
				me.end();
				me.highlightWinner($scope.game.getAllData());
			}
		}
	});

	$scope.$watch('players.Player1.caption', function(newVal) {
		$localStorage.players['player1-caption'] = newVal;
	});

	$scope.$watch('players.Player2.caption', function(newVal) {
		$localStorage.players['player2-caption'] = newVal;
	});

}]);