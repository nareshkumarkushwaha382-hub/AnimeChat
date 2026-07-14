// AnimeChat v2.0

const chats = {

Gojo:{
avatar:"👑",
status:"Online",
previewId:"gojoPreview",
timeId:"gojoTime",
messages:[
{sender:"Gojo",text:"Welcome!"}
],
replies:[
"Yo.",
"Interesting.",
"Too easy.",
"Leave it to me."
]
},

Subaru:{
avatar:"⚔️",
status:"Online",
previewId:"subaruPreview",
timeId:"subaruTime",
messages:[
{sender:"Subaru",text:"Hello, I'm Subaru."}
],
replies:[
"Be careful.",
"I understand.",
"Let's think first.",
"That's risky."
]
},

Rem:{
avatar:"💙",
status:"Online",
previewId:"remPreview",
timeId:"remTime",
messages:[
{sender:"Rem",text:"Hello, I'm Rem."}
],
replies:[
"Rem understands.",
"I'll support you.",
"Please stay safe.",
"Yes."
]
},

AnimeFriends:{
avatar:"👥",
status:"3 members",
previewId:"groupPreview",
timeId:"groupTime",
messages:[
{sender:"System",text:"Welcome to Anime Friends!"}
],
replies:[
"Everyone is online.",
"Let's begin!",
"Nice to meet you!"
]
}

};

let currentChat="Gojo";

const messages=document.getElementById("messages");
const input=document.getElementById("messageInput");
const sendButton=document.getElementById("sendButton");

const headerAvatar=document.getElementById("headerAvatar");
const headerName=document.getElementById("headerName");
const headerStatus=document.getElementById("headerStatus");

const chatArea=document.querySelector(".chatArea");
const sidebar=document.querySelector(".sidebar");

const backButton=document.getElementById("backButton");

const gojoBtn=document.getElementById("gojoBtn");
const subaruBtn=document.getElementById("subaruBtn");
const remBtn=document.getElementById("remBtn");
const groupBtn=document.getElementById("groupBtn");
function showChat(){

    const chat = chats[currentChat];

    headerAvatar.textContent = chat.avatar;
    headerName.textContent =
        currentChat === "AnimeFriends"
        ? "Anime Friends"
        : currentChat;

    headerStatus.textContent = chat.status;

    messages.innerHTML = "";

    chat.messages.forEach(msg=>{

        const side =
            msg.sender==="You"
            ? "right"
            : "left";

        messages.innerHTML += `
        <div class="message ${side}">
            <div class="bubble">
                <b>${msg.sender}</b><br>
                ${msg.text}
            </div>
        </div>
        `;

    });

    const last =
        chat.messages[chat.messages.length-1];

    document.getElementById(chat.previewId).textContent =
        last.text;

    document.getElementById(chat.timeId).textContent =
        "Now";

    messages.scrollTop =
        messages.scrollHeight;

}

function openChat(name){

    currentChat=name;

    showChat();

    if(window.innerWidth<=768){

        sidebar.classList.add("hide");

        chatArea.classList.add("active");

    }

}

function closeChat(){

    sidebar.classList.remove("hide");

    chatArea.classList.remove("active");

  }
// Send message
sendButton.onclick = function () {

    const text = input.value.trim();

    if (text === "") return;

    chats[currentChat].messages.push({
        sender: "You",
        text: text
    });

    input.value = "";

    showChat();

    // Random AI reply
    setTimeout(function () {

        const replies = chats[currentChat].replies || [
            "Okay!"
        ];

        const reply =
            replies[Math.floor(Math.random() * replies.length)];

        chats[currentChat].messages.push({
            sender: currentChat === "AnimeFriends"
                ? "System"
                : currentChat,
            text: reply
        });

        showChat();

    }, 1000);

};

// Chat buttons
gojoBtn.onclick = () => openChat("Gojo");
subaruBtn.onclick = () => openChat("Subaru");
remBtn.onclick = () => openChat("Rem");
groupBtn.onclick = () => openChat("AnimeFriends");

// Back button
backButton.onclick = closeChat;

// Press Enter to send
input.addEventListener("keydown", function(e){

    if(e.key==="Enter"){
        sendButton.click();
    }

});

// Desktop starts with chat visible
if(window.innerWidth>768){
    showChat();
          }
