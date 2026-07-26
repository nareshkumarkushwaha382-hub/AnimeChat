"use strict";

/* ==========================================
   AnimeChat v3
   JavaScript 1A
========================================== */

/* ==========================================
   APP STATE
========================================== */

const App = {

currentChat: "Gojo",

contacts: [],

messages: {},

profile: {

name: "You",

bio: "",

status: "Available",

avatar: "👤"

},

theme: "dark"

};

/* ==========================================
   DEFAULT CONTACTS
========================================== */

const DefaultContacts = [

{

name: "Gojo",

avatar: "👑",

status: "Online",

lastMessage: "Nice to meet you."

},

{

name: "Rem",

avatar: "💙",

status: "Online",

lastMessage: "Rem is here."

},

{

name: "Subaru",

avatar: "⚔️",

status: "Online",

lastMessage: "Let's think."

}

];

/* ==========================================
   DOM REFERENCES
========================================== */

const UI = {

loadingScreen:
document.getElementById("loadingScreen"),

contactList:
document.getElementById("contactList"),

messages:
document.getElementById("messages"),

chatName:
document.getElementById("chatName"),

chatAvatar:
document.getElementById("chatAvatar"),

chatStatus:
document.getElementById("chatStatus"),

messageInput:
document.getElementById("messageInput"),

sendButton:
document.getElementById("sendButton"),

searchInput:
document.getElementById("searchInput"),

typingIndicator:
document.getElementById("typingIndicator")

};

/* ==========================================
   LOCAL STORAGE
========================================== */

function loadData(){

const contacts =
localStorage.getItem("animechat_contacts");

const messages =
localStorage.getItem("animechat_messages");

const profile =
localStorage.getItem("animechat_profile");

if(contacts){

App.contacts = JSON.parse(contacts);

}else{

App.contacts = [...DefaultContacts];

}

if(messages){

App.messages = JSON.parse(messages);

}else{

App.messages = {};

}

if(profile){

App.profile = JSON.parse(profile);

}

}

function saveData(){

localStorage.setItem(

"animechat_contacts",

JSON.stringify(App.contacts)

);

localStorage.setItem(

"animechat_messages",

JSON.stringify(App.messages)

);

localStorage.setItem(

"animechat_profile",

JSON.stringify(App.profile)

);

}

/* ==========================================
   APP START
========================================== */

window.addEventListener("load",()=>{

loadData();

setTimeout(()=>{

if(UI.loadingScreen){

UI.loadingScreen.style.display="none";

}

},600);

});
/* ==========================================
   JavaScript 1B
   CONTACTS
========================================== */

/* ==========================================
   CREATE CONTACT ELEMENT
========================================== */

function createContact(contact){

const item=document.createElement("div");

item.className="contact";

if(contact.name===App.currentChat){

item.classList.add("active");

}

item.innerHTML=`

<div class="avatar">

${contact.avatar}

</div>

<div class="contactInfo">

<h3>${contact.name}</h3>

<p>${contact.lastMessage}</p>

</div>

<span class="contactTime">

Now

</span>

`;

item.addEventListener("click",()=>{

openChat(contact.name);

});

return item;

}

/* ==========================================
   RENDER CONTACTS
========================================== */

function renderContacts(){

UI.contactList.innerHTML="";

App.contacts.forEach(contact=>{

UI.contactList.appendChild(

createContact(contact)

);

});

}

/* ==========================================
   OPEN CHAT
========================================== */

function openChat(name){

App.currentChat=name;

const contact=App.contacts.find(

c=>c.name===name

);

if(!contact)return;

document

.querySelectorAll(".contact")

.forEach(card=>{

card.classList.remove("active");

});

document

.querySelectorAll(".contact")

.forEach(card=>{

const title=

card.querySelector("h3");

if(title && title.textContent===name){

card.classList.add("active");

}

});

UI.chatName.textContent=

contact.name;

UI.chatAvatar.textContent=

contact.avatar;

UI.chatStatus.textContent=

contact.status;

renderMessages();

}

/* ==========================================
   RENDER MESSAGES
========================================== */

function renderMessages(){

UI.messages.innerHTML="";

const list=

App.messages[App.currentChat]||[];

list.forEach(msg=>{

const bubble=

document.createElement("div");

bubble.className=

`message ${msg.sender}`;

bubble.innerHTML=`

<div class="messageText">

${msg.text}

</div>

<div class="messageTime">

${msg.time}

</div>

`;

UI.messages.appendChild(bubble);

});

UI.messages.scrollTop=

UI.messages.scrollHeight;

}

/* ==========================================
   UPDATE STARTUP
========================================== */

window.addEventListener("load",()=>{

renderContacts();

openChat(App.currentChat);

});
/* ==========================================
   JavaScript 1C
   MESSAGES
========================================== */

/* ==========================================
   TIME
========================================== */

function getCurrentTime(){

const now=new Date();

return now.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

});

}

/* ==========================================
   SAVE MESSAGE
========================================== */

function addMessage(sender,text){

if(!text.trim()) return;

if(!App.messages[App.currentChat]){

App.messages[App.currentChat]=[];

}

App.messages[App.currentChat].push({

sender:sender,

text:text,

time:getCurrentTime()

});

saveData();

renderMessages();

}

/* ==========================================
   SEND
========================================== */

function sendMessage(){

const text=

UI.messageInput.value.trim();

if(text==="") return;

addMessage(

"user",

text

);

UI.messageInput.value="";

showTyping();

}

/* ==========================================
   BOT REPLY
========================================== */

function botReply(){

const replies=[

"Interesting.",

"I understand.",

"Tell me more.",

"That's nice.",

"I'm listening.",

"Really?",

"Let's continue.",

"😊"

];

const text=

replies[

Math.floor(

Math.random()*replies.length

)

];

addMessage(

"bot",

text

);

}

/* ==========================================
   TYPING
========================================== */

function showTyping(){

UI.typingIndicator.classList.remove(

"hidden"

);

setTimeout(()=>{

UI.typingIndicator.classList.add(

"hidden"

);

botReply();

},1200);

}

/* ==========================================
   EVENTS
========================================== */

UI.sendButton.addEventListener(

"click",

sendMessage

);

UI.messageInput.addEventListener(

"keydown",

event=>{

if(event.key==="Enter"){

sendMessage();

}

});
/* ==========================================
   JavaScript 1D
   SEARCH • EMOJI • ADD CONTACT • PROFILE
========================================== */

/* ==========================================
   SEARCH CONTACTS
========================================== */

UI.searchInput.addEventListener("input",()=>{

const value=

UI.searchInput.value.toLowerCase();

document

.querySelectorAll(".contact")

.forEach(card=>{

const name=

card.querySelector("h3")

.textContent

.toLowerCase();

card.style.display=

name.includes(value)

? "flex"

: "none";

});

});

/* ==========================================
   EMOJI PICKER
========================================== */

const emojiButton=

document.getElementById("emojiButton");

const emojiPicker=

document.getElementById("emojiPicker");

const closeEmojiPicker=

document.getElementById("closeEmojiPicker");

emojiButton.addEventListener("click",()=>{

emojiPicker.classList.toggle("hidden");

});

closeEmojiPicker.addEventListener("click",()=>{

emojiPicker.classList.add("hidden");

});

document

.querySelectorAll("#emojiGrid span")

.forEach(emoji=>{

emoji.addEventListener("click",()=>{

UI.messageInput.value+=

emoji.textContent;

emojiPicker.classList.add(

"hidden"

);

UI.messageInput.focus();

});

});

/* ==========================================
   ATTACHMENT MENU
========================================== */

const attachmentButton=

document.getElementById(

"attachmentButton"

);

const attachmentMenu=

document.getElementById(

"attachmentMenu"

);

const closeAttachmentMenu=

document.getElementById(

"closeAttachmentMenu"

);

attachmentButton.addEventListener("click",()=>{

attachmentMenu.classList.toggle(

"hidden"

);

});

closeAttachmentMenu.addEventListener("click",()=>{

attachmentMenu.classList.add(

"hidden"

);

});

/* ==========================================
   ADD CONTACT
========================================== */

const addButton=

document.getElementById(

"addContactButton"

);

const addPage=

document.getElementById(

"addContactPage"

);

const saveContactButton=

document.getElementById(

"saveContactButton"

);

const newContactName=

document.getElementById(

"newContactName"

);

const newContactAvatar=

document.getElementById(

"newContactAvatar"

);

addButton.addEventListener("click",()=>{

addPage.classList.add("active");

});

saveContactButton.addEventListener("click",()=>{

const name=

newContactName.value.trim();

const avatar=

newContactAvatar.value.trim()||"👤";

if(!name)return;

App.contacts.push({

name,

avatar,

status:"Offline",

lastMessage:"Start chatting..."

});

saveData();

renderContacts();

newContactName.value="";

newContactAvatar.value="";

addPage.classList.remove("active");

});

/* ==========================================
   CLOSE PAGES
========================================== */

document

.querySelectorAll(".closePage")

.forEach(button=>{

button.addEventListener("click",()=>{

button

.closest(".page")

.classList.remove("active");

});

});

/* ==========================================
   PROFILE SAVE
========================================== */

const usernameInput=

document.getElementById(

"usernameInput"

);

const bioInput=

document.getElementById(

"bioInput"

);

const statusInput=

document.getElementById(

"statusInput"

);

const saveProfileButton=

document.getElementById(

"saveProfileButton"

);

saveProfileButton.addEventListener("click",()=>{

App.profile.name=

usernameInput.value;

App.profile.bio=

bioInput.value;

App.profile.status=

statusInput.value;

saveData();

alert("Profile Saved!");

});

/* ==========================================
   THEME
========================================== */

const themeButton=

document.getElementById(

"themeButton"

);

themeButton.addEventListener("click",()=>{

document.body.classList.toggle(

"light"

);

});

/* ==========================================
   END OF JAVASCRIPT PHASE 1
========================================== */
