console.log("AnimeChat v0.3 running");

const contacts = document.querySelectorAll(".contact");

const contactPage = document.getElementById("contacts");
const chatPage = document.getElementById("chat");

const chatName = document.getElementById("chatName");
const chatAvatar = document.getElementById("chatAvatar");
const chatStatus = document.getElementById("chatStatus");

const messages = document.getElementById("messages");

const input = document.getElementById("messageInput");
const sendButton = document.getElementById("send");

const backButton = document.getElementById("back");

const search = document.getElementById("search");


let currentPerson = "Gojo";


// Characters

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


// Load chats from storage

let chats = JSON.parse(localStorage.getItem("animeChats")) || {

    Gojo:[
        {
            text:"Nice to meet you.",
            type:"bot"
        }
    ],

    Rem:[
        {
            text:"Rem is here to support you.",
            type:"bot"
        }
    ],

    Subaru:[
        {
            text:"Let's think carefully.",
            type:"bot"
        }
    ],

    Friend:[
        {
            text:"Hey, good to see you.",
            type:"bot"
        }
    ]

};



// Save chats

function saveChats(){

    localStorage.setItem(
        "animeChats",
        JSON.stringify(chats)
    );

}



// Contact click

contacts.forEach(contact=>{

    contact.addEventListener("click",()=>{

        currentPerson = contact.dataset.name;

        openChat(currentPerson);

    });

});



// Open chat

function openChat(name){

    const person = characters[name];


    chatName.textContent = name;

    chatAvatar.textContent = person.avatar;

    chatStatus.textContent = person.status;


    contactPage.classList.add("hide");

    chatPage.classList.add("active");


    loadChat();

}



// Load messages

function loadChat(){

    messages.innerHTML="";


    chats[currentPerson].forEach(msg=>{

        addMessage(
            msg.text,
            msg.type
        );

    });

}



// Add message

function addMessage(text, type){

    const div = document.createElement("div");

    div.className = "message " + type;

    const now = new Date();

    const time = now.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

    div.innerHTML = `
        <div>${text}</div>
        <div class="msgTime">${time}</div>
    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

}



// Send message

sendButton.addEventListener(
    "click",
    sendMessage
);


input.addEventListener(
    "keydown",
    function(event){

        if(event.key==="Enter"){

            sendMessage();

        }

    }
);



function sendMessage(){

    const text = input.value.trim();


    if(text===""){
        return;
    }


    addMessage(text,"user");


    chats[currentPerson].push({

        text:text,

        type:"user"

    });


    saveChats();


    input.value="";



    setTimeout(()=>{


        const reply =
        characters[currentPerson].reply;


        addMessage(reply,"bot");


        chats[currentPerson].push({

            text:reply,

            type:"bot"

        });


        saveChats();


    },600);


}



// Back button

backButton.addEventListener(
    "click",
    ()=>{

        chatPage.classList.remove("active");

        contactPage.classList.remove("hide");

    }
);



// Search

search.addEventListener(
    "input",
    ()=>{

        const value =
        search.value.toLowerCase();


        contacts.forEach(contact=>{

            const name =
            contact.dataset.name.toLowerCase();


            if(name.includes(value)){

                contact.style.display="flex";

            }
            else{

                contact.style.display="none";

            }

        });

    }
);
