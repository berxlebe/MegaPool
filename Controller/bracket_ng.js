		megaPoolApp.controller('bracketCtrl',['$scope', '$http',  '$routeParams',  'standings', 'userdata', function($scope, $http, $routeParams, standings, userdata){
			$scope.league;
			$scope.entryID;
			$scope.year;
			$scope.standings=null;
			$scope.bracket=null;
			$scope.current_year;
			$scope.ratio=1;
			$scope.popUp=0;
			$scope.checkLock=function(){
				if($scope.year<$scope.current_year){
					return 3;
				}
				return userdata.checkMegaLock();
			};
			$scope.currentLock = userdata.checkMegaLock;
			$scope.getStandings=function(){
				standings.getStandings($scope.league.leagueID,$scope.year).then(function(d) {
					$scope.standings = d;
				});
			};
			$scope.checkCurrentYear=function(){
				if($scope.league.lastYearActive < (new Date().getFullYear()) &&
					!userdata.checkMegaLock()){
					return 1;
				}
				else{
					return 0;
				}
			};
			
			$scope.newyear= function(){
				$http.get("http://www.marchmegapool.com/apis/new_mega_year_api.php?EntryID="+$scope.league.entryID+"&LeagueID="+$scope.league.leagueID).then(function(response) {
					if(response.data<0){
						$window.alert('Sorry the deadline for joining this years pool has already passed.');
					}
					else{
						$scope.league.lastYearActive = new Date().getFullYear();
						$scope.popUp = 1;
						$scope.getPool();
					}
				});
			};
			$scope.closePop=function(){
				$scope.popUp=0;
			}
			$scope.getBracket=function(){
				$http.get("http://www.marchmegapool.com/apis/bracket_api.php?EntryID="+$scope.entryID+"&year="+$scope.year).then(function(response) {
					$scope.bracket = response.data;
				});
			};
			$scope.setBracketSize=function(width){
					$scope.ratio = width/1562;
			};
			$scope.getPool=function(){
				$scope.getStandings();
				$scope.getBracket();
				$scope.drawChart();
			};
			$scope.drawChart=function() {
				$http.get("http://www.marchmegapool.com/apis/pie_chart_ajax.php?year=" + $scope.year + "&LeagueID=" + $scope.league.leagueID).then(function(response) {
					var jsonData = response.data;
					if(jsonData.length<3){
						return;
					}
					// Create our data table out of JSON data loaded from server.
					var data = new google.visualization.DataTable(jsonData);

					// Instantiate and draw our chart, passing in some options.
					if(document.getElementById('chart_div')){
						var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
						chart.draw(data, {title:'Champion Distribution',width: 400, height: 360});
					}
				});
			};


			$scope.calcTotal=standings.calcTotal;
			$scope.current_year = new Date().getFullYear();
			$scope.year = $scope.current_year;
			$scope.league = userdata.getCurLeague();
			if($routeParams.DISP_ID){
				$scope.entryID=$routeParams.DISP_ID;
				if($routeParams.DISP_YEAR){
					$scope.year = $routeParams.DISP_YEAR;
				}
			}
			else{
				$scope.entryID = $scope.league.entryID;
			}

			google.load('visualization', '1', {'packages':['corechart'], callback: $scope.getPool});
		}]);
		
