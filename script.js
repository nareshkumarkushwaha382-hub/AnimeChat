const chats = {
  Gojo: {
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
    messages: [
      {
        sender: "System",
        text: "Welcome to Anime Friends!"
      }
    ],
    replies: []
  }
};

let currentChat = "Gojo";

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

function showChat() {

    messages.innerHTML = "";

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

sendButton.onclick = function () {

    const text = input.value.trim();

    if (text === "") return;

    chats[currentChat].messages.push({
        sender: "You",
        text: text
    });

    input.value = "";

    showChat();

    if (currentChat === "AnimeFriends") {

        setTimeout(function () {

            chats[currentChat].messages.push({
                sender: "Gojo",
                text: "Yo."
            });

            showChat();

        }, 1000);

        setTimeout(function () {

            chats[currentChat].messages.push({
                sender: "Subaru",
                text: "Let's think first."
            });

            showChat();

        }, 2000);

        setTimeout(function () {

            chats[currentChat].messages.push({
                sender: "Rem",
                text: "Rem understands."
            });

            showChat();

        }, 3000);

    } else {

        setTimeout(function () {

            const replies = chats[currentChat].replies;

            const reply =
                replies[Math.floor(Math.random() * replies.length)];

            chats[currentChat].messages.push({
                sender: currentChat,
                text: reply
            });

            showChat();

        }, 1000);

    }

};

    input.value = "";

    showChat();

    setTimeout(function () {

        const replies = chats[currentChat].replies;

        const reply =
            replies[Math.floor(Math.random() * replies.length)];

        chats[currentChat].messages.push({
            sender: currentChat,
            text: reply
        });

        showChat();

    }, 1000);

    const replies = chats[currentChat].replies;

    const reply =
        replies[Math.floor(Math.random() * replies.length)];

    chats[currentChat].messages.push({
        sender: currentChat,
        text: reply
    });

    input.value = "";

showChat();

setTimeout(function () {

    const replies = chats[currentChat].replies;

    const reply =
        replies[Math.floor(Math.random() * replies.length)];

    chats[currentChat].messages.push({
        sender: currentChat,
        text: reply
    });

    showChat();

}, 1000);

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

showChat();
document.getElementById("groupBtn").onclick = function () {
    currentChat = "AnimeFriends";
    showChat();
};