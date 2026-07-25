/* ==========================================
   AnimeChat v1.0 Final
   script.js
   Project Part 3A-1
========================================== */

"use strict";

console.log("AnimeChat v1.0 Starting...");

/* ==========================================
   DOM ELEMENTS
========================================== */

const sidebar = document.getElementById("sidebar");
const chatContainer = document.getElementById("chatContainer");

const contactList = document.getElementById("contactList");

const messages = document.getElementById("messages");

const messageInput = document.getElementById("messageInput");

const sendButton = document.getElementById("sendButton");

const searchInput = document.getElementById("search");

const backButton = document.getElementById("backButton");

const chatName = document.getElementById("chatName");
const chatAvatar = document.getElementById("chatAvatar");
const chatStatus = document.getElementById("chatStatus");

const typingIndicator =
document.getElementById("typingIndicator");

const loadingScreen =
document.getElementById("loadingScreen");

/* ==========================================
   GLOBAL VARIABLES
========================================== */

let currentChat = "Gojo";

let darkMode = true;

let callActive = false;

let chats = {};

let contacts = [];

/* ==========================================
   AI CHARACTERS
========================================== */

const characters = {

Gojo:{

avatar:"👑",

status:"Online",

personality:"confident",

defaultReply:"Nice to meet you."

},

Rem:{

avatar:"💙",

status:"Online",

personality:"kind",

defaultReply:"Rem is here to support you."

},

Subaru:{

avatar:"⚔️",

status:"Online",

personality:"energetic",

defaultReply:"Let's think carefully."

},

Friend:{

avatar:"👤",

status:"Online",

personality:"friendly",

defaultReply:"Hey! What's up?"

}

};

/* ==========================================
   LOCAL STORAGE
========================================== */

function loadStorage(){

const savedChats =

localStorage.getItem("animechat_chats");

const savedContacts =

localStorage.getItem("animechat_contacts");

if(savedChats){

chats = JSON.parse(savedChats);

}

else{

initializeChats();

}

if(savedContacts){

contacts = JSON.parse(savedContacts);

}

else{

contacts = Object.keys(characters);

saveContacts();

}

}

function saveChats(){

localStorage.setItem(

"animechat_chats",

JSON.stringify(chats)

);

}

function saveContacts(){

localStorage.setItem(

"animechat_contacts",

JSON.stringify(contacts)

);

}

/* ==========================================
   INITIAL CHAT CREATION
========================================== */

function initializeChats(){

chats = {};

Object.keys(characters).forEach(name=>{

chats[name]=[

{

text:characters[name].defaultReply,

sender:"ai",

time:getCurrentTime()

}

];

});

saveChats();

}

/* ==========================================
   TIME
========================================== */

function getCurrentTime(){

const now = new Date();

return now.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

}

/* ==========================================
   DATE
========================================== */

function getCurrentDate(){

const now = new Date();

return now.toLocaleDateString();

}
/* ==========================================
   RENDER CONTACT LIST
========================================== */

function renderContacts(){

contactList.innerHTML="";

contacts.forEach(name=>{

const person=characters[name];

const lastMessage=

chats[name][chats[name].length-1];

const contact=document.createElement("div");

contact.className="contact";

if(name===currentChat){

contact.classList.add("active");

}

contact.dataset.name=name;

contact.innerHTML=`

<div class="avatar">

${person.avatar}

</div>

<div class="contactInfo">

<h3>${name}</h3>

<p class="lastMessage">

${lastMessage.text}

</p>

</div>

<span class="contactTime">

${lastMessage.time}

</span>

`;

contact.addEventListener(

"click",

()=>{

openChat(name);

}

);

contactList.appendChild(contact);

});

}

/* ==========================================
   OPEN CHAT
========================================== */

function openChat(name){

currentChat=name;

const person=characters[name];

chatName.textContent=name;

chatAvatar.textContent=

person.avatar;

chatStatus.textContent=

person.status;

renderContacts();

loadMessages();

if(window.innerWidth<=900){

sidebar.classList.add("hide");

}

}

/* ==========================================
   LOAD MESSAGES
========================================== */

function loadMessages(){

messages.innerHTML="";

if(!chats[currentChat]){

chats[currentChat]=[];

}

chats[currentChat].forEach(message=>{

renderMessage(

message.text,

message.sender,

message.time

);

});

scrollToBottom();

}

/* ==========================================
   RENDER MESSAGE
========================================== */

function renderMessage(

text,

sender,

time

){

const div=

document.createElement("div");

div.className=

"message "+sender;

div.innerHTML=`

<div class="messageText">

${escapeHTML(text)}

</div>

<div class="msgTime">

${time}

</div>

`;

messages.appendChild(div);

}

/* ==========================================
   AUTO SCROLL
========================================== */

function scrollToBottom(){

messages.scrollTop=

messages.scrollHeight;

}

/* ==========================================
   SAFE HTML
========================================== */

function escapeHTML(text){

const div=

document.createElement("div");

div.textContent=text;

return div.innerHTML;

}

/* ==========================================
   REFRESH PREVIEW
========================================== */

function refreshPreview(name){

renderContacts();

}

/* ==========================================
   WINDOW RESIZE
========================================== */

window.addEventListener(

"resize",

()=>{

if(window.innerWidth>900){

sidebar.classList.remove("hide");

}

}

/* ==========================================
   END PART 3A-2
========================================== */
   /* ==========================================
   SEARCH CONTACTS
========================================== */

searchInput.addEventListener("input",()=>{

const value=

searchInput.value.toLowerCase().trim();

document.querySelectorAll(".contact").forEach(contact=>{

const name=

contact.dataset.name.toLowerCase();

contact.style.display=

name.includes(value)

? "flex"

: "none";

});

});


/* ==========================================
   BACK BUTTON
========================================== */

backButton.addEventListener("click",()=>{

sidebar.classList.remove("hide");

});


/* ==========================================
   LOADING SCREEN
========================================== */

function hideLoading(){

setTimeout(()=>{

loadingScreen.style.opacity="0";

setTimeout(()=>{

loadingScreen.style.display="none";

},500);

},800);

}


/* ==========================================
   MOBILE CHECK
========================================== */

function checkMobile(){

if(window.innerWidth<=900){

sidebar.classList.remove("hide");

}else{

sidebar.classList.remove("hide");

}

}

checkMobile();


/* ==========================================
   START APPLICATION
========================================== */

function initializeApplication(){

loadStorage();

renderContacts();

openChat(currentChat);

hideLoading();

console.log(

"AnimeChat Ready."

);

}

window.addEventListener(

"load",

initializeApplication

);


/* ==========================================
   DEBUG
========================================== */

console.log(

"Characters Loaded:",

Object.keys(characters).length

);

console.log(

"Contacts Loaded:",

contacts.length

);

console.log(

"Chat System Initialized."

);


/* ==========================================
   PROJECT PART 3A COMPLETE
========================================== */
