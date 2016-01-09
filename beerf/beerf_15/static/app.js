(function(){
var app = angular.module('store',[]).config(function($interpolateProvider) {   
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');                      // So that django doesnt get confused
});

app.controller('storec',['fac_details', function(fac_details){					//controller for the data inside tabs

this.products = [{
	orders: [
	{	
		from:"R1",
		order_no:100,
		to_no:0,
		transport:"none"

	},
	{	
		from:"R2",
		order_no:150,
		to_no:0,
		transport:"none"

	},
	{	
		from:"R3",
		order_no:200,
		to_no:0,
		transport:"none"

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

var vm = this;

fac_details.success(function(json){
	vm.factoryDetails = json;
});

}]);


app.controller('panelp',function(){                // controller for the panel
this.tab=1;
this.settab = function(a) { this.tab = a; };
this.istab = function(a) { return this.tab === a;};
});

app.factory('fac_details', ['$http', function($http){
	return $http.get('http://127.0.0.1:8000/fac_details') 
  				.success(function(data) {
    					return data;
  					})
  				.error(function(err) {
    					return err;
  					});

}]);

})();
