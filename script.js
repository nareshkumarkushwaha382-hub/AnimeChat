"use strict";

/* ==========================================
   AnimeChat v3
   JS 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("AnimeChat started");

    /* ========= DOM ========= */

    const loadingScreen = document.getElementById("loadingScreen");
    const contactList = document.getElementById("contactList");
    const messages = document.getElementById("messages");
    const chatName = document.getElementById("chatName");
    const chatAvatar = document.getElementById("chatAvatar");
    const chatStatus = document.getElementById("chatStatus");

    /* ========= CONTACTS ========= */

    const contacts = [

        {
            name: "Gojo",
            avatar: "👑",
            status: "Online",
            messages: []
        },

        {
            name: "Rem",
            avatar: "💙",
            status: "Online",
            messages: []
        },

        {
            name: "Subaru",
            avatar: "⚔️",
            status: "Online",
            messages: []
        },

        {
            name: "Friend",
            avatar: "👤",
            status: "Offline",
            messages: []
        }

    ];

    let currentChat = contacts[0];

    /* ========= RENDER CONTACTS ========= */

    function renderContacts() {

        contactList.innerHTML = "";

        contacts.forEach(contact => {

            const card = document.createElement("div");

            card.className = "contact";

            if (contact === currentChat) {
                card.classList.add("active");
            }

            card.innerHTML = `
                <div class="avatar">${contact.avatar}</div>

                <div class="contactInfo">
                    <h3>${contact.name}</h3>
                    <p>${contact.status}</p>
                </div>

                <span class="contactTime">Now</span>
            `;

            card.addEventListener("click", () => {

                currentChat = contact;

                renderContacts();

                openChat();

            });

            contactList.appendChild(card);

        });

    }

    /* ========= OPEN CHAT ========= */

    function openChat() {

        chatName.textContent = currentChat.name;
        chatAvatar.textContent = currentChat.avatar;
        chatStatus.textContent = currentChat.status;

        messages.innerHTML = "";

    }

    /* ========= START ========= */

    renderContacts();

    openChat();

    if (loadingScreen) {

        loadingScreen.style.display = "none";

    }

});
