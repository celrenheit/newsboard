var hyperquest = require('hyperquest');
var bluebird = require('bluebird');
var async = require('async');
var _ = require('lodash');


var HackerNews = module.exports = function (options) {
	var defaultOptions = {
		limit : 30
	};
	this.options = _.defaults(options || {}, defaultOptions);
	this.posts = [];
}
HackerNews.prototype.fetch = function(){
	var self = this;
	var itemIDs = '';
	var i = 1 ;
	return new Promise(function(resolve, reject) {
		hyperquest('https://hacker-news.firebaseio.com/v0/topstories.json' , { method: 'GET' })
		.on('error', function(error) {
			reject(error)
		})
		.on('readable', function () {
			var stream = this, item;
			  while (item = stream.read()) {
				  itemIDs += item;
				}
		})
		.on('end', function() {
			var items = JSON.parse(itemIDs);
			self.fetchEach(items, function(err, data) {
			  	if(err) {
			  		console.log(err);
			  		reject(err);
			  		return ;
			  	}
			  	resolve(data);
			  });
		});

	});
};
HackerNews.prototype.fetchEach = function(items, callback) {
	var parallelTasks = [];
	var i = 1;
	var self = this;
	items.forEach(function(itemId) {
		parallelTasks.push(function(cb) {
			var data = '';
			hyperquest('https://hacker-news.firebaseio.com/v0/item/'+ itemId +'.json' , { method: 'GET' })
			.on('error', function(error) {
				cb(error, []);
			})
			.on('readable', function() {
				var stream = this, item;
				  	while (item = stream.read()) {
					  data += item;
					}
			})
			.on('end',	function() {
				var post = JSON.parse(data);
				self.posts.push(post);
			    cb(null, post);
			});
		}) 
	});
	async.parallel(parallelTasks, function(err, results) {
		callback(err, results);
	});
};
