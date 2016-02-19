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

	//console.log('id from app.js', id);
	//console.log('factoryDetailsUrl from app.js', factoryDetailsUrl);
	//console.log('getStatusUrl from app.js', getStatusUrl);
	//console.log('mapUrl from app.js', mapUrl);
	//console.log('historyUrl from app.js', historyUrl);


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

	//console.log('id from app.js', id);
	//console.log('getDemandUrl from app.js', getDemandUrl);










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
			zone:1,
			isConfirmClicked:false
		},
		{	
			from:"R2",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:1,
			isConfirmClicked:false
		},
		{	
			from:"R3",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:1,
			isConfirmClicked:false
		},
		{	
			from:"R4",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:2,
			isConfirmClicked:false
		},
		{	
			from:"R5",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:2,
			isConfirmClicked:false
		},
		{	
			from:"R6",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:2,
			isConfirmClicked:false
		},
		{	
			from:"R7",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:3,
			isConfirmClicked:false
		},
		{	
			from:"R8",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:3,
			isConfirmClicked:false
		},
		{	
			from:"R9",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:3,
			isConfirmClicked:false
		},
		{	
			from:"R10",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:4,
			isConfirmClicked:false
		},
		{	
			from:"R11",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:4,
			isConfirmClicked:false
		},
		{	
			from:"R12",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:4,
			isConfirmClicked:false
		},
		{	
			from:"R13",
			order_no:100,
			to_no:0,
			transport:"none",
			zone:5,
			isConfirmClicked:false
		},
		{	
			from:"R14",
			order_no:150,
			to_no:0,
			transport:"none",
			zone:5,
			isConfirmClicked:false
		},
		{	
			from:"R15",
			order_no:200,
			to_no:0,
			transport:"none",
			zone:5,
			isConfirmClicked:false
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
	vm.instructor = {"bubble":false,"tobedisplayed":"Welcome to Beer Factory! I am your asistant!","content":[], "counter" :0, "len":0};
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
	no_of_demand = 9;
	no_of_order = 4;
	no_of_capacity = 1;
	vm.retailerToNameMap={};
	
	demand_messages = [
		"Welcome to Beer Factory! I am your assistant! Please read through the first few instructions!",
		"To know about what we do try clicking on our factory's image on the map :)",
		"Hope you got to know about our opponent :(",
		"In this factory, on a specific day, first we get the demand of our retailers",
		"You can see the money and inventory of our factory on the top bar",
		"Based on the demand, we should distribute our inventory to different retailers, try doing this by click on the retailers in the map.",
		"The next day's demand depends on our popularity among the retailers, which depends on the supply we make this day. You know where to check popularity :P",
		"Supplying very less quantities to retailers will decrease our popularity among them. Please avoid doing it",
		"We must supply as much as we canso that points and money are not deducted for backlog."
	];

	order_messages = [
		"Note the money change due to the profit earned on our supply",
		"The initial production capacity of our factory is 200 which we can upgrade later, we can produce a maximum of 200 beers on this day.",
		"Calculate the next day's demand and produce the amount we may require. Ordering more than the required amount will lead to unnecessary money and point deductions.",
		"Hint : Remember that our next day's demand depends on popularity. ;)"
	];

	capacity_messages = [
		"Like I said earlier, we have a production capacity of 200... We can increase it now by upgrading our factory.",
	];

	vm.initialFunction = function(){
		for(i=0;i<no_of_demand;i++)
		{
			vm.sendToInstructor(demand_messages[i]);
		}
	}
	

	for(var order of vm.products[0].orders){
		vm.supplyValues.push(order.to_no);
	}


	
	AnyTimeFunctions.getHistoryDetails(id).success(function(json){
		vm.history = json.data.history;
		//console.log('vm.history', vm.history);
		//console.log('history', json.data);
	});

	AnyTimeFunctions.getFactoryDetails(id).success(function(json){
		vm.factoryDetails = json;
		// //console.log('factory details', vm.factoryDetails);
		if(json.status === '200' || json.status === 200)
		{
			//console.log('success');
			// toastr.success('Factory details obtained successfully!');
		}
		else
		{
			toastr.warning(json.data.description);
		}
		
        
	});

	AnyTimeFunctions.getStatusDetails(id).success(function(json){
		vm.status = json;
		//console.log('status details', vm.status);
		var progressbar = angular.element(progressbartop);
		//console.log(vm.status.data.stage);
		if(json.status === '200' || json.status === 200){
			vm.initialFunction();
			if(vm.status.data.stage=="0" || vm.status.data.stage=="1")
				vm.getDemand();
			if(vm.status.data.turn=="1")
			{
				vm.goToInitialInstructor();
				if(vm.status.data.stage=="2")
				{
					for(i=0;i<no_of_order;i++)
						vm.sendToInstructor(order_messages[i]);
					vm.goToInstructor(no_of_demand);
				}
				vm.goToInitialInstructor();
				if(vm.status.data.stage=="3")
				{
					for(i=0;i<no_of_order;i++)
						vm.sendToInstructor(order_messages[i]);
					for(i=0;i<no_of_capacity;i++)
						vm.sendToInstructor(capacity_messages[i]);
					vm.goToInstructor(no_of_demand+no_of_order);
				}
			}
			else
			{
				for(i=0;i<no_of_order;i++)
					vm.sendToInstructor(order_messages[i]);
				for(i=0;i<no_of_capacity;i++)
					vm.sendToInstructor(capacity_messages[i]);
				vm.goToInstructor(no_of_demand+no_of_order+no_of_capacity-1);
			}
			//toastr.success('Status of user obtained successfully!');
			var j=0;
			for(order of vm.products[0].orders){
				if(j<(Math.floor((vm.status.data.turn-1)/5)+1)*3){
					vm.retailersRemaining.push(order.from);
				}
				j++;
			}

			//console.log('retailers remaining', vm.retailersRemaining);

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
	    		progressbar.css('width','33%');
	    		progressbar.html("Stage 1 of 3");
	    		break;
	    	case "2":
	    		//console.log("ds");
	    		progressbar.css('width','66%');
	    		progressbar.html("Stage 2 of 3");
	    		break;
	    	case "3":
	    		progressbar.css('width','100%');
	    		progressbar.html("Stage 3 of 3");
	    		break;
    	}
		vm.level = Math.floor(parseInt(vm.status.data.turn-1)/5)+1;
	});



	AnyTimeFunctions.getMapDetails(id).success(function(json){
		vm.mapDetails = json;
		//console.log('map details', vm.mapDetails);

		var i=0;
		for(order of vm.products[0].orders){
			vm.retailerToNameMap[order.from] = vm.mapDetails.data.rcode[i];	
			i++;
		}

		//console.log('ret to name map,', vm.retailerToNameMap);		
	});


	vm.showDemand = function(){
		var x = angular.element(demandpopup);
		x.css('display','block');
	}

	vm.getDemand = function(){

		if(vm.status.data.stage === '0'){

			TurnStageBasedFunctions.getDemandDetails(id, vm.status.data.turn, vm.status.data.stage).success(function(json){
			vm.demandDetails = json;
			//console.log('id from getDemand', id);
			//console.log('demand details', vm.demandDetails);
			var x = angular.element(demandpopup);
			x.css('display','none');
			//console.log("DEMAND POPUP",x);
			var i=0;
			var sum=0;
			for(var order of vm.products[0].orders){
				if(i<(Math.floor((vm.status.data.turn-1)/5)+1)*3){
					order.order_no = vm.demandDetails.data.demand[i];
					order.to_no = 0;
					sum += vm.demandDetails.data.demand[i];
					i++;
				}
						
				}
				//console.log('order when getDemanded', order)
				if(json.status === "200" || json.status === 200){
					var stage = parseInt(vm.status.data.stage)+1;
					vm.status.data.stage = stage.toString();
					AnyTimeFunctions.getHistoryDetails(id).success(function(json){
					vm.history = json.data.history;
					//console.log('vm.history', vm.history);
					//console.log('history', json.data);
					});
					var progressbar = angular.element(progressbartop);
			   		progressbar.css('width','33%');
			    	progressbar.html("Stage 1 of 3");
					toastr.success('Retailers have placed their demands to you!', 'Demand given!');
					vm.remaining = vm.factoryDetails.data.factory_1.inventory;

					var j=0;
					for(order of vm.products[0].orders){
						var index = vm.retailersRemaining.indexOf(order.from);
						if(index<=-1){
							if(j<(Math.floor((vm.status.data.turn-1)/5)+1)*3){
								vm.retailersRemaining.push(order.from);
							}
						}
						j++;
					}

					if (sum>vm.factoryDetails.data.factory_1.inventory)
						vm.sendToInstructor('Oh! Total demand '+sum+'is greater than our inventory. Make wise decisions so that we don\'t lose popularity among our retailers!');
					if (vm.status.data.turn != 1 || vm.status.data.turn != "1")
						vm.goToInstructor(vm.instructor.len -1);

				}
				else
				{
					toastr.warning(json.data.description);
				}

			});
		}

		else{
			//console.log(vm.status.data.stage)	

			TurnStageBasedFunctions.viewDemandDetails(id, vm.status.data.turn, vm.status.data.stage).success(function(json){
			vm.demandDetails = json;
			//console.log('id from getDemand', id);
			//console.log('demand details', vm.demandDetails);
			var x = angular.element(demandpopup);
			x.css('display','none');
			var sum = 0;
			//console.log("DEMAND POPUP",x);			
				var i=0;
				for(var order of vm.products[0].orders){
					order.order_no = vm.demandDetails.data.demand[i];
					//console.log(vm.demandDetails.data.demand[i]);
					if(vm.demandDetails.data.demand[i])
					sum+= parseInt(vm.demandDetails.data.demand[i]);
					i++;
				}
				//console.log('ss'+sum);
				if (sum>vm.factoryDetails.data.factory_1.inventory)
					vm.sendToInstructor('Oh! Total demand '+sum+' is greater than our inventory. Make wise decisions so that we don\'t lose popularity among our retailers!');
			});
			
		}

	}
	
	vm.send = function(){


		//console.log('Initial Products', vm.products);
		//console.log('Supply values', vm.supplyValues);
		//console.log('vm.level', vm.level);
		vm.level = Math.floor(parseInt(vm.status.data.turn-1)/5)+1;
		var i=0;

		for(i=0;i<3*vm.level;i++){
			vm.supplyValues[i]=vm.products[0].orders[i].to_no;
		}



		var supply = '';
		
		
		//console.log('level', vm.level);
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
		var confirm_flag=0;
		var j=0;

		for(order of vm.products[0].orders){
			if(!order.isConfirmClicked && j<(Math.floor((vm.status.data.turn-1)/5)+1)*3){
				confirm_flag=1;
			}
			j++;
		}

		supply = supply.substr(0, supply.length-1);

		//console.log('Supply to be sent', supply);
		//console.log('Status before sending', vm.status.data);
		if(checkint_flag == 1)
		{
			toastr.warning('Invalid Quantity. Quantity must be a positive integer');
		}
		else if(vm.factoryDetails.data.factory_1.inventory  < sum_of_supply)
		{
			toastr.warning('Invalid Quantity. supply must be less than inventory');
		}
		else if(lessthandemand_flag == 1)
		{
			toastr.warning('Invalid supply quantity. Supply should not be greater than demand');
		}
		else if(confirm_flag == 1){
			toastr.warning('Click confirm atleast once to every retailer! ');
		}
		else
		{
			$("#loading").fadeIn("slow");
			TurnStageBasedFunctions.supply(id, supply, vm.status.data.turn, vm.status.data.stage).success(function(json){
				//console.log('Response for supply', json);
				if(json.status === "200" || json.status === 200){
					$("#loading").fadeOut("slow");
					var stage = parseInt(vm.status.data.stage)+1;
					vm.status.data.stage = stage.toString();
					AnyTimeFunctions.getHistoryDetails(id).success(function(json){
					vm.history = json.data.history;
					//console.log('vm.history', vm.history);
					//console.log('history', json.data);
					});
					var progressbar = angular.element(progressbartop);
			   		progressbar.css('width','66%');
			    	progressbar.html("Stage 2 of 3");
			    	angular.element(demandpopup).css('display','none');
					toastr.success('You have supplied ' + supply + ' amount of beers to the respective retailers' , 'Beers sent!');
					if (vm.status.data.turn == '1' || vm.status.data.turn == 1)
					{
						for(i=0;i<no_of_order;i++)
							vm.sendToInstructor(order_messages[i]);
						vm.nextInstruction();
					}
				}
				else
				{
					$("#loading").fadeOut("slow");
					toastr.warning(json.data.description);
				}
				AnyTimeFunctions.getFactoryDetails(id).success(function(json){
				vm.factoryDetails = json;
				//console.log('factory details after supplying', vm.factoryDetails);
				});
			});
		}

		
		//console.log('New products is', vm.products);
	};

	vm.closepopup = function() {
    angular.element(demandpopup).css('display','none');
	}

	vm.placeOrder = function(){
		
		//console.log('order is ', vm.order);

		if(! /^\+?(0|[1-9]\d*)$/.test(vm.order))
			toastr.warning('Invalid Quantity. It must be a positive integer!');
		else if(vm.order > vm.factoryDetails.data.factory_1.capacity)
		{
			toastr.warning('Quantity exceeded capacity of the factory');
			vm.sendToInstructor("Quantity exceeded capacity of the factory");
		}
		else if(vm.order * 40 > vm.factoryDetails.data.factory_1.money)
			toastr.warning('Not enough cash!');
		else
		{
			$("#loading").fadeIn("slow");
			TurnStageBasedFunctions.placeOrder(id, vm.order, vm.status.data.turn, vm.status.data.stage).success(function(json){
				//console.log('Response for place order', json);
				if(json.status === "200" || json.status === 200){
					$("#loading").fadeOut("slow");
					vm.status.data.stage = '3';

					AnyTimeFunctions.getHistoryDetails(id).success(function(json){
						vm.history = json.data.history;
						//console.log('vm.history', vm.history);
						//console.log('history', json.data);
					});

					var progressbar = angular.element(progressbartop);
			   		progressbar.css('width','100%');
			    	progressbar.html("Stage 3 of 3");
					toastr.success('Order of ' + vm.order + ' placed!', 'Order Placed!');
					if (vm.status.data.turn == '1' || vm.status.data.turn == 1)
					{
						for(i=0;i<no_of_capacity;i++)
							vm.sendToInstructor(capacity_messages[i]);
						vm.nextInstruction();
					}
				}
				else
				{
					$("#loading").fadeOut("slow");
					toastr.warning(json.data.description);
				}
				if (vm.factoryDetails.data.factory_1.money - 40*vm.order >= vm.factoryDetails.data.factory_1.next_upgrade_capacity)
				{
					vm.sendToInstructor('We can make an upgrade now... I leave the decision to you!');
				}
				if (vm.status.data.turn != 1 || vm.status.data.turn != "1")
					vm.goToInstructor(vm.instructor.len-1);
				AnyTimeFunctions.getFactoryDetails(id).success(function(json){
				vm.factoryDetails = json;
				//console.log('factory details after placing order', vm.factoryDetails);
				});
			})
		}
	}

	vm.upgradeFactory = function(flag){

		vm.flag=flag;
		$("#loading").fadeIn("slow");

		TurnStageBasedFunctions.upgradeFactory(id, vm.status.data.turn, vm.status.data.stage, vm.flag).success(function(json){
			//console.log('Respose from updateCapacity', json);

			if(json.status === "200" || json.status === 200){
				$("#loading").fadeOut("slow");
				var turn = parseInt(vm.status.data.turn) + 1;
				vm.status.data.turn = turn.toString();
				vm.status.data.stage = '0';
				//to update history tab at every stage
				AnyTimeFunctions.getHistoryDetails(id).success(function(json){
				vm.history = json.data.history;
				//console.log('vm.history', vm.history);
				//console.log('history', json.data);
				});

				//to update popularity without the need to reload
				AnyTimeFunctions.getMapDetails(id).success(function(json){
				vm.mapDetails = json;
				//console.log('map details', vm.mapDetails);
				});
				
				var progressbar = angular.element(progressbartop);
		   		progressbar.css('width','33%');
		    	progressbar.html("Stage 1 of 3");

		    	if(vm.flag==0)
		    		toastr.success('Postponed for later!', 'Upgrade');
		    	else
		    		toastr.success('Factory upgraded to produce more capacity!', 'Upgrade');

				//so that user doesnt need to click getDemand unnecessarily at stage 0
		    	vm.getDemand();
				
			}
			else
			{
				$("#loading").fadeOut("slow");
				toastr.warning(json.data.description);
			}

			AnyTimeFunctions.getFactoryDetails(id).success(function(json){
			vm.factoryDetails = json;
			//console.log('factory details after upgrade factory option', vm.factoryDetails);
			});

		});


	}

	vm.mapclicked = function(e){

		vm.e=e;
		//console.log('MAP CLICKED ', e);
		vm.map.check1 = (Math.floor((vm.status.data.turn-1)/5)+1)*3;

	}

	vm.confirmorder = function(x){

		//console.log('IN CONFIRM ORDER');

		vm.products[0].orders[x-1].isConfirmClicked=true;

		//console.log('vm.products[0].orders ', vm.products);
    	var tono = $("#tono").val();
    	//console.log('tono', tono);
    	vm.profit=0;
    	vm.remaining=vm.factoryDetails.data.factory_1.inventory;

    	if(tono>0&&tono<=vm.products[0].orders[x-1].order_no){
    		vm.products[0].orders[x-1].to_no = parseInt(tono);
    	}

		else{
			toastr.warning('You cannot supply more than demanded!');
			vm.products[0].orders[x-1].to_no = 0;	
		} 

		//console.log('vm.products inside confirmorder', vm.products);

		

		for(order of vm.products[0].orders){
			if(order.to_no!=0){
				var index=vm.retailersRemaining.indexOf(order.from);
				if(index>-1){
					vm.retailersRemaining.splice(index,1);
				}

				vm.profit += order.to_no*50;
				vm.remaining -= order.to_no;
			}
		}




		//console.log('retailers remaining', vm.retailersRemaining);

    	//console.log("products",vm.products);
    	//console.log("supply values", vm.supplyvalues);
	}

	vm.closeInstructor = function() {
		if (vm.instructor.bubble)
		{
			vm.instructor.bubble=false;
		}
		else
			vm.instructor.bubble = true;
	}

	vm.nextInstruction = function() {
		//console.log('next');
		//console.log(vm.instructor.counter);
		if (vm.instructor.counter<vm.instructor.len-1)
		{
			vm.instructor.counter++;
			vm.instructor.tobedisplayed = vm.instructor.content[vm.instructor.counter];
		}
	}
	vm.prevInstruction = function() {
		//console.log('prev');
		//console.log(vm.instructor.counter);
		if (vm.instructor.counter>0)
		{
			vm.instructor.counter--;
			vm.instructor.tobedisplayed = vm.instructor.content[vm.instructor.counter];
		}
	}


	vm.goToInitialInstructor = function() {
		vm.instructor.bubble=0;
		vm.instructor.counter = 0;
		vm.instructor.tobedisplayed = vm.instructor.content[0];
	}

	vm.goToInstructor = function(counter) {
		vm.instructor.bubble=0;
		vm.instructor.counter = counter;
		vm.instructor.tobedisplayed = vm.instructor.content[vm.instructor.counter];
	}

	vm.sendToInstructor = function(content) {
		vm.instructor.bubble=0;
		vm.instructor.content[vm.instructor.len] = content;
		vm.instructor.len++;
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

