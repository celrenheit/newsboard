var ScrollableList = require('term-list-scrollable');
var colors = require('colors');
var exec = require('child_process').exec;
var platform = require('os').platform();
var HackerNews = require('./hn');


const shellOpenCommand = {
  'win32': 'start ',
  'linux': 'xdg-open ',
  'darwin': 'open '
}[platform];

var list = new ScrollableList({ 
  marker: '\033[36m> \033[0m', 
  markerLength: 3 ,
  viewportSize: 20
});
console.log('Fetching stuff from hacker news');

list.header('Hacker News'.underline.cyan);
list.footer('o Press RETURN to open\t x Press Escape to quit'.italic.magenta);

var selected = 0;
list.on('keypress', function(key, item){
  switch (key.name) {
    case 'return':
      exec(shellOpenCommand+' ' + item);
      list.stop();
      console.log('opening %s', item);
      break;
    case 'backspace':
      break;
    case 'escape':
      list.stop();
      process.exit();
      break;
  }
});

list.on('empty', function(){
  list.stop();
});


var hn = new HackerNews({
	type: 'topstories'
})
.fetch()
.then(function(data) {
  data.forEach(function(news) {
    list.add(news.url, news.title);
  });
  list.start();
})
.catch(function(err) {
  console.log('Error: ',err);
});
