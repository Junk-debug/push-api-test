const express = require("express");
const webpush = require("web-push");
const cors = require("cors");
const bodyParser = require("body-parser");

const PUBLIC_KEY =
  "BOu5VTUrO47dGGsXL81DLVQUo8KeAr9teIb9M8zwiXoBt9sQgzPEJg0VDyV68AzH-XEHZb-ox5uU9TA3vg7v9II";
const PRIVATE_KEY = "iZ6tbNuoft_8_772WN5Em8CNJIXjYNMZiE0IonCOXMU";

const vapidKeys = {
  publicKey: PUBLIC_KEY,
  privateKey: PRIVATE_KEY,
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 4000;

app.get("/", (req, res) => res.send("Hello World!"));
const dummyDb = { subscription: null }; //dummy in memory store

const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
  console.log(dummyDb);
};

// The new /save-subscription endpoint
app.post("/save-subscription", async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  console.log(dummyDb.subscription);
  res.json({ message: "success" });
});

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  "mailto:myuserid@email.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = "") => {
  webpush.sendNotification(subscription, dataToSend);
};

app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = "Hello World";
  sendNotification(subscription, message);
  res.json({ message: "message sent" });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
