function fetch_feed(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(data){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        var data = xhr.responseText;
        callback(data);
      }else{
        console.log('response was not 200', xhr.status);
        callback(null);
      }
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
function onRequest(request, sender, callback){
  if(request.action === 'fetch_feed'){
    fetch_feed(request.url, callback);
  }
}
chrome.extension.onRequest.addListener(onRequest);
