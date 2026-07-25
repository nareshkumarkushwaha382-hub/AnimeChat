/*=====================================================
    AnimeChat v2.0
    Script.js
    Part 3A
=====================================================*/

"use strict";

/*=====================================================
    APP
=====================================================*/

const App = {

currentChat: "Gojo",

version: "2.0",

theme: "dark",

typing: false,

calling: false

};

/*=====================================================
    CHARACTERS
=====================================================*/

const Characters = {

Gojo:{

name:"Gojo",

avatar:"👑",

status:"Online",

reply:"You look confident today."

},

Rem:{

name:"Rem",

avatar:"💙",

status:"Online",

reply:"Rem believes in you."

},

Subaru:{

name:"Subaru",

avatar:"⚔️",

status:"Online",

reply:"We'll solve this together."

},

Friend:{

name:"Friend",

avatar:"👤",

status:"Online",

reply:"Hello!"

}

};

/*=====================================================
    STORAGE
=====================================================*/

const STORAGE={

CHAT:"animechat_chats",

CONTACTS:"animechat_contacts",

PROFILE:"animechat_profile"

};

/*=====================================================
    DATA
=====================================================*/

let Chats={};

let Contacts=[];

let Profile={

name:"You",

status:"Available",

avatar:"👤"

};

/*=====================================================
    DOM
=====================================================*/

const sidebar=document.getElementById("sidebar");

const contactList=document.getElementById("contactList");

const chatContainer=document.getElementById("chatContainer");

const chatName=document.getElementById("chatName");

const chatAvatar=document.getElementById("chatAvatar");

const chatStatus=document.getElementById("chatStatus");

const messages=document.getElementById("messages");

const messageInput=document.getElementById("messageInput");

const sendButton=document.getElementById("sendButton");

const search=document.getElementById("search");

const backButton=document.getElementById("backButton");

/*=====================================================
    TIME
=====================================================*/

function currentTime(){

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

STORAGE.CHAT,

JSON.stringify(Chats)

);

localStorage.setItem(

STORAGE.CONTACTS,

JSON.stringify(Contacts)

);

localStorage.setItem(

STORAGE.PROFILE,

JSON.stringify(Profile)

);

}

/*=====================================================
    LOAD
=====================================================*/

function loadData(){

Chats=

JSON.parse(

localStorage.getItem(STORAGE.CHAT)

)||{};

Contacts=

JSON.parse(

localStorage.getItem(STORAGE.CONTACTS)

)||[];

Profile=

JSON.parse(

localStorage.getItem(STORAGE.PROFILE)

)||Profile;

}

/*=====================================================
    FIRST START
=====================================================*/

function firstStart(){

if(Contacts.length>0){

return;

}

Contacts=Object.keys(Characters);

Contacts.forEach(name=>{

Chats[name]=[

{

text:Characters[name].reply,

sender:"bot",

time:currentTime()

}

];

});

saveData();

}

/*=====================================================
    START
=====================================================*/

window.addEventListener("load",()=>{

loadData();

firstStart();

console.log("AnimeChat v2.0 Started");

});
/*=====================================================
    RENDER CONTACT LIST
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

<div class="avatar">

${character.avatar}

</div>

<div class="contactInfo">

<div class="contactTop">

<h3>${character.name}</h3>

<span class="time">

${lastMessage.time}

</span>

</div>

<p class="lastMessage">

${lastMessage.text}

</p>

</div>

`;

contact.onclick=()=>{

openChat(name);

};

contactList.appendChild(contact);

});

}

/*=====================================================
    OPEN CHAT
=====================================================*/

function openChat(name){

App.currentChat=name;

chatName.textContent=

Characters[name].name;

chatAvatar.textContent=

Characters[name].avatar;

chatStatus.textContent=

Characters[name].status;

renderContacts();

renderMessages();

}

/*=====================================================
    RENDER MESSAGES
=====================================================*/

function renderMessages(){

messages.innerHTML="";

Chats[App.currentChat].forEach(message=>{

createMessage(

message.text,

message.sender,

message.time

);

});

messages.scrollTop=

messages.scrollHeight;

}

/*=====================================================
    CREATE MESSAGE
=====================================================*/

function createMessage(

text,

sender,

time

){

const bubble=

document.createElement("div");

bubble.className=

`message ${sender}`;

bubble.innerHTML=`

<div>${text}</div>

<div class="msgTime">

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

text:text,

sender:"user",

time:currentTime()

};

Chats[App.currentChat].push(message);

saveData();

createMessage(

message.text,

message.sender,

message.time

);

messageInput.value="";

messages.scrollTop=

messages.scrollHeight;

updatePreview();

setTimeout(botReply,900);

}

/*=====================================================
    BOT REPLY
=====================================================*/

function botReply(){

const reply={

text:

Characters[App.currentChat].reply,

sender:"bot",

time:currentTime()

};

Chats[App.currentChat].push(reply);

saveData();

createMessage(

reply.text,

reply.sender,

reply.time

);

messages.scrollTop=

messages.scrollHeight;

updatePreview();

}

/*=====================================================
    UPDATE CONTACT PREVIEW
=====================================================*/

function updatePreview(){

renderContacts();

}

/*=====================================================
    SEARCH
=====================================================*/

search.addEventListener("input",()=>{

const value=

search.value.toLowerCase();

document.querySelectorAll(".contact")

.forEach(contact=>{

const name=

contact.dataset.name.toLowerCase();

contact.style.display=

name.includes(value)

? "flex"

: "none";

});

});

/*=====================================================
    EVENTS
=====================================================*/

sendButton.onclick=

sendMessage;

messageInput.addEventListener(

"keydown",

event=>{

if(event.key==="Enter"){

sendMessage();

}

});

backButton.onclick=()=>{

sidebar.classList.remove("hide");

};

/*=====================================================
    START CHAT
=====================================================*/

window.addEventListener("load",()=>{

renderContacts();

openChat(App.currentChat);

});
/*=====================================================
    PROFILE
=====================================================*/

const profileButton =
document.getElementById("profileButton");

const profilePage =
document.getElementById("profilePage");

const editProfile =
document.getElementById("editProfile");

const profileName =
document.getElementById("profileName");

const profileAvatar =
document.querySelector(".profileAvatar");

if(profileButton){

profileButton.onclick=()=>{

profilePage.classList.add("active");

profileName.textContent=Profile.name;

if(profileAvatar){

profileAvatar.textContent=Profile.avatar;

}

};

}

/*=====================================================
    SETTINGS
=====================================================*/

const settingsTab =
document.getElementById("settingsTab");

const settingsPage =
document.getElementById("settingsPage");

if(settingsTab){

settingsTab.onclick=()=>{

settingsPage.classList.add("active");

};

}

/*=====================================================
    CLOSE PAGES
=====================================================*/

document.querySelectorAll(".closePage").forEach(button=>{

button.onclick=()=>{

document.querySelectorAll(".page").forEach(page=>{

page.classList.remove("active");

});

};

});

/*=====================================================
    ADD CONTACT
=====================================================*/

const newChat =
document.getElementById("newChat");

const addContactPage =
document.getElementById("addContactPage");

const saveContact =
document.getElementById("saveContact");

if(newChat){

newChat.onclick=()=>{

addContactPage.classList.add("active");

};

}

if(saveContact){

saveContact.onclick=()=>{

const name=

document.getElementById("newContactName").value.trim();

const avatar=

document.getElementById("newContactAvatar").value.trim()||"👤";

if(name===""){

alert("Enter contact name.");

return;

}

if(Characters[name]){

alert("Contact already exists.");

return;

}

Characters[name]={

name:name,

avatar:avatar,

status:"Online",

reply:"Hello!"

};

Contacts.push(name);

Chats[name]=[

{

text:"Hello!",

sender:"bot",

time:currentTime()

}

];

saveData();

renderContacts();

addContactPage.classList.remove("active");

document.getElementById("newContactName").value="";

document.getElementById("newContactAvatar").value="";

};

}

/*=====================================================
    VOICE CALL
=====================================================*/

const voiceCall =
document.getElementById("voiceCall");

const videoCall =
document.getElementById("videoCall");

const callPage =
document.getElementById("callPage");

const endCall =
document.getElementById("endCall");

function startCall(type){

document.getElementById("callName").textContent=

App.currentChat;

document.getElementById("callStatus").textContent=

type==="video"

? "Video Calling..."

: "Voice Calling...";

callPage.classList.add("active");

}

if(voiceCall){

voiceCall.onclick=()=>{

startCall("voice");

};

}

if(videoCall){

videoCall.onclick=()=>{

startCall("video");

};

}

if(endCall){

endCall.onclick=()=>{

callPage.classList.remove("active");

};

}

/*=====================================================
    LIGHT / DARK MODE
=====================================================*/

const darkButton=

document.querySelector(".settingItem");

if(darkButton){

darkButton.onclick=()=>{

document.body.classList.toggle("light");

};

}

/*=====================================================
    READY
=====================================================*/

console.log(

"AnimeChat Part 3C Loaded"

);
/*=====================================================
    PART 3D
    UTILITIES & APPLICATION CORE
=====================================================*/

/*=====================================================
    NOTIFICATION
=====================================================*/

function notify(message){

const old=document.getElementById("notify");

if(old){

old.remove();

}

const toast=document.createElement("div");

toast.id="notify";

toast.className="notification";

toast.textContent=message;

document.body.appendChild(toast);

setTimeout(()=>{

toast.classList.add("show");

},50);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{

toast.remove();

},300);

},2500);

}

/*=====================================================
    LOADING
=====================================================*/

function showLoading(){

document.body.classList.add("loading");

}

function hideLoading(){

document.body.classList.remove("loading");

}

/*=====================================================
    CONNECTION
=====================================================*/

window.addEventListener("online",()=>{

notify("Internet Connected");

});

window.addEventListener("offline",()=>{

notify("No Internet Connection");

});

/*=====================================================
    CHAT HELPERS
=====================================================*/

function clearCurrentChat(){

if(!Chats[App.currentChat]) return;

Chats[App.currentChat]=[];

saveData();

renderMessages();

renderContacts();

notify("Chat Cleared");

}

function deleteCurrentChat(){

if(App.currentChat==="Gojo"){

notify("Default contacts cannot be deleted.");

return;

}

delete Chats[App.currentChat];

Contacts=Contacts.filter(

contact=>contact!==App.currentChat

);

saveData();

renderContacts();

openChat("Gojo");

notify("Contact Deleted");

}

/*=====================================================
    EXPORT CHAT
=====================================================*/

function exportChat(){

const history=

Chats[App.currentChat];

const text=

history.map(message=>{

return `[${message.time}] ${message.sender}: ${message.text}`;

}).join("\n");

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

App.currentChat+".txt";

link.click();

URL.revokeObjectURL(url);

notify("Chat Exported");

}

/*=====================================================
    PLACEHOLDER FOR AI
=====================================================*/

async function askAI(message){

/*

Future Gemini/OpenAI API

Example:

const response=await fetch("/api/chat",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

character:App.currentChat,

message:message

})

});

const data=await response.json();

return data.reply;

*/

return Characters[App.currentChat].reply;

}

/*=====================================================
    APPLICATION READY
=====================================================*/

window.addEventListener("load",()=>{

console.log("================================");

console.log("AnimeChat v2.0");

console.log("Application Ready");

console.log("Current Chat:",App.currentChat);

console.log("Contacts:",Contacts.length);

console.log("Version:",App.version);

console.log("Ready for AI Integration");

console.log("================================");

notify("AnimeChat Ready");

});

/*=====================================================
    END OF PART 3
=====================================================*/

console.log("Project Part 3 Complete");
