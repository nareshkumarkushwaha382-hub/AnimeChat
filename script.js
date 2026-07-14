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
