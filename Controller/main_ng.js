megaPoolApp.controller('mainCtrl',['$scope', '$http', '$location','menuUpdate',  'userdata', function($scope, $http, $location, menuUpdate,  userdata){
	$scope.leagues;
	$scope.uid = userdata.profile.UID;
	$scope.userName = null;
	$scope.control={editProf:false,
					editPass:false};
	$scope.entryDetails={userName:null,
						email:null,
						oldPass:null,
						newPass1:null,
						newPass2:null};
	$scope.updateMenu=function(leagueID){
        menuUpdate.getMenu($scope.uid, leagueID);
    };
	$scope.updateUserdata=function(){
        $scope.leagues = userdata.leagues;
		$scope.uid = userdata.profile.UID;
    };
	$scope.setLeague=function(LID){
		userdata.setCurLeague(LID);
	};
	$scope.editProf=function(){
		var data={"UID":$scope.uid,
		"entryData":$scope.entryDetails};
		$http.post("http://www.marchmegapool.com/apis/edit_user_data_api.php", data).then(function(response) {
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
	userdata.registerObserverCallback($scope.updateUserdata);
	$scope.updateUserdata();

	
}]);
megaPoolApp.filter('imgSrc', function() {
    return function(type) {
		switch(type){
		case "Mega":
			return  "http://www.marchmegapool.com/style/Images/bracket_icon.png";
			break;
		case "AuctionFFL":
			return "http://www.marchmegapool.com/style/Images/dollar_icon.png";
			break;
		case "DraftFFL":
			return "http://www.marchmegapool.com/style/Images/football-icon.png";
			break;
		}
    };
});
