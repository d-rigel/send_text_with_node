const express = require("express");
const socketio = require("socket.io");
const expressLayouts = require("express-ejs-layouts");
const Vonage = require("@vonage/server-sdk");

const app = express();

const vonage = new Vonage({
  apiKey: "ecb550b8nea",
  apiSecret: "6hHMJZs6UPX5zhaTnea",
});

//Set template engine
app.set("view engine", "ejs");
app.use(expressLayouts);

//Set static folder
app.use(express.static(`${__dirname}/public`));

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//home route
app.get("/", (req, res) => {
  res.render("index");
});

//post request
app.post("/", (req, res) => {
  const text = req.body.text;
  const from = "Nnadozie Emmanuel";
  const number = req.body.number;

  vonage.message.sendSms(from, number, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      const data = {
        id: responseData.messages[0]["message-id"],
        number: responseData.messages[0]["to"],
      };

      //emit to the client
      io.emit("smsStatus", data);

      if (responseData.messages[0]["status"] === "0") {
        console.log("Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("Connected");

  io.on("disconnect", () => {
    console.log("Disconneted");
  });
});
