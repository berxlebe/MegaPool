		megaPoolApp.controller('rostersCtrl',['$scope', '$http',  'userdata', function($scope, $http, userdata){
			$scope.league;
            $scope.contract = {'player':'--', 'year1':'--', 'year2':'--', 'year3':'--'};
            $scope.sorter = "playername";
            $scope.reverser= false;
			$scope.settings = [];
			$scope.RosterID;
			$scope.addForm = {};
			$scope.addForm.faCost=-1;
			$scope.addForm.draftCost=-1;
			$scope.addPlayerID = null;
			$scope.addPlayerList = [];
			$scope.rosters=[];
			$scope.getSettings=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_get_settings_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.settings = response.data;
				});
			};
			$scope.getTableData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_roster_api.php?LeagueID="+$scope.league.leagueID+"&rosterID=-1").then(function(response) {
					$scope.rosters = response.data;
				});
			};
			$scope.sortTable=function(column){
                if(column == $scope.sorter){
                    $scope.reverser = !$scope.reverser
                }
                else{
                    $scope.sorter=column;
                    $scope.reverser=false;
                }
			};

			$scope.contractCalc=function(player,fa){
				$http.get("http://www.marchmegapool.com/ffl_contractcalc_ajax.php?LeagueID="+$scope.league.leagueID+"&player="+player+"&fa="+fa).then(function(response) {
					$scope.contract = response.data;
				});
			};
			$scope.editPlayer=function(player, action){
				switch(action){
					case 'drop':
						url = "http://www.marchmegapool.com/apis/ffl_roster_admin_api.php?LeagueID="+$scope.league.leagueID+"&PlayerID="+player+"&EntryID="+$scope.RosterID+"&action="+action;
						break;
					case 'add':
						url = "http://www.marchmegapool.com/apis/ffl_roster_admin_api.php?LeagueID="+$scope.league.leagueID+"&PlayerID="+player+"&EntryID="+$scope.RosterID+"&action="+action+"&fa="+$scope.addForm.faCost+"&draft="+$scope.addForm.draftCost;
						break;
				}
				$http.get(url).then(function(response) {
					$scope.getTableData();
					$scope.addPlayerID=null;
					$scope.addForm.faCost=-1;
					$scope.addForm.draftCost=-1;
					$scope.playerName="";
					$scope.addPlayerList = [];

				});
			};
			$scope.getPlayerHint=function(){
				$scope.addPlayerID = null;
				$http.get("http://www.marchmegapool.com/apis/ffl_player_search_api.php?PlayerName="+$scope.playerName).then(function(response) {
					$scope.addPlayerList = response.data;
				});
			};
			$scope.selectHint=function(name,id){
				$scope.playerName=name; 
				$scope.addPlayerID=id;
			};
			$scope.checkSelect=function(entryID){
				if(entryID== $scope.league.entryID){
					return true;
				}
				return false;
			};
			$scope.league = userdata.getCurLeague();
			$scope.getTableData(); 
			$scope.getSettings();
			$scope.RosterID=$scope.league.entryID
		}]);
		
