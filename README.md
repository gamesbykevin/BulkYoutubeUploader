# BulkYoutubeUploader
This project will allow you to upload videos to Youtube in bulk

This project will upload videos to youtube one at a time. Each video uploaded will be marked private with a future publish date. 
The publish date will add 1 day per each video uploaded. Example: 1st video Jul 4th 2018, 2nd video July 5th 2018, etc...
Youtube allows only 100 videos per day to be uploaded. 
If you exceed the limit the app will crash with the message that you exceeded your daily limit. You won't be banned only 100 videos will be uploaded and you have to wait 24 hours.

Pre-requisites

1) This project is written using nodeJS so it is assumed you have this installed (https://nodejs.org/en/download/)

2) There are a few nodeJS dependencies this project uses to which you can easily install using "npm install <dependency name here>"

3) In order to upload videos to Youtube you will need to use oAuth. Save your client id & secret
   Instructions here to create your credentials (https://developers.google.com/identity/protocols/OAuth2)
   

Instructions

1) After you confirm the above pre-requisites add the "oAuthClientId" & "oAuthClientSecret" to the sampleclient.js file using the oAuth credentials you created

2) In index.js you will need to tweak the initial publish date, video description, and video tags. You'll need to change "fileExtension" if your files aren't .mp4

3) Place the index.js & sampleclient.js files in the same directory where your videos are located

4) Run index.js, your browser will open using your oAuth credentials to authenticate. Google will ask for login and access before your videos start uploading
   This app is intended to run one time, so every time you run index.js you will need to authenticate with Google
