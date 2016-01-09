app.controller('StoreController', ['$scope','StoreDataService', StoreController]);

function StoreController($scope, StoreDataService){


	$scope.storeData = {   // Sample data for now. this will come from the api 

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
			}],

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
			}]
	};





}