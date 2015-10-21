(function(){
/* TODO
  ~ Change the pics (nav-bar, extension)
  ~ Better color and more boom (refresh button, input box, lists)
  ~ Header change to pic??

  BUGS
  ~ Might be a bug with the double nulls in today var
*/

  var GolfReader = function(){
    var url = 'http://www.pgatour.com/data/r/047/leaderboard-v2.json';
    var scoreHolder = $('.leaderboard');
    var open = '<tr>';
    var close = '</tr>';

    function performAjaxSetup(){
      $(document).ajaxStart(function(){
        $('#refresh').html('Loading... Please Wait');
        $('#refresh').off();
      });

      $(document).ajaxComplete(function(event, xhr, settings){
        $('#refresh').html('Reload.');
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

          $('#name').append('<h1>'+tournyName+ '</h1>');
          var players = elem.leaderboard.players;
          $(players).each(function(k,v){
            var firstName = v.player_bio.first_name;
            var lastName = v.player_bio.last_name;
            var fullName = firstName +' '+lastName;
            var total = v.total;
            var thru = v.thru;
            var today = v.today;

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
            if(thru === 18){thru = 'Final';}
            if(total === 0){total = 'E';}
            if(total <= -1){
              total = '<td class="under"> '+total+'</td>';
            }else{
              total = '<td class="over"> '+total+'</td>';
            }
            if(today !== null){
              if(today <= -1){
                today = '<td class="under"> '+today+'</td>';
              }else{
                today = '<td class="over"> '+today+'</td>';
              }
              var anchor = '<tr>'+
              '<td class="fname">'+fullName + "</td>"+
              today+
              '<td class="thru"> '+thru+'</td>'+
              total+
              '</tr>';

              anchors += anchor;
            }

          });

        });

        anchors += close;
        scoreHolder.append('<thead class="head"><tr><th>Name</th><th>Today</th><th>Thru</th><th>Total</th></tr></thead>');
        scoreHolder.append(anchors);
        $('#filter').focus();
      }

    };
    return feed;
  };
  $(function(){
    var something = new GolfReader();
    something.init();
  });

  // Search for Golfers in list
  $(document).ready(function(){
    $('#filter').keyup(function(){
      var filter = $(this).val();
      $('tr').each(function(){
        if($(this).text().search(new RegExp(filter, 'i'))<0){
          $(this).fadeOut();
        }else{
          $(this).show();

        }
      });
    });
  });

})();
