(function(){
/* TODO
  ~ Change the pics (nav-bar, extension)
  ~ Make a homepage???
  ~ Buttons to change the layout (total, today)
  ~ Figure out how to add the header to the top of the page
  ~ Smaller refresh button
  ~ Run a script to get the places
  BUGS
  ~ Tournament name is adding on refresh

*/

  var GolfReader = function(){
    var url = 'http://www.pgatour.com/data/R/464/leaderboard-v2.json';
    var scoreHolder = $('.leaderboard');
    var open = '<tr>';
    var close = '</tr>';
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
              total+
              '<td class="thru"> '+thru+'</td>'+
              today+
              '</tr>';

              anchors += anchor;
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
