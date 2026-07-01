const API_KEY = "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";
let conversationHistory = [];

let savedChats = JSON.parse(localStorage.getItem("sumiChats")) || [];

async function sendMessage() {
    let input = document.getElementById("user-input");
    let chatBox = document.getElementById("chat-box");
    document.querySelector("button").disabled = true;

    let text = input.value.trim();

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
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                 },
                 body: JSON.stringify({
                    model: "openai/gpt-oss-20b:free",
                    messages: [
                       {
                          role: "system",
                          content: "You are Sumi AI. Reply in Hindi."
                       },
                       {
                          role: "user",
                          content: text
                       }
                    ]
                 })
            }
        );

        let data = await response.json();
        console.log("STATUS:", response.status);
        console.log("DATA:", data);
        if (data.error) {
            botMsg.innerText = data.error.message;
            console.log(data.error.message);
            return;
        }
        if (!data.choices) {
    botMsg.innerText = "Sumi AI is resting, try again in few seconds.";
    console.log(data);
    return;
}

        let reply = data.choices[0].message.content;
        botMsg.innerText = reply;
        savedChats.push({
            sender: "bot",
            text: reply
        });
        
        localStorage.setItem("sumiChats", JSON.stringify(savedChats));

    } catch (error) {
        botMsg.innerText = "Error connecting AI ❌";
        console.log(error);
    }
    document.querySelector("button").disabled = false;

    // chatBox.scrollTop = chatBox.scrollHeight;
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
    closeSidebar();
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
function speakText(text) {
   let speech = new SpeechSynthesisUtterance(text);
   speech.lang = "hi-IN";
   window.speechSynthesis.speak(speech);
}
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
}
function logout() {
    alert("Logged Out");
    // ager login page hai to wapas bhej do
    window.loction.href = "login.html";
}
