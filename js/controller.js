"use strict";

angular.module('quatroApp').controller('myController', ['$scope', function($scope) {

	$scope.game = new quatroLib;

	$scope.cubeSize = 200;

	$scope.currentPlayer = {};

	$scope.winner = null;

	$scope.navigation = true;

	//$scope.allData = [];

	plate.init($scope.cubeSize);
	plate.createBase($scope.cubeSize, 'img/material.jpg');


	$scope.game.addPlayer({
		name: 'Player1',
		caption: 'player1',
		textureUrl: 'img/texture1.jpg',
	});
	$scope.game.addPlayer({
		name: 'Player2',
		caption: 'player2',
		textureUrl: 'img/texture2.jpg',
	});

	$scope.players = $scope.game.getPlayers();

	$scope.checkWinner = function() {
		var winner = $scope.game.checkWinner();
		console.log(winner);
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

	$scope.$watch('navigation', function(newVal) {
		plate.controls.enableNavigation(newVal);
	});

	plate.setPlayCallback(function(x, y) {
		var obj = $scope.game.play(x, y);
		if (obj) {
			$scope.checkPlayerTexture(obj.player);
			plate.removeDummyCube(x, y);
			obj.cell.setData({
				mesh: plate.addCube($scope.cubeSize, obj.player.textureUrl, obj.x, obj.y, obj.z),
				texture: ''
			});
			if (obj.z < 4) {
				plate.addDummyCube($scope.cubeSize, obj.x, obj.y, obj.z + 1);
			}
		}
		$scope.winner = $scope.game.checkWinner();
		$scope.currentPlayer = $scope.game.getCurrentPlayer();
		$scope.allData = $scope.game.getAllData();
		$scope.$apply();
		if ($scope.winner) {
			plate.end();
			plate.highlightWinner($scope.game.getAllData());
		}
	});

}]);