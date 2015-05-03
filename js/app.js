var bikesApp = angular.module('bikesApp', [
	'ngAnimate',
	'ngTouch'
]);

bikesApp.controller('mainController', ['$scope', '$http', '$window', function($scope, $http, $window){

	// Get catalogue data
	// If a multi-page app, would put this in a service
	var url = 'http://seq-front-end-assessment.s3-website-us-west-2.amazonaws.com/catalog.json';
	$http.get(url).
		success(function(data, status){
			console.log('Data recieved:');
			console.log(data);

			// Break-up each model name into 2 properties

			$scope.catalog = data;
			setSlider($scope.catalog);
		}).
		error(function(data, status){
			console.error('Error retrieving data: '+ status);
		});


	// SLIDER
	//================
	// If a larger app, would make own directive

	var setSlider = function(catalog){

		// First, set container width
		$scope.itemNumber = catalog.products.length;
		$scope.itemWidth = $window.innerWidth * 0.8; // Set image width to 80% of window
		var initialPos = $window.innerWidth * 0.1; // Center slider by moving left 10%;
		var sliderWidth = $scope.itemWidth * $scope.itemNumber;

		angular.element('.slider').css({'width': sliderWidth, 'left':initialPos});
	};

	// Set control actions
	$scope.slidePosition = 0;

	$scope.next = function() {
		if ($scope.slidePosition < $scope.itemNumber-1) {
			angular.element('.slider').css('left', '-='+$scope.itemWidth);
			$scope.slidePosition++;
		}
	};

	$scope.prev = function() {
		if ($scope.slidePosition > 0) {
			angular.element('.slider').css('left', '+='+$scope.itemWidth);
			$scope.slidePosition--;
		}
	};

	$scope.goToSlide = function(target) {
		var slideTarget = target - 1;
		var slideChange = slideTarget - $scope.slidePosition;
		var slideDist = slideChange * $scope.itemWidth;

		angular.element('.slider').css('left', '-='+slideDist);
		$scope.slidePosition = slideTarget;
	};



	// QUICK-VIEW POPUP CONTAINER
	//==============================

	$scope.showQV = false;

	$scope.openQV = function() {
		$scope.focus = $scope.catalog.products[$scope.slidePosition];

		$scope.showQV = true;
	}

	$scope.closeQV = function() {
		$scope.showQV = false;
	}



}]);