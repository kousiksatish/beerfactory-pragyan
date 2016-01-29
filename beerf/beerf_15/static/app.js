//{ check turn or stage mismatch 

// (function(){

// var app = angular.module('store',['ui.router', 'ngRoute']).config(['$stateProvider', function($interpolateProvider) {   
//     $interpolateProvider.startSymbol('{$');
//     $interpolateProvider.endSymbol('$}');                      // So that django doesnt get confused
// }, 
// function ($stateProvider){
// //states
// $stateProvider
// 	.state('stage1',{
// 		abstract:true,
// 		views: {
// 			'rightcontent':{
// 				template: require("../templates/stage1.html")
// 			}
// 	}
// 	});
// }]);

// check turn or stage mismatch 

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
	// console.log('mapUrl from app.js', mapUrl);

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

	getMapDetails = function(id) {

		return $http({
	   		 	method: 'POST',
	    		url: mapUrl,
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
		getStatusDetails: getStatusDetails,
		getMapDetails: getMapDetails
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

	supply = function(id, supplyValues, _turn, _stage){

		return $http({
	   		 	method: 'POST',
	    		url: supplyUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id, quantity: supplyValues, turn: _turn, stage: _stage}
				})
				.success(function(json) {
	    					return json;
	  					})
	  			.error(function(err) {
	    					return err;
	  					});

	};

	placeOrder = function(id, order, _turn, _stage){

		return $http({
	   		 	method: 'POST',
	    		url: placeOrderUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id, quantity: order, turn: _turn, stage: _stage}
				})
				.success(function(json) {
	    					return json;
	  					})
	  			.error(function(err) {
	    					return err;
	  					});

	}

	return  {
		getDemandDetails: getDemandDetails,
		viewDemandDetails: viewDemandDetails,
		supply: supply,
		placeOrder: placeOrder
	};



}]);


//  CONTROLLERS


//controller for the data inside tabs
app.controller('StoreController', ['AnyTimeFunctions', 'TurnStageBasedFunctions', '$scope', function(AnyTimeFunctions, TurnStageBasedFunctions, $scope){					

	var vm = this;

	vm.products = [{
		orders: [
		{	
			from:"R1",
			name:"A-name of retailer 1",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:1

		},
		{	
			from:"R2",
			name:"B-name of retailer 2",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:1

		},
		{	
			from:"R3",
			name:"C-name of retailer 3",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:1

		}
		,{	
			from:"R4",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:2

		},
		{	
			from:"R5",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:2

		},
		{	
			from:"R6",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:2

		},
		{	
			from:"R7",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:3

		},
		{	
			from:"R8",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:3

		},
		{	
			from:"R9",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:3

		},{	
			from:"R10",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:4

		},
		{	
			from:"R11",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:4

		},
		{	
			from:"R12",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:4

		},
		{	
			from:"R13",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:5

		},
		{	
			from:"R14",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:5

		},
		{	
			from:"R15",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:5

		}
		],

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
	vm.mapDetails={};
	
	// supply value holds the values that are to be submitted by the user. This is ngmodeled in the html
	vm.supplyValues = [];
	vm.order=0;

	for(var order of vm.products[0].orders){
		vm.supplyValues.push(order.to_no);
	}

	AnyTimeFunctions.getFactoryDetails(id).success(function(json){
		vm.factoryDetails = json;
		console.log('factory details', vm.factoryDetails);
	});

	AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		console.log('status details', vm.status);
	});

	AnyTimeFunctions.getMapDetails(id).success(function(json){
		vm.mapDetails = json;
		console.log('map details', vm.mapDetails);
	});

	vm.getDemand = function(){

		AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		console.log('status details', vm.status);
		});

		if(vm.status.data.stage === '0'){

			TurnStageBasedFunctions.getDemandDetails(id, vm.status.data.turn, vm.status.data.stage).success(function(json){
			vm.demandDetails = json;
			console.log('id from getDemand', id);
			console.log('demand details', vm.demandDetails);

				var i=0;
				for(var order of vm.products[0].orders){
					order.order_no = vm.demandDetails.data.demand[i];
					i++;
				}
				if(json.status === "200" || json.status === 200){
					var stage = parseInt(vm.status.data.stage)+1;
					vm.status.data.stage = stage.toString();
				}
			});
		}

		else{
			console.log(vm.status.data.stage)	

			TurnStageBasedFunctions.viewDemandDetails(id, vm.status.data.turn, vm.status.data.stage).success(function(json){
			vm.demandDetails = json;
			console.log('id from getDemand', id);
			console.log('demand details', vm.demandDetails);
var x = angular.element(demandpopup);
					x.css('display','block');
					console.log("DEMAND POPUP",x);
				var i=0;
				for(var order of vm.products[0].orders){
					order.order_no = vm.demandDetails.data.demand[i];
					i++;
				}
	    		// angular.element('demandpopup').style.display="block";
			});
		}

	}

	vm.send = function(){
		console.log('Initial Products', vm.products);
		console.log('Supply values', vm.supplyValues);

		var i=0;
		for(var order of vm.products[0].orders){
			order.to_no = vm.supplyValues[i];
			i++;
		}

		var supply = '';

		for(value of vm.supplyValues){
			supply += (value + ',');
		}

		supply = supply.substr(0, supply.length-1);

		console.log('Supply to be sent', supply);
		console.log('Status before sending', vm.status.data);
		var progressbar = angular.element(progressbartop);
   		progressbar.css('width','100%');
    	progressbar.html("Stage 2 of 2");
    	angular.element(demandpopup).css('display','none');

		TurnStageBasedFunctions.supply(id, supply, vm.status.data.turn, vm.status.data.stage).success(function(json){
			console.log('Response for supply', json);
			if(json.status === "200" || json.status === 200){
				var stage = parseInt(vm.status.data.stage)+1;
				vm.status.data.stage = stage.toString();
			}
			AnyTimeFunctions.getFactoryDetails(id).success(function(json){
			vm.factoryDetails = json;
			console.log('factory details after supplying', vm.factoryDetails);
			});
		})
		



		console.log('New products is', vm.products);
	};


	vm.placeOrder = function(){
		
		AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		console.log('status details', vm.status);
		});

		console.log('order is ', vm.order);

		TurnStageBasedFunctions.placeOrder(id, vm.order, vm.status.data.turn, vm.status.data.stage).success(function(json){
			console.log('Response for place order', json);
			if(json.status === "200" || json.status === 200){
				var turn = parseInt(vm.status.data.turn) + 1;
				vm.status.data.turn = turn.toString();
				vm.status.data.stage = '0';
			}
			AnyTimeFunctions.getFactoryDetails(id).success(function(json){
			vm.factoryDetails = json;
			console.log('factory details after placing order', vm.factoryDetails);
			});
		})
	}

	vm.mapclicked = function(e){
		console.log('MAP CLICKED ',e);
		if(e>0&&e<4){
			console.log('EEEE',e);
		var xref='';
		var ret = vm.products[0].orders[e-1]
        xref = ret.name+"<br>STORYYYY FOR 5 LINES?<br>2<br>3<br>4<br>5<br>POPULARITY<br>DEMAND: "+ret.order_no+"<br>SUPPLIED: <input id='tono' type='number' min='0' max='"+ret.order_no+"' value='"+ret.to_no+"' ng-model='store.supplyValues[$index]'></input><br><button class='btn btn-default' value='confirm' onclick='confirmorder("+e+")'>CONFIRM</button>";
		angular.element(selections).html(xref);
		}
		else if(e>=4){
			var xref="RETAILER "+e+" NOT UNLOCKED YET!<br>KEEP PLAYING TO UNLOCK THEM!<br>";
			angular.element(selections).html(xref);

		}
		else if(e==-1){
			angular.element(selections).html("YOUR FACTORY'S NAME<br>FACTORY STORY<br>FACTORY DETAILS");
		}
		else if(e==-2){
			angular.element(selections).html("OPPONENET'S FACTORY'S NAME<br>FACTORY STORY<br>FACTORY DETAILS");

		}
	}
	vm.closepopup = function() {
    angular.element(demandpopup).css('display','none');
}
	/*vm.confirmorder = function(x) {
	console.log('IN CONFIRM ORDER');
    var ret = vm.store.products[0].orders[x-1];
    var tono = angular.element("tono").val();
    ret.to_no = tono;
    for(i=0;i<3;i++){
        ret = scope.store.products[0].orders[i];
        console.log("tonooo",i,ret.to_no);
    }
}*/
}]);

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
function confirmorder(x) {
	console.log('IN CONFIRM ORDER');
	var $element = $("#main-content");
	var scope = angular.element($element).scope();
    var ret = scope.store.products[0].orders[x-1];
    var tono = $("#tono").val();
    if(tono>0&&tono<=ret.order_no)
    ret.to_no = parseInt(tono);
	else ret.to_no = 0
    for(i=0;i<3;i++){
        ret = scope.store.products[0].orders[i];
        console.log("tonooo",i,ret.to_no);
    }
    console.log("products",scope.store.products);
    console.log("supply values", scope.store.supplyvalues);
}