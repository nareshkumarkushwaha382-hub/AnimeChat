/*=====================================================
  AnimeChat v2.0 Final
  Part 3A
=====================================================*/

"use strict";

/*=====================================================
  APP STATE
=====================================================*/

const App = {
    version: "2.0",
    currentChat: "Gojo",
    typing: false,
    darkMode: true
};

/*=====================================================
  CHARACTER DATABASE
=====================================================*/

const Characters = {

    Gojo:{
        avatar:"👑",
        status:"Online",
        reply:"You actually surprised me."
    },

    Rem:{
        avatar:"💙",
        status:"Online",
        reply:"Rem is always beside you."
    },

    Subaru:{
        avatar:"⚔️",
        status:"Online",
        reply:"Let's do our best!"
    },

    Friend:{
        avatar:"👤",
        status:"Online",
        reply:"Hey!"
    }

};

/*=====================================================
  STORAGE
=====================================================*/

const STORAGE = {

    chats:"animechat_chats",

    contacts:"animechat_contacts",

    profile:"animechat_profile"

};

/*=====================================================
  DATA
=====================================================*/

let Chats = {};

let Contacts = [];

let Profile = {

    name:"You",

    avatar:"👤",

    status:"Available"

};

/*=====================================================
  DOM
=====================================================*/

const contactList = document.getElementById("contactList");

const messages = document.getElementById("messages");

const chatName = document.getElementById("chatName");

const chatAvatar = document.getElementById("chatAvatar");

const chatStatus = document.getElementById("chatStatus");

const messageInput = document.getElementById("messageInput");

const sendButton = document.getElementById("sendButton");

const search = document.getElementById("search");

const typingIndicator = document.getElementById("typingIndicator");

/*=====================================================
  SAFETY CHECK
=====================================================*/

const required = [

contactList,

messages,

chatName,

chatAvatar,

chatStatus,

messageInput,

sendButton

];

if(required.includes(null)){

alert("AnimeChat Error: HTML IDs do not match JavaScript.");

throw new Error("Required HTML element missing.");

}

/*=====================================================
  TIME
=====================================================*/

function getTime(){

return new Date().toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

}

/*=====================================================
  SAVE
=====================================================*/

function saveData(){

localStorage.setItem(

STORAGE.chats,

JSON.stringify(Chats)

);

localStorage.setItem(

STORAGE.contacts,

JSON.stringify(Contacts)

);

localStorage.setItem(

STORAGE.profile,

JSON.stringify(Profile)

);

}

/*=====================================================
  LOAD
=====================================================*/

function loadData(){

Chats =

JSON.parse(

localStorage.getItem(STORAGE.chats)

) || {};

Contacts =

JSON.parse(

localStorage.getItem(STORAGE.contacts)

) || [];

Profile =

JSON.parse(

localStorage.getItem(STORAGE.profile)

) || Profile;

}

/*=====================================================
  FIRST START
=====================================================*/

function createDefaultData(){

if(Contacts.length>0){

return;

}

Contacts=[

"Gojo",

"Rem",

"Subaru",

"Friend"

];

Contacts.forEach(name=>{

Chats[name]=[

{

sender:"bot",

text:Characters[name].reply,

time:getTime()

}

];

});

saveData();

}

/*=====================================================
  STARTUP
=====================================================*/

function initialize(){

loadData();

createDefaultData();

console.log("AnimeChat v2.0 Initialized");

}

window.addEventListener("load",initialize);
/*=====================================================
  PART 3B
  CHAT ENGINE
=====================================================*/

/*=====================================================
  CONTACT LIST
=====================================================*/

function renderContacts(){

contactList.innerHTML="";

Contacts.forEach(name=>{

const character=Characters[name];

const lastMessage=Chats[name][Chats[name].length-1];

const contact=document.createElement("div");

contact.className="contact";

if(name===App.currentChat){

contact.classList.add("active");

}

contact.dataset.name=name;

contact.innerHTML=`

<div class="avatar">${character.avatar}</div>

<div class="contactInfo">

<h3>${name}</h3>

<p class="lastMessage">${lastMessage.text}</p>

</div>

<span class="contactTime">

${lastMessage.time}

</span>

`;

contact.addEventListener("click",()=>{

openChat(name);

});

contactList.appendChild(contact);

});

}

/*=====================================================
  OPEN CHAT
=====================================================*/

function openChat(name){

App.currentChat=name;

chatName.textContent=name;

chatAvatar.textContent=Characters[name].avatar;

chatStatus.textContent=Characters[name].status;

renderMessages();

renderContacts();

}

/*=====================================================
  RENDER MESSAGES
=====================================================*/

function renderMessages(){

messages.innerHTML="";

Chats[App.currentChat].forEach(message=>{

addMessage(

message.sender,

message.text,

message.time

);

});

messages.scrollTop=

messages.scrollHeight;

}

/*=====================================================
  ADD MESSAGE
=====================================================*/

function addMessage(sender,text,time){

const bubble=document.createElement("div");

bubble.className=

sender==="user"

?

"message user"

:

"message bot";

bubble.innerHTML=`

<div class="messageText">

${text}

</div>

<div class="messageTime">

${time}

</div>

`;

messages.appendChild(bubble);

}

/*=====================================================
  SEND MESSAGE
=====================================================*/

function sendMessage(){

const text=

messageInput.value.trim();

if(text==="") return;

const message={

sender:"user",

text:text,

time:getTime()

};

Chats[App.currentChat].push(message);

addMessage(

message.sender,

message.text,

message.time

);

messageInput.value="";

saveData();

messages.scrollTop=

messages.scrollHeight;

showTyping();

setTimeout(botReply,1000);

}

/*=====================================================
  BOT REPLY
=====================================================*/

function botReply(){

hideTyping();

const reply={

sender:"bot",

text:Characters[App.currentChat].reply,

time:getTime()

};

Chats[App.currentChat].push(reply);

addMessage(

reply.sender,

reply.text,

reply.time

);

saveData();

renderContacts();

messages.scrollTop=

messages.scrollHeight;

}

/*=====================================================
  TYPING
=====================================================*/

function showTyping(){

typingIndicator.classList.remove("hidden");

}

function hideTyping(){

typingIndicator.classList.add("hidden");

}

/*=====================================================
  SEARCH
=====================================================*/

search.addEventListener("input",()=>{

const value=

search.value.toLowerCase();

document.querySelectorAll(".contact").forEach(contact=>{

contact.style.display=

contact.dataset.name

.toLowerCase()

.includes(value)

?

"flex"

:

"none";

});

});

/*=====================================================
  EVENTS
=====================================================*/

sendButton.addEventListener(

"click",

sendMessage

);

messageInput.addEventListener(

"keydown",

event=>{

if(event.key==="Enter"){

sendMessage();

}

});

/*=====================================================
  START CHAT
=====================================================*/

window.addEventListener("load",()=>{

renderContacts();

openChat(App.currentChat);

});
/*=====================================================
  PART 3C
  PROFILE • SETTINGS • ADD CONTACT
=====================================================*/

/*=====================================================
  DOM
=====================================================*/

const profileButton=document.getElementById("profileButton");
const profilePage=document.getElementById("profilePage");

const settingsButton=document.getElementById("settingsButton");
const settingsPage=document.getElementById("settingsPage");

const addContactPage=document.getElementById("addContactPage");
const newChatButton=document.getElementById("newChat");

const saveContactButton=document.getElementById("saveContact");

const usernameInput=document.getElementById("usernameInput");
const bioInput=document.getElementById("bioInput");
const statusInput=document.getElementById("statusInput");

const profileName=document.getElementById("profileName");
const profileAvatar=document.getElementById("profileAvatar");
const profileStatus=document.getElementById("profileStatus");

const saveProfileButton=document.getElementById("saveProfile");

const themeButton=document.getElementById("themeButton");

/*=====================================================
  OPEN PAGES
=====================================================*/

profileButton.addEventListener("click",()=>{

loadProfile();

profilePage.classList.add("active");

});

settingsButton.addEventListener("click",()=>{

settingsPage.classList.add("active");

});

newChatButton.addEventListener("click",()=>{

addContactPage.classList.add("active");

});

/*=====================================================
  CLOSE PAGES
=====================================================*/

document.querySelectorAll(".closePage").forEach(button=>{

button.addEventListener("click",()=>{

document.querySelectorAll(".page").forEach(page=>{

page.classList.remove("active");

});

});

});

/*=====================================================
  PROFILE
=====================================================*/

function loadProfile(){

profileName.textContent=Profile.name;

profileAvatar.textContent=Profile.avatar;

profileStatus.textContent=Profile.status;

usernameInput.value=Profile.name;

bioInput.value=Profile.bio||"";

statusInput.value=Profile.status;

}

saveProfileButton.addEventListener("click",()=>{

Profile.name=usernameInput.value.trim()||"You";

Profile.status=statusInput.value.trim()||"Available";

Profile.bio=bioInput.value.trim();

profileName.textContent=Profile.name;

profileAvatar.textContent=Profile.avatar;

profileStatus.textContent=Profile.status;

saveData();

alert("Profile Saved");

});

/*=====================================================
  ADD CONTACT
=====================================================*/

saveContactButton.addEventListener("click",()=>{

const name=document
.getElementById("newContactName")
.value.trim();

const avatar=document
.getElementById("newContactAvatar")
.value.trim()||"👤";

if(name===""){

alert("Enter contact name");

return;

}

if(Characters[name]){

alert("Contact already exists");

return;

}

Characters[name]={

avatar:avatar,

status:"Online",

reply:"Hello!"

};

Contacts.push(name);

Chats[name]=[

{

sender:"bot",

text:"Hello!",

time:getTime()

}

];

saveData();

renderContacts();

document.getElementById("newContactName").value="";

document.getElementById("newContactAvatar").value="";

addContactPage.classList.remove("active");

alert("Contact Added");

});

/*=====================================================
  DARK MODE
=====================================================*/

themeButton.addEventListener("click",()=>{

document.body.classList.toggle("light");

App.darkMode=!App.darkMode;

});

/*=====================================================
  AI PAGE
=====================================================*/

const aiTab=document.getElementById("aiTab");

const aiPage=document.getElementById("aiPage");

aiTab.addEventListener("click",()=>{

aiPage.classList.add("active");

});

document.querySelectorAll(".selectAI").forEach(button=>{

button.addEventListener("click",()=>{

const character=button.dataset.character;

if(Characters[character]){

openChat(character);

}

aiPage.classList.remove("active");

});

});

/*=====================================================
  COMPLETE
=====================================================*/

console.log("Part 3C Loaded");
/*=====================================================
  PART 3D
  CALLS • CHAT MENU • NOTIFICATIONS • UTILITIES
=====================================================*/

/*=====================================================
  DOM
=====================================================*/

const callPage=document.getElementById("callPage");
const callName=document.getElementById("callName");
const callStatus=document.getElementById("callStatus");
const callAvatar=document.getElementById("callAvatar");
const callTimer=document.getElementById("callTimer");

const voiceCall=document.getElementById("voiceCall");
const videoCall=document.getElementById("videoCall");
const endCall=document.getElementById("endCall");

const incomingCallPage=document.getElementById("incomingCallPage");
const incomingCaller=document.getElementById("incomingCaller");
const acceptCall=document.getElementById("acceptCall");
const declineCall=document.getElementById("declineCall");

const notification=document.getElementById("notification");
const notificationText=document.getElementById("notificationText");

const clearChat=document.getElementById("clearChat");
const deleteChat=document.getElementById("deleteChat");
const exportChat=document.getElementById("exportChat");
const pinChat=document.getElementById("pinChat");

const chatMenu=document.getElementById("chatMenu");
const chatOptions=document.getElementById("chatOptions");
const closeChatMenu=document.getElementById("closeChatMenu");

/*=====================================================
  NOTIFICATION
=====================================================*/

function notify(text){

notificationText.textContent=text;

notification.classList.remove("hidden");

setTimeout(()=>{

notification.classList.add("hidden");

},2500);

}

/*=====================================================
  CHAT MENU
=====================================================*/

chatMenu.addEventListener("click",()=>{

chatOptions.classList.toggle("hidden");

});

closeChatMenu.addEventListener("click",()=>{

chatOptions.classList.add("hidden");

});

/*=====================================================
  CHAT OPTIONS
=====================================================*/

clearChat.addEventListener("click",()=>{

Chats[App.currentChat]=[];

saveData();

renderMessages();

renderContacts();

notify("Chat Cleared");

});

deleteChat.addEventListener("click",()=>{

if(App.currentChat==="Gojo"){

notify("Default contact cannot be deleted");

return;

}

delete Chats[App.currentChat];

Contacts=Contacts.filter(name=>name!==App.currentChat);

saveData();

renderContacts();

openChat("Gojo");

notify("Contact Deleted");

});

pinChat.addEventListener("click",()=>{

Contacts=Contacts.filter(name=>name!==App.currentChat);

Contacts.unshift(App.currentChat);

saveData();

renderContacts();

notify("Pinned");

});

exportChat.addEventListener("click",()=>{

const text=Chats[App.currentChat]

.map(msg=>`[${msg.time}] ${msg.sender}: ${msg.text}`)

.join("\n");

const blob=new Blob([text],{type:"text/plain"});

const url=URL.createObjectURL(blob);

const link=document.createElement("a");

link.href=url;

link.download=App.currentChat+".txt";

link.click();

URL.revokeObjectURL(url);

notify("Chat Exported");

});

/*=====================================================
  CALL SYSTEM
=====================================================*/

let seconds=0;

let timer=null;

function startTimer(){

clearInterval(timer);

seconds=0;

callTimer.textContent="00:00";

timer=setInterval(()=>{

seconds++;

const m=String(Math.floor(seconds/60)).padStart(2,"0");

const s=String(seconds%60).padStart(2,"0");

callTimer.textContent=`${m}:${s}`;

},1000);

}

function stopTimer(){

clearInterval(timer);

callTimer.textContent="00:00";

}

function startCall(type){

callPage.classList.add("active");

callAvatar.textContent=Characters[App.currentChat].avatar;

callName.textContent=App.currentChat;

callStatus.textContent=

type==="video"

?

"Video Calling..."

:

"Voice Calling...";

startTimer();

}

voiceCall.addEventListener("click",()=>{

startCall("voice");

});

videoCall.addEventListener("click",()=>{

startCall("video");

});

endCall.addEventListener("click",()=>{

callPage.classList.remove("active");

stopTimer();

notify("Call Ended");

});

/*=====================================================
  INCOMING CALL
=====================================================*/

function incomingCall(name){

incomingCaller.textContent=name;

incomingCallPage.classList.add("active");

}

acceptCall.addEventListener("click",()=>{

incomingCallPage.classList.remove("active");

startCall("voice");

});

declineCall.addEventListener("click",()=>{

incomingCallPage.classList.remove("active");

notify("Call Declined");

});

/*=====================================================
  READY
=====================================================*/

window.addEventListener("load",()=>{

notify("AnimeChat Ready");

console.log("AnimeChat v2.0 Final Loaded");

});
