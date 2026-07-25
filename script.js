/* =====================================================
   AnimeChat v1.0 Final
   script.js
   Project Part 3A-1
===================================================== */

"use strict";

console.log("AnimeChat v1.0 Loading...");

/* =====================================================
   DOM REFERENCES
===================================================== */

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

/* =====================================================
   APPLICATION STATE
===================================================== */

const App={

currentChat:"Gojo",

theme:"dark",

isTyping:false,

isCalling:false,

version:"1.0 Final"

};

/* =====================================================
   AI CHARACTERS
===================================================== */

const Characters={

Gojo:{

name:"Gojo",

avatar:"👑",

status:"Online",

personality:"confident",

welcome:"Nice to meet you."

},

Rem:{

name:"Rem",

avatar:"💙",

status:"Online",

personality:"kind",

welcome:"Rem is here to support you."

},

Subaru:{

name:"Subaru",

avatar:"⚔️",

status:"Online",

personality:"energetic",

welcome:"Let's think carefully."

},

Friend:{

name:"Friend",

avatar:"👤",

status:"Online",

personality:"friendly",

welcome:"Hey! What's up?"

}

};

/* =====================================================
   STORAGE
===================================================== */

const Storage={

KEY_CHATS:"AnimeChat_Chats",

KEY_CONTACTS:"AnimeChat_Contacts",

KEY_PROFILE:"AnimeChat_Profile"

};

/* =====================================================
   DATA
===================================================== */

let Chats={};

let Contacts=[];

let Profile={

name:"You",

status:"Available",

bio:"",

avatar:"👤"

};

/* =====================================================
   TIME
===================================================== */

function currentTime(){

return new Date().toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

}

function currentDate(){

return new Date().toLocaleDateString();

}

/* =====================================================
   LOCAL STORAGE
===================================================== */

function saveAll(){

localStorage.setItem(

Storage.KEY_CHATS,

JSON.stringify(Chats)

);

localStorage.setItem(

Storage.KEY_CONTACTS,

JSON.stringify(Contacts)

);

localStorage.setItem(

Storage.KEY_PROFILE,

JSON.stringify(Profile)

);

}

function loadAll(){

Chats=

JSON.parse(

localStorage.getItem(

Storage.KEY_CHATS

)

)||{};

Contacts=

JSON.parse(

localStorage.getItem(

Storage.KEY_CONTACTS

)

)||[];

Profile=

JSON.parse(

localStorage.getItem(

Storage.KEY_PROFILE

)

)||Profile;

}

/* =====================================================
   FIRST START
===================================================== */

function firstStart(){

if(

Contacts.length>0

){

return;

}

Contacts=

Object.keys(

Characters

);

Contacts.forEach(name=>{

Chats[name]=[

{

text:

Characters[name].welcome,

sender:"bot",

time:currentTime()

}

];

});

saveAll();

}

console.log(

"Part 3A-1 Loaded"

);
/* =====================================================
   CONTACT LIST
===================================================== */

function renderContacts(){

contactList.innerHTML="";

Contacts.forEach(name=>{

const character=Characters[name];

const lastMessage=

Chats[name][Chats[name].length-1];

const contact=document.createElement("div");

contact.className="contact";

if(name===App.currentChat){

contact.classList.add("active");

}

contact.dataset.name=name;

contact.innerHTML=`

<div class="avatar">

${character.avatar}

</div>

<div class="contactInfo">

<h3>${character.name}</h3>

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

/* =====================================================
   OPEN CHAT
===================================================== */

function openChat(name){

App.currentChat=name;

const character=Characters[name];

chatName.textContent=

character.name;

chatAvatar.textContent=

character.avatar;

chatStatus.textContent=

character.status;

renderContacts();

renderMessages();

if(window.innerWidth<=900){

sidebar.classList.add("hide");

}

}

/* =====================================================
   RENDER MESSAGES
===================================================== */

function renderMessages(){

messages.innerHTML="";

if(!Chats[App.currentChat]){

Chats[App.currentChat]=[];

}

Chats[App.currentChat].forEach(msg=>{

addMessage(

msg.text,

msg.sender,

msg.time

);

});

scrollBottom();

}

/* =====================================================
   CREATE MESSAGE
===================================================== */

function addMessage(

text,

sender,

time

){

const bubble=

document.createElement("div");

bubble.className=

`message ${sender}`;

bubble.innerHTML=`

<div class="messageText">

${escapeHTML(text)}

</div>

<div class="msgTime">

${time}

</div>

`;

messages.appendChild(bubble);

}

/* =====================================================
   SCROLL
===================================================== */

function scrollBottom(){

messages.scrollTop=

messages.scrollHeight;

}

/* =====================================================
   SAFE HTML
===================================================== */

function escapeHTML(text){

const div=

document.createElement("div");

div.textContent=text;

return div.innerHTML;

}

/* =====================================================
   UPDATE CONTACT PREVIEW
===================================================== */

function updateContactPreview(name){

const last=

Chats[name][Chats[name].length-1];

const contact=

document.querySelector(

`.contact[data-name="${name}"]`

);

if(!contact) return;

contact.querySelector(

".lastMessage"

).textContent=

last.text;

contact.querySelector(

".contactTime"

).textContent=

last.time;

}

/* =====================================================
   PART 3A-2 COMPLETE
===================================================== */

console.log(

"Project Part 3A-2 Loaded"

);
/* =====================================================
   SEARCH CONTACTS
===================================================== */

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

/* =====================================================
   MOBILE NAVIGATION
===================================================== */

backButton.addEventListener("click",()=>{

sidebar.classList.remove("hide");

});

window.addEventListener("resize",()=>{

if(window.innerWidth>900){

sidebar.classList.remove("hide");

}

});

/* =====================================================
   LOADING SCREEN
===================================================== */

function hideLoadingScreen(){

if(!loadingScreen) return;

setTimeout(()=>{

loadingScreen.style.opacity="0";

loadingScreen.style.pointerEvents="none";

setTimeout(()=>{

loadingScreen.style.display="none";

},500);

},600);

}

/* =====================================================
   TYPING INDICATOR
===================================================== */

function showTyping(){

if(!typingIndicator) return;

typingIndicator.classList.remove("hidden");

App.isTyping=true;

}

function hideTyping(){

if(!typingIndicator) return;

typingIndicator.classList.add("hidden");

App.isTyping=false;

}

/* =====================================================
   NOTIFICATION
===================================================== */

function notify(text){

const box=

document.getElementById("notification");

const label=

document.getElementById("notificationText");

if(!box||!label) return;

label.textContent=text;

box.classList.remove("hidden");

setTimeout(()=>{

box.classList.add("hidden");

},2500);

}

/* =====================================================
   APPLICATION STARTUP
===================================================== */

function initializeApplication(){

loadAll();

firstStart();

renderContacts();

openChat(App.currentChat);

hideLoadingScreen();

console.log(

"AnimeChat v1.0 Final Ready"

);

}

/* =====================================================
   START APP
===================================================== */

window.addEventListener(

"load",

initializeApplication

);

/* =====================================================
   DEBUG
===================================================== */

console.log(

"Version:",

App.version

);

console.log(

"Characters:",

Object.keys(Characters).length

);

console.log(

"Contacts:",

Contacts.length

);

/* =====================================================
   END OF PROJECT PART 3A
===================================================== */
