var twitterKey = require('./key.js');
var twitterPck = require('twitter');
var spotifyAPI = require('node-spotify-api');
var spotifyKeys = require('./key.js');
var request = require('request');
var fs = require('file-system');
var userchoice = process.argv[2];
var userInput = process.argv[3];


//What the user can pick

switch (userchoice) {
        case 'my-tweets':
            myTweets();
        break;

        case 'spotify-this-song':
            var songName = userInput;            
            spotifyThis(songName);
        break;

        case 'movie-this':
            movieName = userInput;
            movieThis(movieName);
        break;

        case 'do-what-it-says': 
            doIt();
        break;

        default:
            console.log("Enter a command")
};

//do it function
function doIt() {
    
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
            console.log("Error: "+ error);
        } else {
            var stuffToDo = data.split(","); 
            userchoice = stuffToDo[0]; 
            userInput = stuffToDo[1]; 
            
            switch (userchoice) {
            case 'my-tweets':
                myTweets();
            break;

            case 'spotify-this-song':
                var songName = userInput;            
                spotifyThis(songName);
            break;

            case 'movie-this':
                movieName = userInput;
                movieThis(movieName);
            break;

            case 'do-what-it-says': 
            doIt();
            break;

            default:
                console.log("Enter an approved command")
            }
        }
    })
}
//Movie this function to get the users movie info
function movieThis(movieName) {

    if (movieName == null) {
        movieName = 'Mr. Nobody';
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log('===========================================');
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year the movie came out: " + JSON.parse(body).Year);
        console.log("IMDB rating is: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
        console.log("County the movie was produced: " + JSON.parse(body).Country);
        console.log("Language of movie: " + JSON.parse(body).Language);
        console.log("Plot of the movie: " + JSON.parse(body).Plot);
        console.log("Actors in the movie: " + JSON.parse(body).Actors);
        console.log('===========================================');
    } else {
        console.log("Error: "+ error);
    }
    });
}
//spotify function to get the users sonf info
function spotifyThis(songName) {

    var spotify = new spotifyAPI ({
        id: spotifyKeys.spotifyKeys.client_id,
        secret: spotifyKeys.spotifyKeys.client_secret
    });
    
    if (songName == null) {
        songName = '';
    }
    
    var parameters = songName;
    
    spotify.search({ type: 'track', query: parameters }, function(error, data) {
        if (!error && songName != null) {
          for (var i = 0; i < data.tracks.items.length; i++) {
            var artists = data.tracks.items[i].artists[0].name; 
            var name = data.tracks.items[i].name;
            var preview = data.tracks.items[i].preview_url;
            var album = data.tracks.items[i].album.name;
            console.log('=================================');
            console.log('Artists: ' + artists);
            console.log('Song Name: '+ name);
            console.log('Preview Link: '+ preview);
            console.log('Album: '+ album);
            console.log('=================================');
          }  
        } else {
            console.log("Error: "+ error);
         }
    })
}


//Tweet function to get the tweets
function myTweets() {
    var client = new twitterPck ({
        consumer_key: twitterKey.twitterKeys.consumer_key,
        consumer_secret: twitterKey.twitterKeys.consumer_secret,
        access_token_key: twitterKey.twitterKeys.access_token_key,
        access_token_secret: twitterKey.twitterKeys.access_token_secret
    });

    
    var parameters = {screen_name: '@SaranshNandaku2', count: '20'}; 

    client.get('statuses/user_timeline', parameters, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) { 
                var tweet = tweets[i].text;
                var tweetTime = tweets[i].created_at;
                console.log('Saransh "' + tweet + '" at ' + tweetTime);
            }
        } else {
            console.log("Error: "+ error);
        }
    });
}


