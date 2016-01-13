(function(){

var app = angular.module('store',[]).config(function($interpolateProvider) {   
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');                      // So that django doesnt get confused
});


//   SERVICES 

// service for any-time functions
app.factory('AnyTimeFunctions', ['$http', function($http){

	console.log('id from app.js', id);
	console.log('factoryDetailsUrl from app.js', factoryDetailsUrl);
	console.log('getStatusUrl from app.js', getStatusUrl);

	getFactoryDetails = function(id) {

		return $http({
	   		 	method: 'POST',
	    		url: factoryDetailsUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id}
				})
				.success(function(json) {
	    					return json;
	  					})
	  			.error(function(err) {
	    					return err;
	  					});
	};

	getStatusDetails = function(id){

		return $http({
	   		 	method: 'POST',
	    		url: getStatusUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id}
				})
				.success(function(json) {
	    					return json;
	  					})
	  			.error(function(err) {
	    					return err;
	  					});
	};

	return {
		getFactoryDetails: getFactoryDetails,
		getStatusDetails: getStatusDetails
	};

}]);


// service for turn/stage based functions
app.factory('TurnStageBasedFunctions', ['$http', function($http){

	console.log('id from app.js', id);
	console.log('getDemandUrl from app.js', getDemandUrl);


	getDemandDetails = function(id, _turn, _stage){

		return $http({
	   		 	method: 'POST',
	    		url: getDemandUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id, turn: _turn, stage: _stage}
				})
				.success(function(json) {
	    					return json;
	  					})
	  			.error(function(err) {
	    					return err;
	  					});
	};

	viewDemandDetails = function(id, _turn, _stage){

		return $http({
	   		 	method: 'POST',
	    		url: viewDemandUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id, turn: _turn, stage: _stage}
				})
				.success(function(json) {
	    					return json;
	  					})
	  			.error(function(err) {
	    					return err;
	  					});
	};

	return  {
		getDemandDetails: getDemandDetails,
		viewDemandDetails: viewDemandDetails
	};



}]);


//  CONTROLLERS


//controller for the data inside tabs
app.controller('StoreController', ['AnyTimeFunctions', 'TurnStageBasedFunctions', function(AnyTimeFunctions, TurnStageBasedFunctions){					

	var vm = this;

	vm.products = [{
		orders: [
		{	
			from:"R1",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:1

		},
		{	
			from:"R2",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:1

		},
		{	
			from:"R3",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:1

		}],

		// ,{	
		// 	from:"R4",
		// 	order_no:100,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:2

		// },
		// {	
		// 	from:"R5",
		// 	order_no:150,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:2

		// },
		// {	
		// 	from:"R6",
		// 	order_no:200,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:2

		// },{	
		// 	from:"R7",
		// 	order_no:100,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:3

		// },
		// {	
		// 	from:"R8",
		// 	order_no:150,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:3

		// },
		// {	
		// 	from:"R9",
		// 	order_no:200,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:3

		// },{	
		// 	from:"R10",
		// 	order_no:100,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:4

		// },
		// {	
		// 	from:"R11",
		// 	order_no:150,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:4

		// },
		// {	
		// 	from:"R12",
		// 	order_no:200,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:4

		// },{	
		// 	from:"R13",
		// 	order_no:100,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:5

		// },
		// {	
		// 	from:"R14",
		// 	order_no:150,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:5

		// },
		// {	
		// 	from:"R15",
		// 	order_no:200,
		// 	to_no:0,
		// 	transport:"none",
		// 	zone:5

		// }
		// ],

		inventory: [
		{
			day:0,
			no_produced:0,
			no_sold:0,
			no_inv:0
		},
		{
			day:1,
			no_produced:0,
			no_sold:0,
			no_inv:0
		}
		],

		backlog:[
		{
			day:0,
			no_produced:0,
			no_ord:0,
			no_to:0,
			no_back:0
		},
		{
			day:1,
			no_produced:0,
			no_ord:0,
			no_to:0,
			no_back:0
		}
		]
	}];

	vm.factoryDetails = {};
	vm.status = {};
	vm.demandDetails = {};

	AnyTimeFunctions.getFactoryDetails(id).success(function(json){
		vm.factoryDetails = json;
		console.log('factory details', vm.factoryDetails);
	});

	AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		console.log('status details', vm.status);
	});

	vm.getDemand = function(){
		console.log('stage inside getdmand is ', vm.status.data.stage);
		if(vm.status.data.stage === '0'){
			console.log('stage = 0 ');
			TurnStageBasedFunctions.getDemandDetails(id, vm.status.data.turn, vm.status.data.stage).success(function(json){
			vm.demandDetails = json;
			console.log('id from getDemand', id);
			console.log('demand details', vm.demandDetails);

				var i=0;
				for(var order of vm.products[0].orders){
					order.order_no = vm.demandDetails.data.demand[i];
					i++;
				}
			});
		}

		else{

			TurnStageBasedFunctions.viewDemandDetails(id, vm.status.data.turn, vm.status.data.stage).success(function(json){
			vm.demandDetails = json;
			console.log('id from getDemand', id);
			console.log('demand details', vm.demandDetails);

				var i=0;
				for(var order of vm.products[0].orders){
					order.order_no = vm.demandDetails.data.demand[i];
					i++;
				}
			});
		}

	}

	vm.send = function(){
		console.log('Updated Products', vm.products);
	}


}]);
// angular.module('starter.filters', []).filter('startFrom', function() {
// return function(input, start) {
//     if(input) {
//         start = +start; //parse to int
//         appended = input.slice(0,start);
//         initialArray = input.slice(start);
//         finalArray= initialArray.concat(appended);
//         return finalArray;
//     }
//     return [];
// }
// });
app.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});

// controller for the panel
app.controller('PanelController',function(){         							       
	this.tab=1;
	this.settab = function(a) { this.tab = a; };
	this.istab = function(a) { return this.tab === a;};
});

app.controller('ZoneController',function(){         							       
	this.zone=1;
	this.setzone = function(a) { this.zone = a; };
	this.iszone = function(a) { return this.zone === a;};
});




})();
