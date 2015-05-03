var bikesApp = angular.module('bikesApp', [
	'ngAnimate',
	'ngTouch'
]);

bikesApp.controller('mainController', ['$scope', '$http', function($scope, $http){

	// Get catalogue data
	// If a multi-page app, would put this in a service
	var url = 'http://seq-front-end-assessment.s3-website-us-west-2.amazonaws.com/catalog.json';
	$http.get(url).
		success(function(data, status){
			console.log('Data recieved:');
			console.log(data);

			$scope.catalogue = data;
		}).
		error(function(data, status){
			console.error('Error retrieving data: '+ status);
		});

	

}]);