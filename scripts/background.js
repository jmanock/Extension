(function(){
/* TODO
  ~ Change the pics
  ~ Add some color
  ~ Make it a little better
  ~ Maybe able to track golfers
  ~ Seach for golfers?
  ~ refresh button at top
*/

  var GolfReader = function(){
    var url = 'http://www.pgatour.com/data/R/464/leaderboard-v2.json';
    var scoreHolder = $('.leaderboard');

    var open = '<ul>';
    var close = '</ul>';
    var openList = '<li>';
    var closeList = '</li>';

    function performAjaxSetup(){
      $(document).ajaxStart(function(){
        $('#reload').html('Loading... Please Wait');
        $('#reload').off();
      });

      $(document).ajaxComplete(function(event, xhr, settings){
        $('#reload').html('Reload.');
        feed.bindUI();
      });
    }

    var feed = {
      xml: '',

      init:function(){
        this.bindUI();
        performAjaxSetup();
        this.loadFeed();
      },
      bindUI:function(){
        $('#reload').on('click', function(){
          feed.loadFeed();
        });
      },
      loadFeed:function(){
        this.fetchFeed();
      },
      fetchFeed:function(){
        scoreHolder.empty();

        $.ajax({
          url:url,
          dataType:'json',
          method:'post',

          beforeSend:function(){},
          success:function(xml){
            feed.populateExt(xml);
          },
          complete:function(){},
        });
      },
      populateExt:function(xml){
        var anchors = open;

        $(xml).each(function(index, elem){
          var players = elem.leaderboard.players;
          $(players).each(function(k,v){
            var today = v.today;
            if(today !== null){
              var thru = v.thru;
              var total = v.thru;
              if(total === 0){total = 'E';}
              if(today === 0){today = 'E';}
              var firstName = v.player_bio.first_name;
              var lastName = v.player_bio.last_name;
              var fullName = firstName+' '+lastName;
              var anchor = openList + fullName + ' Total:' + total + ' Thru: '+ thru+' Today: '+today+closeList;
              console.log(anchor);
              anchors +=anchor;
            }
          });
        });
        anchors += close;
        scoreHolder.append(anchors);
      }

    };
    return feed;
  };
  $(function(){
    var something = new GolfReader();
    something.init();
  });
})();
