		megaPoolApp.controller('fflTradeCtrl',['$scope', '$http', '$window', '$location',  'userdata', function($scope, $http, $window, $location, userdata){
			$scope.league;
			$scope.settings = [];
			$scope.rosters=[];
			$scope.picks=[];
			$scope.data={
				owner1Picks:[],
				owner1players:[],
				owner2Picks:[],
				owner2players:[],
				owner1FA:0,
				owner2FA:0,
				own1Auction1:0,
				own1Auction2:0,
				own2Auction1:0,
				own2Auction2:0
			}
			$scope.subject="";
			$scope.trade={};
			$scope.tradeShow=0;
			$scope.getSettings=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_get_settings_api.php?LeagueID="+$scope.league.leagueID).then(function(response) {
					$scope.settings = response.data;
				});
			};
			$scope.getRosterData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_roster_api.php?LeagueID="+$scope.league.leagueID+"&rosterID=-1").then(function(response) {
					$scope.rosters = response.data;
				});
			};
			$scope.getPicksData=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_picks_api.php?LeagueID="+$scope.league.leagueID+"&mode=YEAR").then(function(response) {
					$scope.picks = response.data;
				});
			};
			$scope.cancelTrade=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_trade_api.php?tradeID="+$scope.trade.tradeID+"&mode=CANCEL");
				$scope.trade={};
				$scope.tradeShow = 0;
			};
			$scope.finalizeTrade=function(){
				$http.get("http://www.marchmegapool.com/apis/ffl_trade_api.php?tradeID="+$scope.trade.tradeID+"&mode=SUBMIT&subject="+$scope.subject).then(function(response) {
					var resp = response.data;
					if(resp.value == 1){
						$window.alert(resp.msg);
						$location.path('/ffl_trade_history');
						$scope.trade={};
						$scope.tradeShow = 0;

					}
					else{
						$window.alert(resp.msg);
						$scope.cancelTrade();
					}
				});
			};
			$scope.submitTrade=function(){
				var own1pickStr = "";
				var own2pickStr = "";
				var own1playerStr = "";
				var own2playerStr = "";
				var own1AucStr = "";
				var own2AucStr = "";
				if($scope.data.owner1Picks.length>0){
					for(i=0;i<$scope.data.owner1Picks.length;i++){
						if(i>0){
							own1pickStr= own1pickStr +"|";
						}

						own1pickStr= own1pickStr +$scope.data.owner1Picks[i];
					}
				}
				if($scope.data.owner2Picks.length>0){
					for(i=0;i<$scope.data.owner2Picks.length;i++){
						if(i>0){
							own2pickStr= own2pickStr +"|";
						}

						own2pickStr= own2pickStr +$scope.data.owner2Picks[i];
					}
				}
				if($scope.data.owner1players.length>0){
					for(i=0;i<$scope.data.owner1players.length;i++){
						if(i>0){
							own1playerStr= own1playerStr +"|";
						}

						own1playerStr= own1playerStr +$scope.data.owner1players[i];
					}
				}
				if($scope.data.owner2players.length>0){
					for(i=0;i<$scope.data.owner2players.length;i++){
						if(i>0){
							own2playerStr= own2playerStr +"|";
						}

						own2playerStr= own2playerStr +$scope.data.owner2players[i];
					}
				}
				if($scope.data.own1Auction1>0 ){
					own1AucStr = own1AucStr+($scope.settings.lastDraft+1)+$scope.data.own1Auction1;
				}
				if($scope.data.own1Auction2>0 ){
					if (own1AucStr.length>0){
						own1AucStr = own1AucStr +"|";
					}
					own1AucStr = own1AucStr+($scope.settings.lastDraft+2)+$scope.data.own1Auction2;
				}
				if($scope.data.own2Auction1>0 ){
					own2AucStr = own2AucStr+($scope.settings.lastDraft+1)+$scope.data.own2Auction1;
				}
				if($scope.data.own2Auction2>0 ){
					if (own2AucStr.length>0){
						own2AucStr = own2AucStr +"|";
					}
					own2AucStr = own2AucStr+($scope.settings.lastDraft+2)+$scope.data.own2Auction2;
				}

				var options = "LeagueID="+$scope.league.leagueID+"&mode=INSERT&owner1="+$scope.owner1+"&owner2="+$scope.owner2+
							"&owner1players="+own1playerStr+"&owner2players="+own2playerStr+
							"&owner1fa="+$scope.owner1FApoints+"&owner2fa="+$scope.owner2FApoints;
				if($scope.settings.lType=='AuctionFFL'){
					options = options +"&owner1auction="+own1AucStr+"&owner2auction="+own2AucStr;
				}
				else if ($scope.settings.lType=='DraftFFL'){
					options = options +"&owner1picks="+own1pickStr+"&owner2picks="+own2pickStr;
				}
				$http.get("http://www.marchmegapool.com/apis/ffl_trade_api.php?"+options).then(function(response) {
					$scope.trade = response.data;
					$scope.tradeShow = 1;
				});
			};
			$scope.pickStr=function(pick){
				var returnStr=pick.year +" Round " + pick.round;
				if(pick.origOwner!=-1){
					returnStr = returnStr+" via " + pick.origOwner;
				}
				if(pick.picknum>0){
					returnStr = returnStr+ " (#" + pick.picknum +" overall)";
				}
				return returnStr;
			};

			$scope.league = userdata.getCurLeague();
			$scope.getRosterData(); 
			$scope.getPicksData(); 
			$scope.getSettings();
			$scope.owner1=$scope.league.entryID
		}]);
		
