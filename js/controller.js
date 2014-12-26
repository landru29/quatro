"use strict";

angular.module('quatroApp').controller('myController', ['$scope', function($scope) {

	$scope.game = new quatroLib;

	$scope.cubeSize = 200;

	$scope.currentPlayer = {};

	$scope.winner = null;

	plate.init($scope.cubeSize);
	plate.createBase($scope.cubeSize, 'img/material.jpg');

	$scope.game.addPlayer({
		name: 'Player1',
		caption: 'player1',
		texture: plate.createTexture('img/texture1.jpg')
	});
	$scope.game.addPlayer({
		name: 'Player2',
		caption: 'player2',
		texture: plate.createTexture('img/texture2.jpg')
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

	$scope.addCube = function() {
		plate.addCube($scope.cubeSize, 'img/material.jpg', 0, 0, 0);
	};

	$scope.play = function(x, y) {
		var obj = $scope.game.play(x, y);
		if (obj) {
			plate.addCube($scope.cubeSize, $scope.currentPlayer.texture, obj.x, obj.y, obj.z);
		}
	};

	$scope.$watch(function($scope) {
		return $scope.game.getCurrentPlayer();
	}, function(newVal) {
		$scope.currentPlayer = newVal;
	});

	$scope.$watch(function($scope) {
		return $scope.game.checkWinner();
	}, function(newVal) {
		$scope.winner = newVal;
	});

}]);