var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: '9HSmE6m2T2ANA3GhIGYWCS2TE',
	consumer_secret: 'BQn3osRmoC0y90XHd7xNj5BDDrLevkNbc3c1DYWlR0u6Truthg',
	access_token_key: '119655436-uneLPkyuGBAFx9AH25AhXPsfhk2YuXLvBI6V0Vbt',
	access_token_secret: 'yTI5EaAinIizRFuXGa8E5BHc9GrKB2QxmAx69WJ6AY7B1'
});

var tweetStore = function (user){
	this.tweetMap = {};
	this.labels=[];
	this.MAX = 100;
	var stream;

	user.on("disconnect",function(evt){
		if(stream)
			stream.destroy();
	});

	this.re=function(tracker){
		if(stream)
			stream.destroy();
		var trackers = this.labels.join(",");
		if(trackers == "")
			return;
		console.log("restarting with trackers :"+trackers);
		stream = client.stream('statuses/filter', {track: trackers});
		stream.on('data', function(tracker){
			return function(event) {
				console.log("in!");
				var isTweet = event && event.text;
				console.log(tracker+"  =>  "+isTweet);
				user.emit('tweet', event);
			}
		}(trackers));
		stream.on('error', function(tracker){
			return function(error) {
				console.log("error in tracking => "+tracker);
				user.emit('rateLimit',{})
			}
		}(trackers));
	}
}

tweetStore.prototype = {
	addLabel: function(label){
		if(this.labels.indexOf(label) === -1){
			this.labels.push(label)
			this.re();
		}
	},
	removeLabel: function(label){
		var index = this.labels.indexOf(label);
		if(index !== -1){
			this.labels.splice(index,1)
			this.re(label);
		}
	}
}
module.exports = function(io){
	return new tweetStore(io);
};