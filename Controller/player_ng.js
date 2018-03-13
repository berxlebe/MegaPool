		megaPoolApp.controller('playerCtrl',['$scope', '$http',  '$routeParams',  'standings', 'userdata', function($scope, $http, $routeParams, standings, userdata){
			$scope.league;
			$scope.entryID;
			$scope.year;
			$scope.standings=null;
			$scope.pool=null;
			$scope.teams=[];
			$scope.allteams=[];
			$scope.players=null;
			$scope.current_year;
			$scope.popUp=0;
			$scope.tab1Style = {'border-top':'1px solid #888','margin-top':'0px','width':'199px'};
			$scope.tab2Style = {'border-top':'1px solid #888','margin-top':'0px','width':'199px'};
			$scope.tab3Style = {'border-top':'1px solid #888','margin-top':'0px','width':'200px'};
			$scope.checkLock=function(){
				if($scope.year<$scope.current_year){
					return 3;
				}
				return userdata.checkMegaLock();
			};
			$scope.currentLock = userdata.checkMegaLock;
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
			$scope.filterArray=function(){
				if(userdata.checkMegaLock()==0){
						return $scope.allteams;
				}
				var game = $scope.week*2;
				var key = "gm"+game+"margin";
				var retTeams = [];
				for (var i=0; i<$scope.allteams.length; i++){
					if(teams[i][key]>0){
						retTeams.push($scope.allteams[i]);
					}
				}
				return retTeams
			};
			$scope.getStandings=function(){
				standings.getStandings($scope.league.leagueID,$scope.year).then(function(d) {
					$scope.standings = d;
				});
			};
			
			$scope.getPlayerPool=function(){
				$http.get("http://www.marchmegapool.com/apis/player_entry_api.php?EntryID="+$scope.entryID+"&year="+$scope.year).then(function(response) {
						$scope.pool = response.data;
				});
			};

			$scope.getTopPlayers=function(count){
				$http.get("http://www.marchmegapool.com/apis/mega_top_players_api.php?count="+count+"&year="+$scope.year).then(function(response) {
					if(response.data.length>2){
						$scope.players = response.data;
					}
				});
			};
			$scope.getPool=function(){
				$scope.getStandings();
				$scope.getPlayerPool();
				$scope.getTopPlayers(5);
				$scope.drawChart($scope.checkLock());
			};
			$scope.setTab=function(tab){
				$scope.tab1Style.borderTop="1px solid #888";
				$scope.tab2Style.borderTop="1px solid #888";
				$scope.tab3Style.borderTop="1px solid #888";
				$scope.tab1Style.marginTop="0px";
				$scope.tab2Style.marginTop="0px";
				$scope.tab3Style.marginTop="0px";
				switch(tab){
					case 1:
						$scope.tab1Style.borderTop="none";
						$scope.tab1Style.marginTop="-1px";
						break;
					case 2:
						$scope.tab2Style.borderTop="none";
						$scope.tab2Style.marginTop="-1px";
						break;
					case 3:
						$scope.tab3Style.borderTop="none";
						$scope.tab3Style.marginTop="-1px";
						break;
				}
			};
			$scope.drawChart=function(week) {
				$http.get("http://www.marchmegapool.com/apis/player_graph_ajax.php?year=" + $scope.year + "&poolid=" + $scope.league.leagueID + "&week=" + week).then(function(response) {
					var jsonData = response.data;

					var data = new google.visualization.DataTable(jsonData);

					var options = {
						chart: {
							title: 'Most Frequently Selected Players',
							subtitle: 'Players selected only once averaged under Other'
						},
						height: 800,
						width:600,
						animation: {"startup": true},
						bars:  'horizontal',
						series: {
							0: { axis: 'count' }, // Bind series 0 to an axis named 'distance'.
							1: { axis: 'points' } // Bind series 1 to an axis named 'brightness'.
						},
						axes: {
							x: {
								count: {label: '# Selections'}, // Bottom x-axis.
								points: {side: 'top', label: 'Total Points'} // Top x-axis.
							},
							y: {
								players: {label: 'Players'} // Bottom x-axis.
							}
						}
					};

					if(document.getElementById('chart_div')){
						var chart = new google.charts.Bar(document.getElementById('chart_div'));
						chart.draw(data, options);
					}
				});
				$scope.setTab(week);

			}


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
			$http.get("http://www.marchmegapool.com/apis/team_pool_api.php?EntryID="+$scope.league.entryID+"&year="+$scope.year).then(function(response) {
				$scope.allteams = response.data;
				$scope.filterArray();
			});

			google.charts.load('current', {'packages':['bar'], callback: $scope.getPool});
		}]);
		
