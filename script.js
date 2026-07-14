// ===== AnimeChat v1.0 Alpha =====

// Chat database
const chats = {
  Gojo: {
    avatar: "👑",
    status: "Online",
    previewId: "gojoPreview",
    timeId: "gojoTime",
    messages: [
      { sender: "Gojo", text: "Welcome!" }
    ],
    replies: [
      "Yo.",
      "Interesting.",
      "Leave it to me.",
      "Too easy."
    ]
    const chatList = document.getElementById("chatList");
const chatScreen = document.getElementById("chatScreen");
const backButton = document.getElementById("backButton");
  },

  Subaru: {
    avatar: "⚔️",
    status: "Online",
    previewId: "subaruPreview",
    timeId: "subaruTime",
    messages: [
      { sender: "Subaru", text: "Hello, I'm Subaru." }
    ],
    replies: [
      "Be careful.",
      "Let's think first.",
      "That's risky.",
      "I understand."
    ]
  },

  Rem: {
    avatar: "💙",
    status: "Online",
    previewId: "remPreview",
    timeId: "remTime",
    messages: [
      { sender: "Rem", text: "Hello, I'm Rem." }
    ],
    replies: [
      "Rem understands.",
      "I'll support you.",
      "Please stay safe.",
      "Yes."
    ]
  },

  AnimeFriends: {
    avatar: "👥",
    status: "3 members",
    previewId: "groupPreview",
    timeId: "groupTime",
    messages: [
      { sender: "System", text: "Welcome to Anime Friends!" }
    ]
  }
};

// Current chat
let currentChat = "Gojo";

// Elements
const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

const headerAvatar = document.getElementById("headerAvatar");
const headerName = document.getElementById("headerName");
const headerStatus = document.getElementById("headerStatus");
// Show current chat
function showChat() {

    // Update header
    headerAvatar.textContent = chats[currentChat].avatar;
    headerName.textContent = currentChat === "AnimeFriends"
        ? "Anime Friends"
        : currentChat;
    headerStatus.textContent = chats[currentChat].status;

    // Clear old messages
    messages.innerHTML = "";

    // Show messages
    chats[currentChat].messages.forEach(msg => {

        const side = msg.sender === "You" ? "right" : "left";

        messages.innerHTML += `
        <div class="message ${side}">
            <div class="bubble">
                <b>${msg.sender}</b><br>
                ${msg.text}
            </div>
        </div>
        `;

    });

    messages.scrollTop = messages.scrollHeight;
}

// Switch chats
document.getElementById("gojoBtn").onclick = function () {
    currentChat = "Gojo";
    showChat();
};

document.getElementById("subaruBtn").onclick = function () {
    currentChat = "Subaru";
    showChat();
};

document.getElementById("remBtn").onclick = function () {
    currentChat = "Rem";
    showChat();
};

document.getElementById("groupBtn").onclick = function () {
    currentChat = "AnimeFriends";
    showChat();
};

// Show Gojo chat when the app starts
showChat();
