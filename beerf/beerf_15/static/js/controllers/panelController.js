app.controller('PanelController', ['$scope', PanelController]);

	function PanelController($scope){

		$scope.tab=1;
		$scope.settab = function(a) { this.tab = a; };
		$scope.istab = function(a) { return this.tab === a;};
	}