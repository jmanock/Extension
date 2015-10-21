(function(){
  var GolfReader = function(){
    var url = 'http://www.pgatour.com/data/r/047/leaderboard-v2.json';
    var scoreHolder = $('.leaderboard');
    var open = '<tr>';
    var close = '</tr>';

    function performAjaxSetup(){
      $(document).ajaxStart(function(){
        $('#refresh').html('Loading... Please Wait!!');
        $('#refresh').off();
      });

      $(document).ajaxComplete(function(event, xhr, settings){
        $('#refresh').html('Reload.');
        feed.bindUI();
      });
    }

    var feed = {
      xml:'',

      init:function(){
        this.bindUI();
        performAjaxSetup();
        this.loadFeed();
      },
      bindUI:function(){
        $('#refresh').on('click', function(){
          $('h1').remove();
          feed.loadFeed();
        });
      },
      loadFeed:function(){
        this.fetchFeed();
      },
      fetchFeed:function(){
        scoreHolder.empty();
        $.ajax({
          ulr:url,
          dataType:'json',
          method:'post',

          beforeSend:function(){},
          success:function(xml){
            feed.populateExt(xml);
          },
          complete:function(){}
        });
      },
      populateExt:function(xml){
        var abchors = open;
        $(xml).each(function(index, elem){
          var tournyName = elem.leaderboard.tournament_name;
          $('#name').append('<h1>'+tournyName+'</h1>');

          var players = elem.leaderboard.players;
          $(players).each(function(k,v){
            var firstName = v.player_bio.first_name;
            var lastName = v.player_bio.last_name;
            var fullName = firstName + ' '+lastName;
            var total = v.total;
            var thru = v.thru;
            var today = v.today;

            
          });
        });
      }
    };
  };
})();
