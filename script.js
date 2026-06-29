const API_KEY = "AQ.Ab8RN6LYOYbspXtn_s2IbbnlzhxJ8QtqdO2Z5VdBJrUGMpfItA";
let conversationHistory = [];

let savedChats = JSON.parse(localStorage.getItem("sumiChats")) || [];

async function sendMessage() {
    let input = document.getElementById("user-input");
    let chatBox = document.getElementById("chat-box");

    let text = input.value.trim();
    conversationHistory.push({
        role: "user",
        parts: [{ text: text }]
      });
    if (text === "") return;
    conversationHistory.push({
        role: "user",
        parts: [{ text: text }]
    });

    // User message
    let userMsg = document.createElement("div");
    userMsg.className = "user-message";
    userMsg.innerText = text;
    chatBox.appendChild(userMsg);
    savedChats.push({
        sender: "user",
        text: text
    });
    
    localStorage.setItem("sumiChats", JSON.stringify(savedChats));

    input.value = "";

    // Bot loading
    let botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.innerText = "Sumi AI is typing...";
    chatBox.appendChild(botMsg);

    try {
        let response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                      {
                        role: "user",
                        parts: [{
                            text: "You are Sumi AI. Your creator is Sumit. You were created as an advanced AI assistant project. Never say you are Gemini or Google AI. Always introduce yourself as Sumi AI. You always reply in Hindi only. If someone asks who made you, say: My creator is Sumit. If someone asks what you can do, say: I can answer questions, help in coding, guide students, and chat intelligently. Be friendly and simple."
                        }]
                      },
                      ...conversationHistory
                    ]
                  })
            }
        );

        let data = await response.json();
        console.log("STATUS:", response.status);
        console.log("DATA:", data);
console.log(data);
if (!data.candidates) {
    botMsg.innerText = "Sumi AI is resting, try again in few seconds.";
    console.log(data);
    return;
}

        let reply = data.candidates[0].content.parts[0].text;
        conversationHistory.push({
            role: "model",
            parts: [{ text: reply }]
          });
        botMsg.innerText = reply;
        speakText(reply);
        savedChats.push({
            sender: "bot",
            text: reply
        });
        
        localStorage.setItem("sumiChats", JSON.stringify(savedChats));

    } catch (error) {
        botMsg.innerText = "Error connecting AI ❌";
        console.log(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}
function newChat() {
    let chatBox = document.getElementById("chat-box");

    // Clear old chat
    chatBox.innerHTML = "";
    saveChats = [];
    localStorage.removeItem("sumiChats");
    conversationHistory = [];

    // Add welcome message again
    let botMsg = document.createElement("div");
    botMsg.className = "bot-message";
    botMsg.innerText = "🤖 Hello 👋 I am Sumi AI";

    chatBox.appendChild(botMsg);
    saveChatHistory();
}
document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
window.onload = function () {
    let chatBox = document.getElementById("chat-box");

    savedChats.forEach(chat => {
        let msg = document.createElement("div");

        if (chat.sender === "user") {
            msg.className = "user-message";
        } else {
            msg.className = "bot-message";
        }

        msg.innerText = chat.text;
        chatBox.appendChild(msg);
    });
    let savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
        document.getElementById("history-list").innerHTML = savedHistory;
    }
}
function startVoice() {
    let recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";   // English speech
    // Hindi ke liye: recognition.lang = "hi-IN";

    recognition.start();

    recognition.onresult = function(event) {
        let voiceText = event.results[0][0].transcript;

        document.getElementById("user-input").value = voiceText;
        sendMessage();
    };

    recognition.onerror = function() {
        alert("Mic not working");
    };
}
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}
function saveChatHistory() {
    let historyList = document.getElementById("history-list");

    let newChat = document.createElement("div");
    newChat.addEventListener("click", function() {
        alert("clicked");
    });

    let count = historyList.children.length + 1;
    newChat.innerText = "Chat " + count;
    newChat.onclick = function() {
        alert("Chat " + count + " clicked");
    }

    historyList.appendChild(newChat);
    localStorage.setItem("chatHistory",historyList.innerHTML);
}