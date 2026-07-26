"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* ========= LOADING ========= */

    const loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) loadingScreen.style.display = "none";

    /* ========= DOM ========= */

    const contactList = document.getElementById("contactList");
    const chatName = document.getElementById("chatName");
    const chatAvatar = document.getElementById("chatAvatar");
    const chatStatus = document.getElementById("chatStatus");
    const messages = document.getElementById("messages");
    const input = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    /* ========= DATA ========= */

    const contacts = [
        {
            name:"Gojo",
            avatar:"👑",
            status:"Online",
            messages:[
                {sender:"bot",text:"Welcome to AnimeChat!",time:"09:00"}
            ]
        },
        {
            name:"Rem",
            avatar:"💙",
            status:"Online",
            messages:[]
        },
        {
            name:"Subaru",
            avatar:"⚔️",
            status:"Online",
            messages:[]
        },
        {
            name:"Friend",
            avatar:"👤",
            status:"Offline",
            messages:[]
        }
    ];

    let currentChat = contacts[0];

    /* ========= TIME ========= */

    function getTime(){

        const now = new Date();

        return now.toLocaleTimeString([],{

            hour:"2-digit",
            minute:"2-digit"

        });

    }

    /* ========= RENDER MESSAGES ========= */

    function renderMessages(){

        messages.innerHTML="";

        currentChat.messages.forEach(message=>{

            const bubble=document.createElement("div");

            bubble.className="message "+message.sender;

            bubble.innerHTML=`
                <div class="messageText">${message.text}</div>
                <div class="messageTime">${message.time}</div>
            `;

            messages.appendChild(bubble);

        });

        messages.scrollTop=messages.scrollHeight;

    }

    /* ========= OPEN CHAT ========= */

    function openChat(contact){

        currentChat=contact;

        chatName.textContent=contact.name;
        chatAvatar.textContent=contact.avatar;
        chatStatus.textContent=contact.status;

        renderMessages();
        renderContacts();

    }

    /* ========= CONTACTS ========= */

    function renderContacts(){

        const cards=contactList.querySelectorAll(".contact");

        cards.forEach(card=>{

            const name=card.dataset.name;

            const contact=contacts.find(c=>c.name===name);

            if(contact===currentChat){

                card.classList.add("active");

            }else{

                card.classList.remove("active");

            }

            card.onclick=()=>{

                openChat(contact);

            };

        });

    }

    /* ========= SEND ========= */

    function sendMessage(){

        const text=input.value.trim();

        if(text==="") return;

        currentChat.messages.push({

            sender:"user",
            text:text,
            time:getTime()

        });

        input.value="";

        renderMessages();

        setTimeout(()=>{

            currentChat.messages.push({

                sender:"bot",

                text:"I received: "+text,

                time:getTime()

            });

            renderMessages();

        },1000);

    }

    sendButton.onclick=sendMessage;

    input.addEventListener("keydown",e=>{

        if(e.key==="Enter"){

            sendMessage();

        }

    });

    /* ========= START ========= */

    renderContacts();
openChat(currentChat);

});
