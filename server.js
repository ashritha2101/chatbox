//server page
var express = require("express");
var socket = require("socket.io");
var users = {};

//App setup
var app = express();
var server = app.listen(4000, function () {
  console.log("listening for requests on port 4000,");
});

//serve static files such as images, CSS files, and JavaScript files, using built-in middleware function in Express.
app.use(express.static(__dirname));

//capture the socket.
var io = socket(server);

//triggered when a connection is established.
io.on("connection", (socket) => {
  //listen chat event and emit the data.
  socket.on("chat", function (data) {
    socket.broadcast.emit("chat", data);
  });
  //listen typing event and emit the data.
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
  //listen to join event and emit the data.
  socket.on("join", function (data) {
    socket.broadcast.emit("join", data );
    users[socket.id] = data;
  })

  //listen to disconnect event and emit the data.
  socket.on("disconnect", function () {
    //display to other users
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  })

  //listen to display event and emit the data.
  socket.on("display",function () {
    //display only to the user
    socket.emit("display", Object.values(users));
  })
});

