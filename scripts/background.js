(function(){


  var FeedReader = function() {
    var feedUrl = 'http://www.pgatour.com/data/r/current/schedule.json';

    var newsHolder = $('.news-feed');


    var beforeFeed = '<ul>';
    var afterFeed = '</ul>';


    var beforeFeedItem = '<li>';
    var afterFeedItem = '</li>';

    function performAjaxSetup() {
      $(document).ajaxStart(function() {
        $("#reload").html('Loading... Please wait!');
        $('#reload').off();
      });

      $(document).ajaxComplete(function(event, xhr, settings) {
        $("#reload").html('Reload.');
        feed.bindUI();
      });
    }

    var feed = {

      xml : '',

      init : function() {

        this.bindUI();
        performAjaxSetup();
        this.loadFeed();

      }, // end init

      bindUI : function() {

        $('#reload').on('click', function () {
          feed.loadFeed();
        });

      }, // end `bindUI` function

      loadFeed : function() {

        this.fetchFeed();

      }, // end `loadFeed` function


      fetchFeed : function () {

        newsHolder.empty();

        $.ajax({

          url : feedUrl,
          dataType : 'json',
          method : 'post',

          beforeSend : function () { },

          success : function ( xml ) {

            feed.populateExt( xml );
          },

          complete : function () { },
        });

      }, // end `fetchFeed`

      populateExt : function ( xml ) {

        var anchors = beforeFeed;

        $(xml).each(function(index, elem){
          // var something = elem.leaderboard.players;
          // $(something).each(function(i,x){
          //   var today = x.today;
          //   if(x.today !== null){
          //     var thru = x.thru;
          //     var total = x.total;
          //     if(total === 0){total = 'E';}
          //     if(today === 0){today = 'E';}
          //     var firstName = x.player_bio.first_name;
          //     var lastName = x.player_bio.last_name;
          //     var fullName = firstName + ' ' + lastName;
          //     var anchor = beforeFeedItem + fullName + ' Total: '+total+' Thru: '+thru+' Today: '+today+afterFeedItem;
          //     anchors += anchor;
          //   }
          //
          // });
          console.log(index,elem);

        });
        anchors += afterFeed;
        newsHolder.append(anchors);

      } // end `populateExt` function

    }; // end `feed` object

    return feed;

  }; // end FeedReader


  $(function(){

    var gcufFeed = new FeedReader();
    gcufFeed.init();

  });

})();
