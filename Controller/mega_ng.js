megaPoolApp.controller('megaCtrl',
						['$scope', '$http',  '$window', '$location', 'userdata', 'msgBoard', 'menuUpdate',
						function($scope, $http, $window, $location, userdata, msgBoard, menuUpdate){
	$scope.league ={};
	$scope.board={};
	$scope.error=0;
	$scope.control={editDets:false,
					popUp:null};
	$scope.entryDetails={EntryName:null,
						leavePool:0};
			
	$scope.checkCurrentYear=function(){
		if($scope.league.lastYearActive < (new Date().getFullYear()) &&
			!userdata.checkMegaLock()){
			return 1;
		}
		else{
			return 0;
		}
	};
	$scope.checkAdmin=function(){
		return $scope.league.isAdmin;
	};
	$scope.setLeague=function(){
		$scope.league=  userdata.getCurLeague();
		$scope.entryDetails.EntryName = $scope.league.entryName;
	};
	$scope.editProf=function(){
		if(!$window.confirm("If you leave the pool you will not be able to reconnect to this entry, or view pool history.  Are you sure you want to do this?")){
			return;
		}
		var data={"EntryID":$scope.league.entryID,
		"entryData":$scope.entryDetails};
		$http.post("http://www.marchmegapool.com/apis/edit_entry_data_api.php", data).then(function(response) {
			switch(response.data){
				case "1": 
					userdata.getLeagues(userdata.profile.UID);
					$scope.setLeague();
					$scope.control.editDets=false;
					break
				case "2":
					userdata.getLeagues(userdata.profile.UID);
					menuUpdate.getMenu(userdata.profile.UID, 0);
					$location.path('/');
					break;
				case "-1":
					$window.alert("Updated could not complete, Entry name already in use for this pool");
					break;
				case "-2":
					$window.alert("Co-Managed entries can not currently leave pool");
					break;
			}					
		});
		return;
	}
	$scope.newyear= function(){
		$http.get("http://www.marchmegapool.com/apis/new_mega_year_api.php?EntryID="+$scope.league.entryID+"&LeagueID="+$scope.league.leagueID).then(function(response) {
			if(response.data<0){
				$window.alert('Sorry the deadline for joining this years pool has already passed.');
			}
			else{
				$scope.league.lastYearActive = new Date().getFullYear();
				$scope.control.popUp = 1;
			}
		});
	};
				
			$scope.setLeague();
			msgBoard.getBoard($scope.league.leagueID,0,5).then(function(d) {
				$scope.board = d;
			});
	
	}]);