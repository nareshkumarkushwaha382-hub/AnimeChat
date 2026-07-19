console.log("AnimeChat v1.0");

// ============================
// ELEMENTS
// ============================

const contacts = document.querySelectorAll(".contact");
const contactList = document.getElementById("contactList");

const chatContainer = document.getElementById("chatContainer");
const sidebar = document.getElementById("sidebar");

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

// ============================
// CURRENT CHAT
// ============================

let currentPerson = "Gojo";

// ============================
// CHARACTERS
// ============================

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

// ============================
// LOCAL STORAGE
// ============================

let chats =
JSON.parse(
localStorage.getItem("animechat_v1")
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

// ============================
// SAVE
// ============================

function saveChats(){

    localStorage.setItem(
        "animechat_v1",
        JSON.stringify(chats)
    );

}

// ============================
// TIME
// ============================

function getTime(){

    return new Date().toLocaleTimeString([],{

        hour:"2-digit",
        minute:"2-digit"

    });

}

// ============================
// OPEN CHAT
// ============================

contacts.forEach(contact=>{

    contact.onclick=()=>{

        currentPerson=
        contact.dataset.name;

        openChat(currentPerson);

    };

});

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

// ============================
// LOAD CHAT
// ============================

function loadMessages(){

    messages.innerHTML="";

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

// ============================
// CREATE MESSAGE
// ============================

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

        <div>

            ${text}

        </div>

        <div class="msgTime">

            ${time}

        </div>

    `;

    messages.appendChild(div);

    }
// ============================
// SEND MESSAGE
// ============================

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

    setTimeout(aiReply,700);

}

// ============================
// AI REPLY
// ============================

function aiReply(){

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

// ============================
// CONTACT PREVIEW
// ============================

function updatePreview(

name,
text,
time

){

    const contact=document.querySelector(
        `.contact[data-name="${name}"]`
    );

    if(!contact) return;

    contact.querySelector(".lastMessage").textContent=text;

    contact.querySelector(".time").textContent=time;

}

// ============================
// SEARCH
// ============================

search.addEventListener("input",()=>{

    const value=
    search.value.toLowerCase();

    document.querySelectorAll(".contact").forEach(contact=>{

        const name=
        contact.dataset.name.toLowerCase();

        contact.style.display=
        name.includes(value)
        ? "flex"
        : "none";

    });

});

// ============================
// ADD CONTACT
// ============================

document
.getElementById("saveContact")
.addEventListener("click",()=>{

    const name=
    document
    .getElementById("newContactName")
    .value
    .trim();

    const avatar=
    document
    .getElementById("newContactAvatar")
    .value
    .trim() || "👤";

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

    const div=document.createElement("div");

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

    div.onclick=()=>{

        currentPerson=name;

        openChat(name);

    };

    contactList.appendChild(div);

    addContactPage.classList.remove("active");

});

// ============================
// BACK BUTTON
// ============================

backButton.onclick=()=>{

    chatContainer.classList.remove("active");

    sidebar.classList.remove("hide");

};

// ============================
// CALL UI
// ============================

document
.getElementById("voiceCall")
.onclick=()=>{

    callPage.classList.add("active");

    document
    .getElementById("callName")
    .textContent=currentPerson;

    document
    .getElementById("callStatus")
    .textContent="Voice Calling...";

};

document
.getElementById("videoCall")
.onclick=()=>{

    callPage.classList.add("active");

    document
    .getElementById("callName")
    .textContent=currentPerson;

    document
    .getElementById("callStatus")
    .textContent="Video Calling...";

};

document
.getElementById("endCall")
.onclick=()=>{

    callPage.classList.remove("active");

};

// ============================
// AI READY
// ============================

async function askAI(message){

    /*

    Future Gemini request

    const response=
    await fetch("/api/chat",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            character:currentPerson,

            message:message

        })

    });

    return await response.json();

    */

}

// ============================
// START
// ============================

openChat(currentPerson);

console.log("AnimeChat v1.0 Loaded");
