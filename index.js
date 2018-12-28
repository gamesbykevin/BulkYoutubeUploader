'use strict';

//required to access local files
var fs = require('fs');

//required to connect to google
const {google} = require('googleapis');
const readline = require('readline');

//helper file used to authenticate with youtube
const sampleClient = require('./sampleclient');

//what time do we want to publish our first video at?
const publishDateStartYear = 2019;
const publishDateStartMonth = 6;	//month is 0 - 11
const publishDateStartDay = 11;		//day is 1 - 31
const publishDateStartHour = 4; 	//time is 4:00 am
const publishDateStartMinutes = 0;
const publishDateStartSeconds = 0;
const publishDateStartMilliseconds = 0;

//all our videos are .mp4 files
const fileExtension = '.mp4';

//each video has the same description
const videoDescription = 'Available on Google Play\n\nhttps://play.google.com/store/apps/details?id=com.gamesbykevin.sokoban';

//each video uses the same tags
const videoTags = ['android', 'androidapp', 'androidapps', 'appdevelopment', 'game', 'gameart', 'gamedev', 'gamedevelopment', 'gaming', 'games', 'gamesbykevin', 'googleplay', 'indiedev', 'indiegame', 'indiegames', 'indiegamedev', 'mobilegame', 'onlinegames', 'sokoban'];

//how many milliseconds are there in a single day
const millisecondsPerDay = 86400000;

//the scope of this function is to access youtube and upload videos so we specify the permission here
const scopes = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
];

//initialize the Youtube API library
const youtube = google.youtube({
  version: 'v3',
  auth: sampleClient.oAuth2Client,
});

//very basic example of uploading a single video to youtube
async function uploadFile(fileName, publishDate) {
		
	//title will be same as file name minus the file extension
	const customTitle = fileName.replace(fileExtension,'');
	
	//size of the file
	const fileSizeBytes = fs.statSync(fileName).size;
	
	//print what we are doing here
	console.log('Uploading: ' + fileName + ', publish: ' + publishDate + ', file size: ' + (fileSizeBytes / 1000000.0) + ' mb');

	const res = await youtube.videos.insert({
		part: 'id,snippet,status',
		notifySubscribers: false,
		requestBody: {
			snippet: {
				title: customTitle,
				description: videoDescription,
				tags: videoTags,
			},
			status: {
				//make video private at first
				privacyStatus: 'private',
				
				//this will be when the video is published
				publishAt: publishDate
			},
		},
		media: {
			
			//specify the video we are uploading
			body: fs.createReadStream(fileName),
		}
	});
	
	console.log('\n\n');
	console.log(res.data);
	return res.data;
}

async function uploadVideos() {
	
	//array of files
	var files = [];

	//here we assume our files are in the same directory, add all .mp4 files to an array list
	fs.readdirSync('.').forEach(file => {

		//we only want to add .mp4 files
		if (file.indexOf(fileExtension) > -1)
			files.push(file);
	})

	//sort array based on the file create date asc
	for (var i = 0; i < files.length; i++) {
		
		var bt1 = fs.statSync(files[i]).birthtimeMs;
		
		for (var x = i + 1; x < files.length; x++) {
			
			var bt2 = fs.statSync(files[x]).birthtimeMs;
			
			if (bt1 > bt2) {
				var file1 = files[i];
				var file2 = files[x];
				files[i] = file2;
				files[x] = file1;	
			}
		}
	}

	//how many videos have we uploaded
	var uploaded = 0;
	
	//set the first publish date
	var publishDate = new Date();
	publishDate.setFullYear(publishDateStartYear);
	publishDate.setMonth(publishDateStartMonth);
	publishDate.setDate(publishDateStartDay);
	
	//upload each file one by one
	for (var i = 0; i < files.length; i++) {
		
		//ensure the appropriate time we want the video to be published
		publishDate.setHours(publishDateStartHour);
		publishDate.setMinutes(publishDateStartMinutes);
		publishDate.setSeconds(publishDateStartSeconds);
		publishDate.setMilliseconds(publishDateStartMilliseconds);
		
		//our file name
		var fileName = files[i];

		//upload our file with the associated file name and date when we want to publish
		await uploadFile(fileName, publishDate.toISOString());
		
		//add 1 to total
		uploaded = uploaded + 1;
		
		//display how many videos we have uploaded
		console.log(uploaded + ' videos uploaded');
		
		//since we are going to publish a new video each day we will add 1 day to the current publish date
		publishDate = new Date(publishDate.getTime() + millisecondsPerDay);
	}
}


//start uploading our videos
sampleClient.authenticate(scopes).then(() => 
	uploadVideos()
).catch(console.error);
