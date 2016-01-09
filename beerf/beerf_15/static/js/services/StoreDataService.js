app.factory('StoreDataService', ['$http', StoreDataService]);

function StoreDataService($http){

	var service = {
		getStoreDetails: getStoreDetails
	};

	return service;

	function getStoreDetails(){

	}

	
}