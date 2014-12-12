var List = require('term-list');
var colors = require('colors');
var exec = require('child_process').exec;
var platform = require('os').platform();
var HackerNews = require('./hn');


const shellOpenCommand = {
  'win32': 'start ',
  'linux': 'xdg-open ',
  'darwin': 'open '
}[platform];

var list = new List({ marker: '\033[36m> \033[0m', markerLength: 6 });
console.log('Fetching stuff from hacker news');

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
