"use strict";

/* ==========================================
   AnimeChat JS 2
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ========= LOADING ========= */

    const loadingScreen = document.getElementById("loadingScreen");

    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }

    /* ========= DOM ========= */

    const contactList = document.getElementById("contactList");
    const chatName = document.getElementById("chatName");
    const chatAvatar = document.getElementById("chatAvatar");
    const chatStatus = document.getElementById("chatStatus");
    const messages = document.getElementById("messages");

    /* ========= DATA ========= */

    const contacts = [

        {
            name: "Gojo",
            avatar: "👑",
            status: "Online"
        },

        {
            name: "Rem",
            avatar: "💙",
            status: "Online"
        },

        {
            name: "Subaru",
            avatar: "⚔️",
            status: "Online"
        },

        {
            name: "Friend",
            avatar: "👤",
            status: "Offline"
        }

    ];

    let currentChat = "Gojo";

    /* ========= RENDER CONTACTS ========= */

    function renderContacts() {

        const cards = contactList.querySelectorAll(".contact");

        cards.forEach(card => {

            const name = card.dataset.name;

            if (name === currentChat) {
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }

            card.onclick = () => {

                currentChat = name;

                const contact = contacts.find(c => c.name === name);

                if (!contact) return;

                chatName.textContent = contact.name;
                chatAvatar.textContent = contact.avatar;
                chatStatus.textContent = contact.status;

                messages.innerHTML = "";

                renderContacts();

            };

        });

    }

    /* ========= START ========= */

    renderContacts();

});
