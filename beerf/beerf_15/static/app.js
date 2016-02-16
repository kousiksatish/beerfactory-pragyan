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
	console.log('historyUrl from app.js', historyUrl);


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

	getHistoryDetails = function(id){

		return $http({
	   		 	method: 'POST',
	    		url: historyUrl,
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
		getMapDetails: getMapDetails,
		getHistoryDetails: getHistoryDetails
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

	capacityDetails = function(id){

		return $http({
	   		 	method: 'POST',
	    		url: capacityDetailsUrl,
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
		upgradeFactory: upgradeFactory,
		capacityDetails: capacityDetails
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
	vm.history={};
	vm.capacityDetails={};
	vm.isMapClicked=false;
	vm.e=-10;
	vm.map={};
	vm.profit=0;
	vm.retailersRemaining=[];

	for(order of vm.products[0].orders){
		vm.retailersRemaining.push(order.from);
	}

	

	for(var order of vm.products[0].orders){
		vm.supplyValues.push(order.to_no);
	}

	TurnStageBasedFunctions.capacityDetails(id).success(function(json){
		vm.capacityDetails = json.data;
		console.log('vm.capacity details', vm.capacityDetails);
	});

	AnyTimeFunctions.getHistoryDetails(id).success(function(json){
		vm.history = json.data.history;
		console.log('vm.history', vm.history);
		console.log('history', json.data);
	});

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
					order.to_no = 0;
					i++;
				}
						
				}
				console.log('order when getDemanded', order)
				if(json.status === "200" || json.status === 200){
					var stage = parseInt(vm.status.data.stage)+1;
					vm.status.data.stage = stage.toString();
					AnyTimeFunctions.getHistoryDetails(id).success(function(json){
					vm.history = json.data.history;
					console.log('vm.history', vm.history);
					console.log('history', json.data);
					});
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

		for(i=0;i<3*vm.level;i++){
			vm.supplyValues[i]=vm.products[0].orders[i].to_no;
		}


		var supply = '';
		

		console.log('level', vm.level);
		sum_of_supply = 0;
		checkint_flag = 0;
		lessthandemand_flag = 0;
		for(var i=0; i<3*(vm.level); i++){
			if (! /^\+?(0|[1-9]\d*)$/.test(vm.supplyValues[i]) && checkint_flag == 0)
				checkint_flag = 1;
			if(vm.supplyValues[i] > vm.demandDetails.data.demand[i] && lessthandemand_flag == 0)
				lessthandemand_flag = 1;
			supply += (vm.supplyValues[i] + ',');
			sum_of_supply += vm.supplyValues[i];
		}

		supply = supply.substr(0, supply.length-1);

		console.log('Supply to be sent', supply);
		console.log('Status before sending', vm.status.data);
		if(checkint_flag == 1)
		{
			toastr.warning('Invalid Quantity. Quantity must be a positive integer');
		}
		else if(vm.factoryDetails.data.inventory  < sum_of_supply)
		{
			toastr.warning('Invalid Quantity. supply must be less than inventory');
		}
		else if(lessthandemand_flag == 1)
		{
			toastr.warning('Invalid supply quantity. Supply should not be greater than demand');
		}
		else
		{
			TurnStageBasedFunctions.supply(id, supply, vm.status.data.turn, vm.status.data.stage).success(function(json){
				console.log('Response for supply', json);
				if(json.status === "200" || json.status === 200){
					var stage = parseInt(vm.status.data.stage)+1;
					vm.status.data.stage = stage.toString();
					AnyTimeFunctions.getHistoryDetails(id).success(function(json){
					vm.history = json.data.history;
					console.log('vm.history', vm.history);
					console.log('history', json.data);
					});
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
			});
		}

		



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
			toastr.warning('Quantity exceeded capacity of the factory');
		else if(vm.order * 40 > vm.factoryDetails.data.factory_1.money)
			toastr.warning('Not enough cash!');
		else
		{
			TurnStageBasedFunctions.placeOrder(id, vm.order, vm.status.data.turn, vm.status.data.stage).success(function(json){
				console.log('Response for place order', json);
				if(json.status === "200" || json.status === 200){
					vm.status.data.stage = '3';

					AnyTimeFunctions.getHistoryDetails(id).success(function(json){
						vm.history = json.data.history;
						console.log('vm.history', vm.history);
						console.log('history', json.data);
					});

					TurnStageBasedFunctions.capacityDetails(id).success(function(json){
						vm.capacityDetails = json.data;
						console.log('vm.capacity details', vm.capacityDetails);
					});

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

		TurnStageBasedFunctions.upgradeFactory(id, vm.status.data.turn, vm.status.data.stage, vm.flag).success(function(json){
			console.log('Respose from updateCapacity', json);

			if(json.status === "200" || json.status === 200){
				var turn = parseInt(vm.status.data.turn) + 1;
				vm.status.data.turn = turn.toString();
				vm.status.data.stage = '0';
				AnyTimeFunctions.getHistoryDetails(id).success(function(json){
				vm.history = json.data.history;
				console.log('vm.history', vm.history);
				console.log('history', json.data);
				});
				var progressbar = angular.element(progressbartop);
		   		progressbar.css('width','25%');
		    	progressbar.html("Stage 1 of 4");
		    	if(vm.flag==0)
		    		toastr.success('Postponed for later!', 'Upgrade');
		    	else
		    		toastr.success('Factory upgraded to produce more capacity!', 'Upgrade');
				
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
		vm.e=e;
		console.log('MAP CLICKED ', e);

		vm.map.check1 = (Math.floor((vm.status.data.turn-1)/5)+1)*3;
		
		/*if(e>0&&e<=(Math.floor((vm.status.data.turn-1)/5)+1)*3){
			console.log('EEEE',e);
		var xref='';
		var ret = vm.products[0].orders[e-1]
		console.log('ret orders', ret);
		var name = vm.mapDetails.data.rcode[e-1];
		var popularity = vm.mapDetails.data.popularity[e-1];
        xref = "<div>Retailer name : " + name+"</div><div class='progress-bar progress-bar-success progress-bar-striped active' role='progressbar' aria-valuenow='50' aria-valuemin='0' aria-valuemax='100' style='width:"+(popularity*50)+"%; height:2rem;'>POPULARITY: "+Math.floor(popularity*50)+"%</div>"+"<br>DEMAND: "+ret.order_no+"<br>SUPPLIED: <input id='tono' type='number' value='"+ret.to_no+"' ng-model='store.supplyValues[$index]'></input><br><button class='btn btn-default' value='confirm' onclick='confirmorder("+e+")'>CONFIRM</button>";

		angular.element(selections).html(xref);
		}
		else if(e>(Math.floor((vm.status.data.turn-1)/5)+1)*3){
			var name = vm.mapDetails.data.rcode[e-1];
			var xref="RETAILER "+name+" NOT UNLOCKED YET!<br>KEEP PLAYING TO UNLOCK THEM!<br>";
			angular.element(selections).html(xref);

		}
		else if(e==-1){
			angular.element(selections).html("YOUR FACTORY");
		}
		else if(e==-2){
			angular.element(selections).html("OPPONENET FACTORY NAME");

		} */
	}

	vm.confirmorder = function(x){

		console.log('IN CONFIRM ORDER');

    	var tono = $("#tono").val();
    	console.log('tono', tono);
    	vm.profit=0;
    	vm.remaining=vm.factoryDetails.data.factory_1.inventory;
    	//vm.factoryDetails.data.factory_1.inventory_remaining = vm.factoryDetails.data.factory_1.inventory;
    	//vm.factoryDetails.data.factory_1.profit = 0;
    	if(tono>0&&tono<=vm.products[0].orders[x-1].order_no){
    		vm.products[0].orders[x-1].to_no = parseInt(tono);
    	}

		else{
			vm.products[0].orders[x-1].to_no = 0;	
		} 

		console.log('vm.products inside confirmorder', vm.products);

		

		for(order of vm.products[0].orders){
			if(order.to_no!=0){
				var index=vm.retailersRemaining.indexOf(order.from);
				if(index>-1){
					vm.retailersRemaining.splice(index,1);
				}

				vm.profit += order.to_no*40;
				vm.remaining -= order.to_no;
			}
		}




		console.log('retailers remaining', vm.retailersRemaining);


    	/*for(i=0;i<=(Math.floor((vm.status.data.turn-1)/5)+1)*3;i++){
        	vm.products[0].orders[x-1] = vm.products[0].orders[i];
        	vm.factoryDetails.data.factory_1.inventory_remaining -= vm.products[0].orders[x-1].to_no;
        	vm.factoryDetails.data.factory_1.profit += vm.products[0].orders[x-1].to_no*40;
        	console.log("remaining in inventory",i,vm.factoryDetails.data.factory_1.inventory_remaining);
    	}
    	*/

    	console.log("products",vm.products);
    	console.log("supply values", vm.supplyvalues);
	}

	vm.getPopPercent = function(p){
		return Math.floor(p*50);
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

// check this out later. to display day details in reverse order so that player gets to see the most recent day first or ask in reverse order itelf from backend

/*app.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});*/


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


(function($) {
	
    $.fn.drags = function(opt) {

        opt = $.extend({handle:"",cursor:"move"}, opt);

        if(opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if(opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - drg_h,
                    left:e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });
            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if(opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);


$('#man').drags();

