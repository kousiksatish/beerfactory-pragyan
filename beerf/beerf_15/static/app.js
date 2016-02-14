// check turn or stage mismatch 

(function(){

var app = angular.module('store',['toastr', 'ngAnimate']).config(function($interpolateProvider) {   
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');                      // So that django doesnt get confused
});	

app.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,    
    newestOnTop: false,
    positionClass: 'toast-top-right',
    progressBar: true,
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });
});


//   SERVICES 

// service for any-time functions
app.factory('AnyTimeFunctions', ['$http', function($http){

	console.log('id from app.js', id);
	console.log('factoryDetailsUrl from app.js', factoryDetailsUrl);
	console.log('getStatusUrl from app.js', getStatusUrl);
	console.log('mapUrl from app.js', mapUrl);

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

	};

	upgradeFactory = function(id, _turn, _stage, flag){

		return $http({
	   		 	method: 'POST',
	    		url: updateCapacityUrl,
	    		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	    		transformRequest: function(obj) {
	    		    var str = [];
	        		for(var p in obj)
	        		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        		return str.join("&");
	    		},
	    		data: {user_id: id, turn: _turn, stage: _stage, flag: flag}
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
		viewDemandDetails: viewDemandDetails,
		supply: supply,
		placeOrder: placeOrder,
		upgradeFactory: upgradeFactory
	};

}]);


//  CONTROLLERS


//controller for the data inside tabs
app.controller('StoreController', ['AnyTimeFunctions', 'TurnStageBasedFunctions', '$scope', 'toastr', function(AnyTimeFunctions, TurnStageBasedFunctions, $scope, toastr){					
	$scope.Math = window.Math;
	var vm = this;

	//object which is used for all front-end purposes
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
		},
		{	
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
		},
		{	
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
		}],

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
	vm.level=0;
	// supply value holds the values that are to be submitted by the user. This is ngmodeled in the html
	vm.supplyValues = [];
	vm.order=0;
	vm.flag=0;

	for(var order of vm.products[0].orders){
		vm.supplyValues.push(order.to_no);
	}

	AnyTimeFunctions.getFactoryDetails(id).success(function(json){
		vm.factoryDetails = json;
		console.log('factory details', vm.factoryDetails);
		if(json.status === '200' || json.status === 200)
		{
			toastr.success('Factory details obtained successfully!');
			vm.factoryDetails.data.factory_1.inventory_remaining = vm.factoryDetails.data.factory_1.inventory;
        	vm.factoryDetails.data.factory_1.profit = 0;
		}
		else
		{
			toastr.warning(json.data.description);
		}
		
        
	});

	AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		console.log('status details', vm.status);
		var progressbar = angular.element(progressbartop);
		console.log(vm.status.data.stage);
		if(json.status === '200' || json.status === 200)
		{
			toastr.success('Status of user obtained successfully!');
		}
		else
		{
			toastr.warning(json.data.description);
		}
		switch(vm.status.data.stage)
		{
			case "0":
				progressbar.css('width','25%');
	    		progressbar.html("Stage 1 of 4");
	    		break;
	    	case "1":
	    		progressbar.css('width','50%');
	    		progressbar.html("Stage 2 of 4");
	    		break;
	    	case "2":
	    		console.log("ds");
	    		progressbar.css('width','75%');
	    		progressbar.html("Stage 3 of 4");
	    		break;
	    	case "3":
	    		progressbar.css('width','100%');
	    		progressbar.html("Stage 4 of 4");
	    		break;
    	}
		vm.level = Math.floor(parseInt(vm.status.data.turn-1)/5)+1;
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
			var x = angular.element(demandpopup);
			x.css('display','block');
			console.log("DEMAND POPUP",x);
			var i=0;
			for(var order of vm.products[0].orders){
				if(i<(Math.floor((vm.status.data.turn-1)/5)+1)*3){
					order.order_no = vm.demandDetails.data.demand[i];
					i++;
				}
						
				}
				console.log('order when getDemanded', order)
				if(json.status === "200" || json.status === 200){
					var stage = parseInt(vm.status.data.stage)+1;
					vm.status.data.stage = stage.toString();
					var progressbar = angular.element(progressbartop);
			   		progressbar.css('width','50%');
			    	progressbar.html("Stage 2 of 4");
					toastr.success('Retailers have placed their demands to you!', 'Demand given!');
				}
				else
				{
					toastr.warning(json.data.description);
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
			});
		}

	}

	vm.send = function(){
		console.log('Initial Products', vm.products);
		console.log('Supply values', vm.supplyValues);
		console.log('vm.level', vm.level);
		vm.level = Math.floor(parseInt(vm.status.data.turn-1)/5)+1;
		var i=0;
		// for(var order of vm.products[0].orders){
		// 	order.to_no = vm.supplyValues[i];
		// 	i++;
		// }
		for(i=0;i<3*vm.level;i++){
			vm.supplyValues[i]=vm.products[0].orders[i].to_no;
		}


		var supply = '';
		

		console.log('level', vm.level);

		for(var i=0; i<3*(vm.level); i++){
			supply += (vm.supplyValues[i] + ',');
		}

		supply = supply.substr(0, supply.length-1);

		console.log('Supply to be sent', supply);
		console.log('Status before sending', vm.status.data);


		TurnStageBasedFunctions.supply(id, supply, vm.status.data.turn, vm.status.data.stage).success(function(json){
			console.log('Response for supply', json);
			if(json.status === "200" || json.status === 200){
				var stage = parseInt(vm.status.data.stage)+1;
				vm.status.data.stage = stage.toString();
				var progressbar = angular.element(progressbartop);
		   		progressbar.css('width','75%');
		    	progressbar.html("Stage 3 of 4");
		    	angular.element(demandpopup).css('display','none');
				toastr.success('You have supplied ' + supply + ' amount of beers to the respective retailers' , 'Beers sent!');

			}
			else
			{
				toastr.warning(json.data.description);
			}
			AnyTimeFunctions.getFactoryDetails(id).success(function(json){
			vm.factoryDetails = json;
			console.log('factory details after supplying', vm.factoryDetails);
			});
		})
		



		console.log('New products is', vm.products);
	};

	vm.closepopup = function() {
    angular.element(demandpopup).css('display','none');
	}

	vm.placeOrder = function(){
		
		
		console.log('order is ', vm.order);

		if(! /^\+?(0|[1-9]\d*)$/.test(vm.order))
			toastr.warning('Invalid Quantity. It must be a positive integer!');
		else if(vm.order > vm.factoryDetails.data.factory_1.capacity)
			toastr.warning('Not enough cash!');
		else if(vm.order * 40 > vm.factoryDetails.data.factory_1.money)
			toastr.warning('Quantity exceeded capacity of the factory');
		else
		{
			TurnStageBasedFunctions.placeOrder(id, vm.order, vm.status.data.turn, vm.status.data.stage).success(function(json){
				console.log('Response for place order', json);
				if(json.status === "200" || json.status === 200){
					var turn = parseInt(vm.status.data.turn) + 1;
					vm.status.data.turn = turn.toString();
					vm.status.data.stage = '3';
					var progressbar = angular.element(progressbartop);
			   		progressbar.css('width','100%');
			    	progressbar.html("Stage 4 of 4");
					toastr.success('Order of ' + vm.order + ' placed!', 'Order Placed!');
					
				}
				else
				{
					toastr.warning(json.data.description);
				}

				AnyTimeFunctions.getFactoryDetails(id).success(function(json){
				vm.factoryDetails = json;
				console.log('factory details after placing order', vm.factoryDetails);
				});
			})
		}
	}

	vm.upgradeFactory = function(flag){

		vm.flag=flag;
		
		AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		console.log('status details', vm.status);
		});

		TurnStageBasedFunctions.upgradeFactory(id, vm.status.data.turn, vm.status.data.stage, vm.flag).success(function(json){
			console.log('Respose from updateCapacity', json);

			if(json.status === "200" || json.status === 200){
				var turn = parseInt(vm.status.data.turn) + 1;
				vm.status.data.turn = turn.toString();
				vm.status.data.stage = '0';
				var progressbar = angular.element(progressbartop);
		   		progressbar.css('width','25%');
		    	progressbar.html("Stage 1 of 4");
				toastr.success('upgrade factory called', 'upgrade !');
				
			}
			else
			{
				toastr.warning(json.data.description);
			}

			AnyTimeFunctions.getFactoryDetails(id).success(function(json){
			vm.factoryDetails = json;
			console.log('factory details after upgrade factory option', vm.factoryDetails);
			});

		});


	}

	vm.mapclicked = function(e){
		// vm.getDemand();
		console.log('MAP CLICKED ',e);
		if(e>0&&e<=(Math.floor((vm.status.data.turn-1)/5)+1)*3){
			console.log('EEEE',e);
		var xref='';
		var ret = vm.products[0].orders[e-1]
		console.log('ret orders', ret);
		var name = vm.mapDetails.data.rcode[e-1];
		var popularity = vm.mapDetails.data.popularity[e-1];
        xref = "Retailer name : " + name+"<br>STORY FOR 5 LINES<br>2<br>3<br>4<br>5<br>POPULARITY: "+popularity+"<br>DEMAND: "+ret.order_no+"<br>SUPPLIED: <input id='tono' type='number' value='"+ret.to_no+"' ng-model='store.supplyValues[$index]'></input><br><button class='btn btn-default' value='confirm' onclick='confirmorder("+e+")'>CONFIRM</button>";

		angular.element(selections).html(xref);
		}
		else if(e>(Math.floor((vm.status.data.turn-1)/5)+1)*3){
			var name = vm.mapDetails.data.rcode[e-1];
			var xref="RETAILER "+name+" NOT UNLOCKED YET!<br>KEEP PLAYING TO UNLOCK THEM!<br>";
			angular.element(selections).html(xref);

		}
		else if(e==-1){
			angular.element(selections).html("YOUR FACTORY'S NAME<br>FACTORY STORY<br>FACTORY DETAILS");
		}
		else if(e==-2){
			angular.element(selections).html("OPPONENET'S FACTORY'S NAME<br>FACTORY STORY<br>FACTORY DETAILS");

		}
	}

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
    scope.store.factoryDetails.data.factory_1.inventory_remaining = scope.store.factoryDetails.data.factory_1.inventory;
    scope.store.factoryDetails.data.factory_1.profit = 0;
    if(tono>0&&tono<=ret.order_no)
    ret.to_no = parseInt(tono);
	else ret.to_no = 0
    for(i=0;i<=(Math.floor((scope.store.status.data.turn-1)/5)+1)*3;i++){
        ret = scope.store.products[0].orders[i];
        scope.store.factoryDetails.data.factory_1.inventory_remaining -= ret.to_no;
        scope.store.factoryDetails.data.factory_1.profit += ret.to_no*40;
        console.log("remaining in inventory",i,scope.store.factoryDetails.data.factory_1.inventory_remaining);
    }
    console.log("products",scope.store.products);
    console.log("supply values", scope.store.supplyvalues);
}