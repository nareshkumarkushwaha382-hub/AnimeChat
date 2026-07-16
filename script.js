    console.log("AnimeChat v0.2 running");


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


// Character data

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



// Chat memory

const chats = {

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



// Open contacts

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



// Load saved messages

function loadChat(){

    messages.innerHTML = "";


    chats[currentPerson].forEach(message=>{

        addMessage(
            message.text,
            message.type
        );

    });

}



// Add message

function addMessage(text,type){

    const message = document.createElement("div");


    message.className =
        "message " + type;


    message.textContent = text;


    messages.appendChild(message);


    messages.scrollTop =
        messages.scrollHeight;

}



// Send message

sendButton.addEventListener("click",sendMessage);



input.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        sendMessage();

    }

});



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



    input.value="";



    setTimeout(()=>{


        const reply =
        characters[currentPerson].reply;



        addMessage(reply,"bot");



        chats[currentPerson].push({

            text:reply,

            type:"bot"

        });



    },600);

}



// Back button

backButton.addEventListener("click",()=>{


    chatPage.classList.remove("active");


    contactPage.classList.remove("hide");


});




// Search

search.addEventListener("input",()=>{


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


});
