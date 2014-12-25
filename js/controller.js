"use strict";

angular.module('quatroApp').controller('myController', ['$scope', function($scope) {

	$scope.game = new quatroLib;

	$scope.cubeSize = 200;

	plate.init($scope.cubeSize);
	plate.createBase($scope.cubeSize, 'img/material.jpg');

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

}]);