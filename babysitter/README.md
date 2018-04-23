Using Nuco Twilio Account and Nuco Dummy Gmail Account. 

Account Credentials in Lastpass. 

.env file not committed to github for security reasons. 

Please go to Lastpass to get these details. 

On the server, create a user with sudo previledges called nuco, if you don't already have one

Run the application using pm2, make it a service 

// pm2 will reboot the application if it crashes + sends you notifications if the app crashes

> pm2 start app.js

// the following keeps the process list intact across server boots
> sudo env PATH=$PATH:/usr/local/bin pm2 startup -u nuco

// emable keymetrics monitoring