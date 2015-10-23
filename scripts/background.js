(function(){
  /* TODO
    ~ Keep tile from scolling
    ~ Replace the black from the time
    ~ Change the refresh button
    ~ Make the input a little better
  */
  var GolfReader = function(){
    var url = 'http://www.pgatour.com/data/r/047/leaderboard-v2.json';
    var scoreHolder = $('.leaderboard');
    var open = '<tr>';
    var close = '<tr>';

    function performAjaxSetup(){
      $(document).ajaxStart(function(){
        $('#refresh').html('Loading.. Please Wait');
        $('#refresh').off();
      });

      $(document).ajaxComplete(function(event, xhr, settings){
        $('#refresh').html('Refresh');
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
          url:url,
          dataType:'json',
          method:'post',
          beforeSend:function(){ },
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
          $('#name').append('<h1>'+tournyName+'</h1>');
          var players = elem.leaderboard.players;
          $(players).each(function(k,v){
            var firstName = v.player_bio.first_name;
            var lastName = v.player_bio.last_name;
            var fullName = firstName + ' '+ lastName;
            var total = v.total;
            var thru = v.thru;
            var today = v.today;

            if(today === null){
              var currentRound = v.current_round;
              var round = v.rounds;
              $(round).each(function(i,e){
                if(currentRound === i+1){
                  var teeTime = e.tee_time;
                  teeTime = teeTime.slice(11,16);
                  var hours = teeTime.slice(0,2);
                  var minutes = teeTime.slice(3,5);
                  if(hours >= 13){
                    var hour = hours -12;
                    today = hour +':'+minutes+'pm';
                  }else{
                    today = hours +':'+minutes+'am';
                  }
                }
              });
            }
            if(today === 0){today = 'E';}
            if(thru === null || thru === 18){thru = 'Final';}
            if(total === 0){total = 'E';}
            if(today <= -1){
              today = '<td class="under">'+today+'</td>';
            }else if(today < 40 || today === 'E'){
              today = '<td class="over">'+today+'</td>';
            }else{
              today = '<td class="time">'+today+'</td>';
            }
            if(total <= -1){
              total = '<td class="under"> '+total+'</td>';
            }else{
              total = '<td class="over"> '+total+'</td>';
            }
            var anchor = '<tr>'+'<td class="fname">'+fullName+'</td>'+
            today+
            '<td class="thru">'+thru+'</td>'+
            total+'</tr>';

            anchors +=anchor;
          });
        });
        anchors += close;
        scoreHolder.append('<thead class="head"><tr><th>Name</th><th>Today</th><th>Thru</th><th>Total</th></tr></thead>');
        scoreHolder.append(anchors);
      }
    };
    return feed;
  };
  $(function(){
    var Start = new GolfReader();
    Start.init();
  });

})();
