megaPoolApp.config(function($routeProvider) {
  var rootpath = "";
  var fflpath = "";
  var megapath = "";
  var commonpath = "";
  var admin = "/admin";
  $routeProvider
  .when("/", {
    templateUrl : rootpath+"/main_home.html"
  })
  .when("/msg_board/:THREAD_ID?", {
    templateUrl : rootpath+"/message_board.html"
  })
  .when("/ffl_home", {
    templateUrl : rootpath+fflpath+"/ffl_home.html"
  })
  .when("/megapool", {
    templateUrl : rootpath+megapath+"/mega_home.html"
  })
  .when("/mega_standings/:GAME_TYPE?", {
    templateUrl : rootpath+megapath+"/mega_standings.html"
  })
  .when("/display_entry/:DISP_ID/:DISP_YEAR", {
    templateUrl : rootpath+megapath+"/display_entry.html"
  })
  .when("/mega_bracket_home/", {
    templateUrl : rootpath+megapath+"/bracket_pool.html"
  })
   .when("/mega_team_home/", {
    templateUrl : rootpath+megapath+"/team_pool.html"
  })
   .when("/mega_player_home/", {
    templateUrl : rootpath+megapath+"/player_pool.html"
  })
   .when("/mega_rules/", {
    templateUrl : rootpath+megapath+"/mega_rules.html"
  })
   .when("/mega_edit_player/", {
    templateUrl : rootpath+megapath+"/edit_player.html"
  })
   .when("/mega_edit_bracket/", {
    templateUrl : rootpath+megapath+"/edit_bracket.html"
  })
   .when("/mega_edit_team/", {
    templateUrl : rootpath+megapath+"/edit_team.html"
  })
   .when("/mega_admin/", {
    templateUrl : rootpath+megapath+"/mega_admin_portal.html"
  }) 
   .when("/pop_bracket/", {
    templateUrl : rootpath+megapath+"/populatebracket.html"
  }) 
 .when("/ffl_rosters", {
    templateUrl : rootpath+fflpath+"/ffl_rosters.html"
  })
  .when("/ffl_contracts", {
    templateUrl : rootpath+fflpath+"/ffl_contracts.html"
  })
  .when("/ffl_pick_list", {
    templateUrl : rootpath+fflpath+"/ffl_picks_grid.html"
  })
  .when("/ffl_traded_picks", {
    templateUrl : rootpath+fflpath+"/ffl_traded_picks.html"
  })
  .when("/ffl_draft_rules", {
    templateUrl : rootpath+fflpath+"/ffl_draft_rules.html"
  })
  .when("/ffl_auction_rules", {
    templateUrl : rootpath+fflpath+"/ffl_auction_rules.html"
  })
  .when("/ffl_trade", {
    templateUrl : rootpath+fflpath+"/ffl_enter_trade.html"
  })
  .when("/ffl_trade_history", {
    templateUrl : rootpath+fflpath+"/ffl_trade_history.html"
  })
  .when("/ffl_pwr_ranks", {
    templateUrl : rootpath+fflpath+"/ffl_power_rankings.html"
  })
  .when("/ffl_standings", {
    templateUrl : rootpath+fflpath+"/ffl_standings.html"
  })
  .when("/ffl_auction_dollars", {
    templateUrl : rootpath+fflpath+"/ffl_auction_dollars.html"
  })
  .when("/ffl_admin", {
    templateUrl : rootpath+admin+"/ffl_admin_portal.html"
  })
  .when("/ffl_edit_pwr_rank", {
    templateUrl : "/admin/ffl_edit_power_rankings.html"
  })
  .when("/ffl_trade_admin", {
    templateUrl : rootpath+admin+"/ffl_trade_admin.html"
  })
  .when("/ffl_draft_order_admin", {
    templateUrl : rootpath+admin+"/ffl_set_draft_order.html"
  })
  .when("/ffl_roster_admin", {
    templateUrl : rootpath+admin+"/ffl_roster_admin.html"
  })
  .when("/ffl_auction", {
    templateUrl : rootpath+fflpath+"/ffl_auction.html"
  })
  .when("/ffl_draft", {
    templateUrl : rootpath+fflpath+"/ffl_draft_results.html"
  });
});
