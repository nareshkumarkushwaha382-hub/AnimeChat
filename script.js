/* =========================================
   AnimeChat v1.0 Final
   script.js - Part 1
========================================= */

console.log("AnimeChat Final Loading...");

// =========================================
// ELEMENTS
// =========================================

const sidebar = document.getElementById("sidebar");
const contactList = document.getElementById("contactList");

const chatContainer = document.getElementById("chatContainer");

const chatName = document.getElementById("chatName");
const chatAvatar = document.getElementById("chatAvatar");
const chatStatus = document.getElementById("chatStatus");

const messages = document.getElementById("messages");

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const backButton = document.getElementById("backButton");

const search = document.getElementById("search");


// =========================================
// CURRENT CHAT
// =========================================

let currentChat = "Gojo";


// =========================================
// CHARACTER DATABASE
// =========================================

const characters = {

Gojo:{

avatar:"👑",

status:"Online",

reply:"Nice to meet you."

},

Rem:{

avatar:"💙",

status:"Online",

reply:"Rem is here to support you."

},

Subaru:{

avatar:"⚔️",

status:"Online",

reply:"Let's think carefully."

},

Friend:{

avatar:"👤",

status:"Online",

reply:"Hey, good to see you."

}

};


// =========================================
// LOCAL STORAGE
// =========================================

let chats = JSON.parse(

localStorage.getItem("animechat")

);

if(!chats){

chats={};

Object.keys(characters).forEach(name=>{

chats[name]=[

{

text:characters[name].reply,

type:"bot",

time:getTime()

}

];

});

saveChats();

}


// =========================================
// SAVE
// =========================================

function saveChats(){

localStorage.setItem(

"animechat",

JSON.stringify(chats)

);

}


// =========================================
// TIME
// =========================================

function getTime(){

return new Date().toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

}


// =========================================
// OPEN CHAT
// =========================================

function openChat(name){

currentChat=name;

chatName.textContent=name;

chatAvatar.textContent=

characters[name].avatar;

chatStatus.textContent=

characters[name].status;

messages.innerHTML="";

loadMessages();

if(window.innerWidth<=900){

sidebar.classList.add("hide");

}

}


// =========================================
// LOAD MESSAGES
// =========================================

function loadMessages(){

if(!chats[currentChat]) return;

messages.innerHTML="";

chats[currentChat].forEach(msg=>{

createMessage(

msg.text,

msg.type,

msg.time

);

});

messages.scrollTop=

messages.scrollHeight;

}


// =========================================
// CREATE MESSAGE
// =========================================

function createMessage(

text,

type,

time

){

const div=

document.createElement("div");

div.className=

"message "+type;

div.innerHTML=`

<div>${text}</div>

<div class="msgTime">

${time}

</div>

`;

messages.appendChild(div);

}


// =========================================
// CONTACT EVENTS
// =========================================

document.querySelectorAll(".contact").forEach(contact=>{

contact.addEventListener("click",()=>{

openChat(

contact.dataset.name

);

});

});
/* =========================================
   SEND MESSAGE
========================================= */

sendButton.addEventListener("click",sendMessage);

messageInput.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});

function sendMessage(){

const text=messageInput.value.trim();

if(text==="") return;

const time=getTime();

const message={

text:text,

type:"user",

time:time

};

chats[currentChat].push(message);

saveChats();

createMessage(

message.text,

message.type,

message.time

);

updatePreview(

currentChat,

message.text,

message.time

);

messageInput.value="";

scrollBottom();

setTimeout(botReply,700);

}


/* =========================================
   BOT REPLY
========================================= */

function botReply(){

const reply=characters[currentChat].reply;

const time=getTime();

const message={

text:reply,

type:"bot",

time:time

};

chats[currentChat].push(message);

saveChats();

createMessage(

message.text,

message.type,

message.time

);

updatePreview(

currentChat,

message.text,

message.time

);

scrollBottom();

}


/* =========================================
   UPDATE PREVIEW
========================================= */

function updatePreview(

name,

text,

time

){

const contact=document.querySelector(

`.contact[data-name="${name}"]`

);

if(!contact) return;

const preview=

contact.querySelector(".lastMessage");

const previewTime=

contact.querySelector(".contactTime");

if(preview){

preview.textContent=text;

}

if(previewTime){

previewTime.textContent=time;

}

}


/* =========================================
   AUTO SCROLL
========================================= */

function scrollBottom(){

messages.scrollTop=

messages.scrollHeight;

}


/* =========================================
   BACK BUTTON
========================================= */

if(backButton){

backButton.addEventListener("click",()=>{

sidebar.classList.remove("hide");

});

}


/* =========================================
   STARTUP
========================================= */

window.addEventListener("load",()=>{

openChat(currentChat);

});

console.log("Part 2 Loaded");
