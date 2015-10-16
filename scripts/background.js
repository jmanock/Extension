(function(){
/* TODO
  ~ Change the pics (title, nav-bar, extension)
  ~ Add some color (maybe not just black and gray something inviting)
  ~ Seach for golfers? (not sure how to do this with just jquery)
  ~ refresh button at top (easy enough)
  ~ Make a homepage???
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
      var numberItems = count;
      $('#filter-count').text('number of players'+count);
    });
  });
})();
