//client page
//make connection
var socket = io.connect("http://localhost:4000");

//variables
let myTimeout;
var message = document.getElementById("message");
var user = document.getElementById("user");
var button = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var todayDate = document.getElementById("date");
var names = document.getElementById('names');
var onlineNames=document.getElementById('online');
//display our message if it is valid along with the time.
button.addEventListener("click", function () {
  if (message.value.length > 0) {
    let currentTime=displayCurrentTime();
    output.innerHTML +=
      "<p class='myMessage' ><strong>" + "You " + "</strong>" + "<sup style='float:right'>" + currentTime.hours + ":" +currentTime.min +" "+currentTime.ampm.toLowerCase()+"</sup>" + "<br>" + message.value + "</n></p";
  }
  else {
    alert("enter a valid message");
  }
  //emit the message along with the user name.
  socket.emit("chat", { message: message.value, user: user.value });
  //make the message as null, once the message is emitted.
  message.value = "";
});

//enter key will trigger the send image beside message box.
message.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    button.click();
  }
  //if enter key is not pressed, then typing action gets emitted.
  else {
    socket.emit("typing", user.value);
  }
});

//Listen for chat event and display the incoming messages along with the time if it is valid.
socket.on("chat", function (data) {
  feedback.innerHTML = "";
  if (data.user.length > 0 & data.message.length > 0) {
    let currentTime=displayCurrentTime();
    output.innerHTML +=
      "<p class='otherMessage'><strong>" + data.user + " </strong>" + "<sup style='float:right'>" + currentTime.hours + ":" + currentTime.min +" "+currentTime.ampm.toLowerCase()+ "</sup>" + "<br>" + data.message + "</p>";
  }
  else {
    alert("enter a valid message")
  }
});
//listen for typing event and display it.
socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + "  is typing a message....</em></p>";
});
//listen for join event and display the message.
//append the user's name in array along with their socket id.
socket.on("join", function (data) {
  feedback.innerHTML = "<p><em>" + data + "  joined the chat</em></p>";
 
});
//listen for left event and display it.
//pop out the user's name from array.
socket.on("left", function (data) {
  if (data == undefined) {
    feedback.innerHTML = "";
  }
  else {
    feedback.innerHTML = "<p><em>" + data + "  left the chat</em></p>";
  }
})
let enterButton = document.getElementById("enter");

// display the current date and make the login page hidden.
//emit the user details if it is valid.
enterButton.addEventListener("click", () => {
  let userName = document.getElementById("user").value;
  if (userName.length > 0) {
    document.getElementById("name").innerHTML = userName;
    let currentDate=displayCurrentDate();
    todayDate.innerHTML = currentDate;
    // socket.emit("left",userName);
    socket.emit("join", userName);
    document.getElementById('free-chat').style.display = "none";
    document.getElementById('chat-box').style.display = "flex";
  }
  else {
    alert("enter a valid user name")
  }
})
//enter key will trigger the let's go button below text area.
user.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    event.preventDefault();
    enterButton.click();
  }
 
});

// hide the online users data.
function disappearTheNames() {
  document.getElementById("names").style.display = "none";
  clearTimeout(myTimeout);
}
onlineNames.addEventListener("click",displayOnlinePeople);
// display the users who are online.
function displayOnlinePeople() {
  var list = document.getElementById("names");
 list.style.display="block";
 // hide the online users data after 5 sec.
 myTimeout = setTimeout(disappearTheNames, 5000);
 socket.emit("display");
 socket.on("display", function (data) {
  //display the online users names.
  list.innerHTML="";
  for (var i = 0; i < data.length; i++) {
    list.innerHTML += data[i] + "🤍</t> ";
  }
 })
  
}

//fetch live date
function displayCurrentDate(){
  let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    return currentDate;
}

//fetch live time and change it to 12 hour clock and append it with 0 for single digit hour,min.
function displayCurrentTime(){
  var currentHour = new Date();
    var zero = "0";
    let ampm = currentHour.toLocaleString();
    ampm=ampm.substring(ampm.length-2,ampm.length);
    var hours = currentHour.getHours();
    var min = currentHour.getMinutes();
    min = ((min > 9) ? min : zero + min);
    hours = (hours % 12) || 12;
    hours = ((hours > 9) ? hours : zero + hours);
  return {hours:hours,min:min,ampm:ampm}
}
