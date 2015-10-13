(function(){
  var FeedReader = function(){
    var feedUrl = 'http://www.yahoo.com/feed';
    var newsHoleder = $('.news-feed');
    var beforeFeed = '<ul>';
    var afterFeed = '</ul>';
    var beforeFeedItem = '<li>';
    var afterFeedItem = '</li>';

    function performAjaxSetup(){
      $(document).ajaxStart(function(){
        $('#reload').html('Loading.. Please wait');
        $('#reload').off();
      });
      $(document).ajaxComplete(function(event, xhr, settings){
        $('#reload').html('Reload.');
        feed.bindUI();
      });
    }
    var feed = {
      xml:' ',
      init:function(){
        this.bindUI();
        performAjaxSetup();
        this.loadFeed();
      },
      bingUi:function(){
        $('#reload').on('click', function(){
          feed.loadFeed();
        });
      },
      loadFeed:function(){
        this.fetchFeed();
      },
      fetchFeed:function(){
        newsHolder.empty();
        $.ajax({
          url:feedUrl,
          dataType:'xml',
          method:'post',
          beforeSend:function(){ },
          success:function(xml){
            feed.populateExit(xml);
          },
          complete:function(){},
        });
      },
      populateExt:function(xml){
        var anchors = beforeFeed;
        $(xml).find('item').each(function(index, elem){
          var title = $(elem).find('title').text().trim();
          var link = $(elem).find('link').text().trim();
          var pubDate = $(this).find('pubDate').text().trim().substring(0,16);

          var anchor = beforeFeedItem + '<a href="' + link + '" target="_blank" title="' + pubDate + '">' + title + '</a>' + afterFeedItem;

           anchors += anchor;
        });
        anchors += afterFeed;
        newsHolder.append(anchors);
      }
    };
    return feed;
  };
  $(function(){
    var gcufFeed = new FeedReader();
    gcufFeed.init();
  });
})();
