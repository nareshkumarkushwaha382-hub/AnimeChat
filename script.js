console.log("AnimeChat v1.0");

// ===========================
// ELEMENTS
// ===========================

const contactList = document.getElementById("contactList");

const contacts = document.querySelectorAll(".contact");

const sidebar = document.getElementById("sidebar");

const chatContainer = document.getElementById("chatContainer");

const chatName = document.getElementById("chatName");

const chatAvatar = document.getElementById("chatAvatar");

const chatStatus = document.getElementById("chatStatus");

const messages = document.getElementById("messages");

const input = document.getElementById("messageInput");

const sendButton = document.getElementById("sendButton");

const search = document.getElementById("search");

const backButton = document.getElementById("backButton");
const profilePage = document.getElementById("profilePage");

const settingsPage = document.getElementById("settingsPage");

const addContactPage = document.getElementById("addContactPage");

const callPage = document.getElementById("callPage");


// ===========================
// CURRENT CHAT
// ===========================

let currentPerson = "Gojo";


// ===========================
// CHARACTERS
// ===========================

const characters={

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


// ===========================
// STORAGE
// ===========================

let chats=
JSON.parse(
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


// ===========================
// SAVE
// ===========================

function saveChats(){

localStorage.setItem(
"animechat",
JSON.stringify(chats)
);

}


// ===========================
// TIME
// ===========================

function getTime(){

const now=new Date();

return now.toLocaleTimeString([],{

hour:"2-digit",
minute:"2-digit"

});

}


// ===========================
// CONTACT CLICK
// ===========================

document.querySelectorAll(".contact").forEach(contact=>{

contact.addEventListener("click",()=>{

currentPerson=
contact.dataset.name;

LoadMessages():

});

});


// ===========================
// OPEN CHAT
// ===========================

function openChat(name){

const person=
characters[name];

chatName.textContent=name;

chatAvatar.textContent=
person.avatar;

chatStatus.textContent=
person.status;

sidebar.classList.add("hide");

chatContainer.classList.add("active");

loadMessages();

}


// ===========================
// LOAD CHAT
// ===========================

function loadMessages(){

messages.innerHTML="";

if(!chats[currentPerson]){

chats[currentPerson]=[];

saveChats();

}

chats[currentPerson].forEach(msg=>{

createMessage(

msg.text,
msg.type,
msg.time

);

});

messages.scrollTop=
messages.scrollHeight;

}


// ===========================
// CREATE MESSAGE
// ===========================

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
// ===========================
// SEND MESSAGE
// ===========================

sendButton.addEventListener("click",sendMessage);

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});

function sendMessage(){

    const text=input.value.trim();

    if(text==="") return;

    const time=getTime();

    chats[currentPerson].push({

        text:text,
        type:"user",
        time:time

    });

    saveChats();

    createMessage(

        text,
        "user",
        time

    );

    input.value="";

    updatePreview(

        currentPerson,
        text,
        time

    );

    messages.scrollTop=
    messages.scrollHeight;

    setTimeout(botReply,700);

}



// ===========================
// BOT REPLY
// ===========================

function botReply(){

    const reply=
    characters[currentPerson].reply;

    const time=getTime();

    chats[currentPerson].push({

        text:reply,
        type:"bot",
        time:time

    });

    saveChats();

    createMessage(

        reply,
        "bot",
        time

    );

    updatePreview(

        currentPerson,
        reply,
        time

    );

    messages.scrollTop=
    messages.scrollHeight;

}



// ===========================
// UPDATE CONTACT PREVIEW
// ===========================

function updatePreview(

name,
text,
time

){

    const contact=
    document.querySelector(

`.contact[data-name="${name}"]`

);

    if(!contact) return;

    const preview=

    contact.querySelector(".lastMessage");

    const previewTime=

    contact.querySelector(".time");

    if(preview){

        preview.textContent=text;

    }

    if(previewTime){

        previewTime.textContent=time;

    }

}



// ===========================
// SEARCH
// ===========================

search.addEventListener("input",()=>{

    const value=

    search.value.toLowerCase();

    document.querySelectorAll(".contact").forEach(contact=>{

        const name=

        contact.dataset.name.toLowerCase();

        if(name.includes(value)){

            contact.style.display="flex";

        }

        else{

            contact.style.display="none";

        }

    });

});



// ===========================
// NEW CONTACT
// ===========================

const saveContact=

document.getElementById("saveContact");

if(saveContact){

saveContact.addEventListener("click",()=>{

const name=

document.getElementById("newContactName").value.trim();

const avatar=

document.getElementById("newContactAvatar").value.trim()||"👤";

if(name==="") return;

if(characters[name]){

alert("Contact already exists.");

return;

}

characters[name]={

avatar:avatar,

status:"Online",

reply:"Hello!"

};

chats[name]=[

{

text:"Hello!",

type:"bot",

time:getTime()

}

];

saveChats();

const div=

document.createElement("div");

div.className="contact";

div.dataset.name=name;

div.innerHTML=`

<div class="avatar">

${avatar}

</div>

<div class="contactInfo">

<div class="contactTop">

<h3>${name}</h3>

<span class="time">

Now

</span>

</div>

<p class="lastMessage">

Hello!

</p>

</div>

`;

div.addEventListener("click",()=>{

currentPerson=name;

openChat(name);

});

contactList.appendChild(div);

});

        }
// ===========================
// BACK BUTTON
// ===========================

if(backButton){

backButton.addEventListener("click",()=>{

sidebar.classList.remove("hide");

chatContainer.classList.remove("active");

});

}


// ===========================
// PROFILE PAGE
// ===========================

const profileButton=document.getElementById("profileButton");
const closeProfile=document.querySelector("#profilePage .closePage");

if(profileButton){

profileButton.onclick=()=>{

profilePage.classList.add("active");

};

}

if(closeProfile){

closeProfile.onclick=()=>{

profilePage.classList.remove("active");

};

}


// ===========================
// SETTINGS PAGE
// ===========================

const settingsButton=document.getElementById("settingsTab");
const closeSettings=document.querySelector("#settingsPage .closePage");

if(settingsButton){

settingsButton.onclick=()=>{

settingsPage.classList.add("active");

};

}

if(closeSettings){

closeSettings.onclick=()=>{

settingsPage.classList.remove("active");

};

}


// ===========================
// ADD CONTACT PAGE
// ===========================

const newChat=document.getElementById("newChat");
const closeAdd=document.querySelector("#addContactPage .closePage");

if(newChat){

newChat.onclick=()=>{

addContactPage.classList.add("active");

};

}

if(closeAdd){

closeAdd.onclick=()=>{

addContactPage.classList.remove("active");

};

}


// ===========================
// VOICE / VIDEO CALL
// ===========================

const voiceCall=document.getElementById("voiceCall");
const videoCall=document.getElementById("videoCall");
const endCall=document.getElementById("endCall");

if(voiceCall){

voiceCall.onclick=()=>{

callPage.classList.add("active");

document.getElementById("callName").textContent=currentPerson;

document.getElementById("callStatus").textContent="Voice Calling...";

};

}

if(videoCall){

videoCall.onclick=()=>{

callPage.classList.add("active");

document.getElementById("callName").textContent=currentPerson;

document.getElementById("callStatus").textContent="Video Calling...";

};

}

if(endCall){

endCall.onclick=()=>{

callPage.classList.remove("active");

};

}


// ===========================
// GEMINI PLACEHOLDER
// ===========================

async function askGemini(message){

/*

Replace this with your backend.

Example:

const response=await fetch("/api/chat",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

character:currentPerson,

message:message

})

});

const data=await response.json();

return data.reply;

*/

return characters[currentPerson].reply;

}


// ===========================
// CLOSE PAGES
// ===========================

document.querySelectorAll(".closePage").forEach(btn=>{

btn.addEventListener("click",()=>{

document.querySelectorAll(".page").forEach(page=>{

page.classList.remove("active");

});

});

});


// ===========================
// STARTUP
// ===========================

window.addEventListener("load",()=>{

openChat(currentPerson);

});

console.log("AnimeChat v1.0 Ready");
