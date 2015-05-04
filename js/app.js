var bikesApp = angular.module('bikesApp', [
	'ngAnimate',
	'ngTouch'
]);

bikesApp.controller('mainController', ['$scope', '$http', '$window', '$swipe', function($scope, $http, $window, $swipe){

	// GET DATA
	//====================
	// If a multi-page app, would put this in a service
	var url = 'http://seq-front-end-assessment.s3-website-us-west-2.amazonaws.com/catalog.json';
	$http.get(url).
		success(function(data, status){
			// console.log('Data recieved:');
			// console.log(data);

			// Adjust data
			angular.forEach(data.products, function(product, key) {

				// Break up model number and name
				var splitName = product.name.split(" ");

				product.model = splitName[0] +' '+ splitName[1] +' '+ splitName[2];
				product.name = ''; // reset the name
				for (var i = 3; i < splitName.length; i++) {
					// model name begins after third string
					product.name += splitName[i];

					// add space if another word
					if (splitName[i+1]) {
						product.name += ' ';
					}
				}

				// Add specs
				product.specs = {};
				product.specs.gearing = 'freewheel';
				product.specs.handlebars = 'bullhorn';
				product.specs.frame = '5\'4\"-5\'11\"';

				// Add thumbnails
				product.thumbs = [
					"images/thumbs/thumb1.png",
					"images/thumbs/thumb2.png",
					"images/thumbs/thumb3.png",
					"images/thumbs/thumb4.png"
				];
			});

			// console.log('New data:');
			// console.log(data);

			$scope.catalog = data;
			setSlider($scope.catalog);
		}).
		error(function(data, status){
			console.error('Error retrieving data: '+ status);
		});



	// SLIDER
	//================
	// If a larger app, would make into own directive
	var sliderEl = angular.element('.slider');

	var setSlider = function(catalog){

		// Test for mobile by screen size
		$scope.isMobile = ($window.outerWidth < 768) ? 
			true : false;
		$scope.itemNumber = catalog.products.length;

		if ($scope.isMobile) {
			console.log('mobile device');
			console.log('Width: '+ $window.outerWidth);

			$scope.itemWidth = $window.outerWidth; // Full width on mobile
			var initialPos = 0;
		} else {
			console.log('standard device');	

			$scope.itemWidth = $window.innerWidth * 0.8; // Set image width to 80% of window
			var initialPos = $window.innerWidth * 0.1; // Center slider by moving left 10%;
		}

		var sliderWidth = $scope.itemWidth * $scope.itemNumber;

		sliderEl.css({'width': sliderWidth, 'left':initialPos});
	};

	// Set control actions
	$scope.slidePosition = 0;

	$scope.next = function() {
		if ($scope.slidePosition < $scope.itemNumber-1) {
			sliderEl.css('left', '-='+$scope.itemWidth);
			$scope.slidePosition++;
		}
	};

	$scope.prev = function() {
		if ($scope.slidePosition > 0) {
			sliderEl.css('left', '+='+$scope.itemWidth);
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

	// Touch event handler
	if ($scope.isMobile) {
		$swipe.bind( sliderEl, {
			'start': function(coords) {
				startX = coords.x;
				startY = coords.y;

				startPos = parseInt( sliderEl.css('left'), 10);
			},
			'move': function(coords) {
				var moveDist = startX - coords.x;
				var slidePos = startPos - moveDist;

				// Move images with drag
				sliderEl.css('left', slidePos);
			},
			'end': function(coords) {
				var fullDist = startX - coords.x;
				var minMoveDist = $scope.itemWidth/2
				console.log('Just moved '+ fullDist + ' Min Dist: '+ minMoveDist);

				if (fullDist > minMoveDist && ($scope.slidePosition < $scope.itemNumber-1) ) {
					// next slide
					sliderEl.css('left', startPos - $scope.itemWidth);
					$scope.slidePosition++;
				} else if (fullDist < -minMoveDist && ($scope.slidePosition > 0)) {
					// previous slide
					sliderEl.css('left', startPos + $scope.itemWidth);
					$scope.slidePosition--;
				} else {
					sliderEl.css('left', startPos);
				}
			},
			'cancel': function(coords) {
				sliderEl.css('left', startPos);
			}
		});
	}


	// QUICK-VIEW POPUP CONTAINER
	//==============================

	$scope.showQV = false;
	$scope.currentThumb = 0;

	$scope.openQV = function() {
		$scope.focus = $scope.catalog.products[$scope.slidePosition];

		$scope.showQV = true;
		$scope.currentThumb = 0;
	}

	$scope.closeQV = function() {
		$scope.showQV = false;
	}

	$scope.showThumb = function(num) {
		$scope.currentThumb = num;
		var mainImg = angular.element('.mainImg');

		var newSrc = (num > 0) ? 
			"images/thumbs/thumb"+num+"_LARGE.png" :
			"images/slideshow/"+ $scope.focus.id + ".png";

		mainImg.attr('src', newSrc);
	}

	$scope.thankYou = function(){
		angular.element('.buyNow').text('THANKS!').addClass('disable');
	}



}]);