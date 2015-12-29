(function(){
var app = angular.module('store',[]);

app.controller('storec',function(){
this.products=gems;

});
app.controller('panelp',function(){
this.tab=1;
this.settab = function(a) { this.tab = a; };
this.istab = function(a) { return this.tab === a;};
});

app.controller("ReviewController",function(){
	this.review = {};
	this.addReview=function(product) {
		product.reviews.push(this.review);
		this.review = {};

	};
});
app.directive("productTitle",function(){
	return {
		restrict: 'E', //E -> type of directive(element)
		templateUrl: 'product-title.html'
	};
});


var gems = [[
{
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
	}


	],
	backlog:
	[

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

}]
];
})();
