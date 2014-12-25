"use strict";

angular.module('quatroApp').controller('myController', ['$scope', function($scope) {

	$scope.game = new quatroLib;


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

}]);