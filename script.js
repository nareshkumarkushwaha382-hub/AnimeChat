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
/* =====================================================
   SEND MESSAGE
===================================================== */

sendButton.addEventListener(

"click",

sendMessage

);

messageInput.addEventListener(

"keydown",

(event)=>{

if(event.key==="Enter"){

event.preventDefault();

sendMessage();

}

}

);

/* =====================================================
   SEND FUNCTION
===================================================== */

function sendMessage(){

const text=

messageInput.value.trim();

if(text===""){

return;

}

const message={

text:text,

sender:"user",

time:currentTime()

};

Chats[App.currentChat].push(

message

);

saveAll();

addMessage(

message.text,

message.sender,

message.time

);

updateContactPreview(

App.currentChat

);

scrollBottom();

messageInput.value="";

showTyping();

setTimeout(

botReply,

900

);

}

/* =====================================================
   BOT REPLY
===================================================== */

function botReply(){

hideTyping();

const reply={

text:getBotReply(

App.currentChat

),

sender:"bot",

time:currentTime()

};

Chats[App.currentChat].push(

reply

);

saveAll();

addMessage(

reply.text,

reply.sender,

reply.time

);

updateContactPreview(

App.currentChat

);

scrollBottom();

}

/* =====================================================
   BOT REPLIES
===================================================== */

function getBotReply(name){

switch(name){

case "Gojo":

return "You actually think that'll work? Interesting.";

case "Rem":

return "Rem believes in you.";

case "Subaru":

return "We'll figure it out together!";

case "Friend":

return "That's awesome!";

default:

return "Hello!";

}

}

/* =====================================================
   MESSAGE SOUND
===================================================== */

function playMessageSound(){

const audio=

document.getElementById(

"messageSound"

);

if(audio){

audio.currentTime=0;

audio.play().catch(()=>{});

}

}
/* =====================================================
   MESSAGE SOUND
===================================================== */

function playMessageSound(){

const sound=document.getElementById("messageSound");

if(!sound) return;

sound.currentTime=0;

sound.play().catch(()=>{});

}

/* =====================================================
   IMPROVED AUTO SCROLL
===================================================== */

function smoothScrollBottom(){

messages.scrollTo({

top:messages.scrollHeight,

behavior:"smooth"

});

}

/* =====================================================
   EXPORT CHAT
===================================================== */

const exportButton=

document.getElementById("exportChat");

if(exportButton){

exportButton.addEventListener("click",()=>{

const history=

Chats[App.currentChat];

const text=

history.map(msg=>

`[${msg.time}] ${msg.sender}: ${msg.text}`

).join("\n");

const blob=new Blob(

[text],

{type:"text/plain"}

);

const url=

URL.createObjectURL(blob);

const link=

document.createElement("a");

link.href=url;

link.download=

`${App.currentChat}.txt`;

link.click();

URL.revokeObjectURL(url);

notify("Chat exported.");

});

}

/* =====================================================
   CLEAR CHAT
===================================================== */

const clearButton=

document.getElementById("clearChat");

if(clearButton){

clearButton.addEventListener("click",()=>{

if(

!confirm(

`Clear chat with ${App.currentChat}?`

)

){

return;

}

Chats[App.currentChat]=[];

saveAll();

renderMessages();

updateContactPreview(

App.currentChat

);

notify("Chat cleared.");

});

}

/* =====================================================
   DELETE CHAT
===================================================== */

const deleteButton=

document.getElementById("deleteChat");

if(deleteButton){

deleteButton.addEventListener("click",()=>{

if(

!confirm(

`Delete ${App.currentChat}?`

)

){

return;

}

if(App.currentChat==="Gojo"){

notify(

"Default characters cannot be deleted."

);

return;

}

delete Chats[App.currentChat];

Contacts=

Contacts.filter(

name=>name!==App.currentChat

);

saveAll();

renderContacts();

openChat("Gojo");

notify("Chat deleted.");

});

}

/* =====================================================
   PIN CHAT
===================================================== */

const pinButton=

document.getElementById("pinChat");

if(pinButton){

pinButton.addEventListener("click",()=>{

Contacts=

Contacts.filter(

name=>name!==App.currentChat

);

Contacts.unshift(

App.currentChat

);

saveAll();

renderContacts();

notify(

`${App.currentChat} pinned.`

);

});

}

/* =====================================================
   MESSAGE ENGINE COMPLETE
===================================================== */

console.log(

"Project Part 3B-2 Loaded"

);
/* =====================================================
   EMOJI PICKER
===================================================== */

const emojiButton =
document.getElementById("emojiButton");

const emojiPicker =
document.getElementById("emojiPicker");

const closeEmoji =
document.getElementById("closeEmoji");

if(emojiButton){

emojiButton.addEventListener("click",()=>{

emojiPicker.classList.toggle("hidden");

});

}

if(closeEmoji){

closeEmoji.addEventListener("click",()=>{

emojiPicker.classList.add("hidden");

});

}

document.querySelectorAll(

"#emojiPicker span"

).forEach(emoji=>{

emoji.addEventListener("click",()=>{

messageInput.value+=emoji.textContent;

messageInput.focus();

});

});


/* =====================================================
   ATTACHMENT MENU
===================================================== */

const attachButton =
document.getElementById("attachButton");

const attachmentMenu =
document.getElementById("attachmentMenu");

const closeAttachment =
document.getElementById("closeAttachment");

if(attachButton){

attachButton.addEventListener("click",()=>{

attachmentMenu.classList.toggle("hidden");

});

}

if(closeAttachment){

closeAttachment.addEventListener("click",()=>{

attachmentMenu.classList.add("hidden");

});

}


/* =====================================================
   CHAT MENU
===================================================== */

const chatMenu =
document.getElementById("chatMenu");

const chatOptions =
document.getElementById("chatOptions");

const closeChatMenu =
document.getElementById("closeChatMenu");

if(chatMenu){

chatMenu.addEventListener("click",()=>{

chatOptions.classList.toggle("hidden");

});

}

if(closeChatMenu){

closeChatMenu.addEventListener("click",()=>{

chatOptions.classList.add("hidden");

});

}


/* =====================================================
   CLOSE POPUPS WHEN CLICKING OUTSIDE
===================================================== */

document.addEventListener("click",(event)=>{

if(

emojiPicker &&
!emojiPicker.contains(event.target) &&
event.target!==emojiButton

){

emojiPicker.classList.add("hidden");

}

if(

attachmentMenu &&
!attachmentMenu.contains(event.target) &&
event.target!==attachButton

){

attachmentMenu.classList.add("hidden");

}

if(

chatOptions &&
!chatOptions.contains(event.target) &&
event.target!==chatMenu

){

chatOptions.classList.add("hidden");

}

});


/* =====================================================
   SHORTCUTS
===================================================== */

document.addEventListener("keydown",(event)=>{

if(event.key==="Escape"){

emojiPicker.classList.add("hidden");

attachmentMenu.classList.add("hidden");

chatOptions.classList.add("hidden");

}

});


/* =====================================================
   PLACEHOLDER ATTACHMENTS
===================================================== */

document.getElementById("imageAttachment")
?.addEventListener("click",()=>{

notify("Image sharing coming soon.");

});

document.getElementById("videoAttachment")
?.addEventListener("click",()=>{

notify("Video sharing coming soon.");

});

document.getElementById("audioAttachment")
?.addEventListener("click",()=>{

notify("Audio sharing coming soon.");

});

document.getElementById("documentAttachment")
?.addEventListener("click",()=>{

notify("Document sharing coming soon.");

});


/* =====================================================
   MESSAGE INPUT AUTO FOCUS
===================================================== */

window.addEventListener("click",()=>{

if(messageInput){

messageInput.focus();

}

});


/* =====================================================
   PART 3B COMPLETE
===================================================== */

console.log(

"Project Part 3B Complete"

);
