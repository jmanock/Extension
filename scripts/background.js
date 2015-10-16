(function(){
/* TODO
  ~ Change the pics (nav-bar, extension)
  ~ Make a homepage???
  ~ Buttons to change the layout (total, today)
  ~ Add the tourney name
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
          var tournyName = elem.leaderboard.tournament_name;

          $('#name').append('<h1>'+tournyName+' Leaderboard'+ '</h1>');
          var players = elem.leaderboard.players;
          $(players).each(function(k,v){
            var firstName = v.player_bio.first_name;
            var lastName = v.player_bio.last_name;
            var fullName = firstName +' '+lastName;
            var total = v.total;
            var thru = v.thru;
            var today = v.today;
            //console.log(v);
            if(today === null){
              var currentRound = v.current_round;
              var round = v.rounds;
              $(round).each(function(i,e){
                if(currentRound === i+1){
                  var something = e.tee_time;
                  something = something.slice(11,16);
                  var hours = something.slice(0,2);
                  var minutes = something.slice(3,5);
                  if(hours >= 13){
                    var hour =hours - 12;
                    today = hour +':'+minutes+'pm';
                  }else{
                     today = hours+':'+minutes+'am';
                  }
                }

              });
            }
            if(today === 0){today='E';}
            if(thru === null){thru = 'Final';}
            if(total === 0){total = 'E';}
            var anchor = openList + fullName +' Total: '+total + ' Thru: '+thru+' Today: '+ today+closeList;
            anchors +=anchor;
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
  $(document).ready(function(){
    $('#filter').keyup(function(){
      var filter = $(this).val(),count = 0;
      $('ul li').each(function(){
        if($(this).text().search(new RegExp(filter, 'i'))<0){
          $(this).fadeOut();
        }else{
          $(this).show();
          count++;
        }
      });
    });
  });
})();
