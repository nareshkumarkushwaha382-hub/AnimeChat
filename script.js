alert("JavaScript is running!");
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
/* =====================================================
   PROFILE SYSTEM
===================================================== */

const profilePage =
document.getElementById("profilePage");

const profileButton =
document.getElementById("profileButton");

const editProfile =
document.getElementById("editProfile");

const saveProfile =
document.getElementById("saveProfile");

const profileName =
document.getElementById("profileName");

const profileAvatar =
document.getElementById("profileAvatar");

const usernameInput =
document.getElementById("usernameInput");

const bioInput =
document.getElementById("bioInput");

const statusInput =
document.getElementById("statusInput");


/* =====================================================
   OPEN PROFILE
===================================================== */

if(profileButton){

profileButton.addEventListener("click",()=>{

loadProfile();

profilePage.classList.add("active");

});

}


/* =====================================================
   LOAD PROFILE
===================================================== */

function loadProfile(){

profileName.textContent=
Profile.name;

profileAvatar.textContent=
Profile.avatar;

usernameInput.value=
Profile.name;

bioInput.value=
Profile.bio;

statusInput.value=
Profile.status;

}


/* =====================================================
   SAVE PROFILE
===================================================== */

if(saveProfile){

saveProfile.addEventListener("click",()=>{

Profile.name=

usernameInput.value.trim()||"You";

Profile.bio=

bioInput.value.trim();

Profile.status=

statusInput.value.trim()||"Available";

saveAll();

profileName.textContent=
Profile.name;

notify("Profile updated.");

});

}


/* =====================================================
   SETTINGS
===================================================== */

const settingsPage =
document.getElementById("settingsPage");

const settingsButton =
document.getElementById("settingsButton");

const themeButton =
document.getElementById("themeButton");


if(settingsButton){

settingsButton.addEventListener("click",()=>{

settingsPage.classList.add("active");

});

}


/* =====================================================
   DARK MODE
===================================================== */

if(themeButton){

themeButton.addEventListener("click",()=>{

document.body.classList.toggle("lightMode");

notify("Theme changed.");

});

}


/* =====================================================
   CLOSE PAGES
===================================================== */

document.querySelectorAll(".closePage").forEach(button=>{

button.addEventListener("click",()=>{

document.querySelectorAll(".page").forEach(page=>{

page.classList.remove("active");

});

});

});


/* =====================================================
   PART 3C-1 COMPLETE
===================================================== */

console.log("Project Part 3C-1 Loaded");
/* =====================================================
   ADD CONTACT SYSTEM
===================================================== */

const addContactPage =
document.getElementById("addContactPage");

const newChatButton =
document.getElementById("newChat");

const saveContactButton =
document.getElementById("saveContact");

const newContactName =
document.getElementById("newContactName");

const newContactAvatar =
document.getElementById("newContactAvatar");


/* =====================================================
   OPEN ADD CONTACT PAGE
===================================================== */

if(newChatButton){

newChatButton.addEventListener("click",()=>{

addContactPage.classList.add("active");

newContactName.focus();

});

}


/* =====================================================
   CREATE CONTACT
===================================================== */

if(saveContactButton){

saveContactButton.addEventListener("click",()=>{

const name=

newContactName.value.trim();

const avatar=

newContactAvatar.value.trim() || "👤";

if(name===""){

notify("Enter a contact name.");

return;

}

if(Characters[name]){

notify("Contact already exists.");

return;

}

Characters[name]={

name:name,

avatar:avatar,

status:"Online",

personality:"custom",

welcome:"Hello! Nice to meet you."

};

Contacts.push(name);

Chats[name]=[

{

text:"Hello! Nice to meet you.",

sender:"bot",

time:currentTime()

}

];

saveAll();

renderContacts();

newContactName.value="";

newContactAvatar.value="";

addContactPage.classList.remove("active");

notify(name+" added successfully.");

});

}


/* =====================================================
   AI CHARACTER PAGE
===================================================== */

const aiPage=

document.getElementById("aiPage");

const aiTab=

document.getElementById("aiTab");

if(aiTab){

aiTab.addEventListener("click",()=>{

aiPage.classList.add("active");

});

}


/* =====================================================
   SELECT AI CHARACTER
===================================================== */

document.querySelectorAll(

".selectAI"

).forEach(button=>{

button.addEventListener("click",()=>{

const character=

button.dataset.character;

openChat(character);

document.querySelectorAll(".page")

.forEach(page=>{

page.classList.remove("active");

});

notify(

character+" selected."

);

});

});


/* =====================================================
   VALIDATE CONTACT
===================================================== */

function contactExists(name){

return Contacts.includes(name);

}


/* =====================================================
   REFRESH CONTACT LIST
===================================================== */

function refreshContacts(){

renderContacts();

}


/* =====================================================
   PART 3C-2 COMPLETE
===================================================== */

console.log(

"Project Part 3C-2 Loaded"

);
/* =====================================================
   CALL SYSTEM
===================================================== */

const callPage =
document.getElementById("callPage");

const incomingCallPage =
document.getElementById("incomingCallPage");

const voiceCall =
document.getElementById("voiceCall");

const videoCall =
document.getElementById("videoCall");

const endCall =
document.getElementById("endCall");

const acceptCall =
document.getElementById("acceptCall");

const declineCall =
document.getElementById("declineCall");

const callName =
document.getElementById("callName");

const callStatus =
document.getElementById("callStatus");

const callAvatar =
document.getElementById("callAvatar");

const callTimer =
document.getElementById("callTimer");

const ringtone =
document.getElementById("ringtone");


/* =====================================================
   CALL TIMER
===================================================== */

let timerInterval = null;

let seconds = 0;

function startCallTimer(){

seconds = 0;

callTimer.textContent = "00:00";

clearInterval(timerInterval);

timerInterval = setInterval(()=>{

seconds++;

const min =

String(Math.floor(seconds/60))

.padStart(2,"0");

const sec =

String(seconds%60)

.padStart(2,"0");

callTimer.textContent =

`${min}:${sec}`;

},1000);

}

function stopCallTimer(){

clearInterval(timerInterval);

callTimer.textContent = "00:00";

}


/* =====================================================
   START CALL
===================================================== */

function startCall(type){

App.isCalling = true;

callPage.classList.add("active");

callName.textContent = App.currentChat;

callAvatar.textContent =

Characters[App.currentChat].avatar;

callStatus.textContent =

type==="video"

? "Video Call"

: "Voice Call";

startCallTimer();

notify(type+" call started.");

}


/* =====================================================
   VOICE CALL
===================================================== */

if(voiceCall){

voiceCall.addEventListener("click",()=>{

startCall("voice");

});

}


/* =====================================================
   VIDEO CALL
===================================================== */

if(videoCall){

videoCall.addEventListener("click",()=>{

startCall("video");

});

}


/* =====================================================
   END CALL
===================================================== */

if(endCall){

endCall.addEventListener("click",()=>{

callPage.classList.remove("active");

App.isCalling = false;

stopCallTimer();

notify("Call ended.");

});

}


/* =====================================================
   INCOMING CALL (Demo)
===================================================== */

function incomingCall(character){

incomingCallPage.classList.add("active");

document.getElementById(

"incomingCaller"

).textContent = character;

if(ringtone){

ringtone.currentTime = 0;

ringtone.play().catch(()=>{});

}

}


/* =====================================================
   ACCEPT CALL
===================================================== */

if(acceptCall){

acceptCall.addEventListener("click",()=>{

incomingCallPage.classList.remove("active");

if(ringtone){

ringtone.pause();

ringtone.currentTime = 0;

}

startCall("voice");

});

}


/* =====================================================
   DECLINE CALL
===================================================== */

if(declineCall){

declineCall.addEventListener("click",()=>{

incomingCallPage.classList.remove("active");

if(ringtone){

ringtone.pause();

ringtone.currentTime = 0;

}

notify("Call declined.");

});

}


/* =====================================================
   DEMO SHORTCUT
===================================================== */

document.addEventListener("keydown",(event)=>{

if(event.ctrlKey && event.key==="i"){

incomingCall(App.currentChat);

}

});


/* =====================================================
   FINAL STARTUP CHECK
===================================================== */

window.addEventListener("load",()=>{

console.log("================================");

console.log("AnimeChat v1.0 Final");

console.log("Frontend Initialized");

console.log("Contacts:",Contacts.length);

console.log("Characters:",Object.keys(Characters).length);

console.log("Current Chat:",App.currentChat);

console.log("Ready for Backend Integration");

console.log("================================");

});


/* =====================================================
   END OF PROJECT PART 3
===================================================== */

console.log("Project Part 3 Complete");
