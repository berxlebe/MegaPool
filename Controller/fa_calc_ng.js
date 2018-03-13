var faApp = angular.module('faApp',[]);
		faApp.controller('keeperCalcCtrl',['$scope','$http',  function($scope,$http){
			$scope.oldArray=[
				"Who the fuck knows",
				"Seriously it can't be calculated until 1 week before keepers are due",
				"This sounds like it was a Tom idea",
				"We should have known better than to accept Tom's ideas",
				"All of Tom's ideas are terrible",
				"Fullerton sucks"
			]
			$scope.entries=[];
			$scope.adds=[];
			$scope.LeagueID;
			$scope.addTable=function(){
				var obj={
						week:	$scope.week,
						fa:		$scope.cost,
						round:	$scope.round
				}
				$scope.entries.push(obj);
				$scope.fa =0;
				$scope.week = 0;
				$scope.round = 15;
			};
			$scope.init=function(leagueID){
				$scope.leagueID=leagueID;
				$scope.getTransactions();
			}
			$scope.clearTable=function(){
				$scope.entries = [];
			};
			
			$scope.getTransactions=function(){
				$http.get("http://www.marchmegapool.com/ffl_transactions_api.php?LeagueID="+$scope.LeagueID+"&year=2016").then(function(response) {
					$scope.adds = response.data;
				});
			};
			$scope.checkDraft=function(cmp,draft,disp){
				return (($scope.base-cmp) < draft ? disp : "Draft")
			};
			$scope.checkRound=function(cmp,draft,disp){
				round = Math.max(1,disp)
				return (($scope.base-cmp) < Math.max(1,draft) ? round : draft)
			};
//			$scope.getTransactions();
			$scope.fa = 0;
			$scope.week = 0;
			$scope.round = 15;
			$scope.base = 15;
		}]);
		
	faApp.filter('calcVal', function(){
		return function(n) {
			return Math.ceil(Math.max(0,(n.round*12) - (n.fa*n.week))/12);
			
		};
	});

