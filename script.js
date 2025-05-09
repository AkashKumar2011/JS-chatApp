let username = "";
let currentRoom = "";
let rooms = {};

function joinChat() {
  const input = document.getElementById("username-input");
  const name = input.value.trim();
  if (!name) return alert("Please enter a username");

  username = name;
  document.getElementById("login-page").classList.add("hidden");
  document.getElementById("chat-page").classList.remove("hidden");

  // Auto-create or select a room with the same name as username
  if (!rooms[username]) {
    rooms[username] = { members: [], messages: [] };
    updateRoomList();
  }
  selectRoom(username); // Automatically enter their own room
}


function createRoom() {
  const roomInput = document.getElementById("room-name");
  const roomName = roomInput.value.trim();
  if (!roomName || rooms[roomName]) return;
  rooms[roomName] = { members: [], messages: [] };
  updateRoomList();
  roomInput.value = "";
}

function updateRoomList() {
  const list = document.getElementById("room-list");
  list.innerHTML = "";
  Object.keys(rooms).forEach(roomName => {
    const li = document.createElement("li");
    li.textContent = roomName;
    li.classList.add("room-item");
    li.onclick = () => {
      selectRoom(roomName);

      // For mobile: show chat container, hide sidebar
      if (window.innerWidth < 600) {
        document.querySelector(".sidebar").style.display = "none";
        document.querySelector(".chat-container").style.display = "block";
        showBackButton();
      }
    };
    list.appendChild(li);
  });
}

function showBackButton() {
  const header = document.querySelector(".chat-header");

  // Avoid duplicate buttons
  if (!document.querySelector(".back-button")) {
    const button = document.createElement("button");
    button.className = "back-button";
    button.textContent = "← Back";
    button.onclick = () => {
      document.querySelector(".sidebar").style.display = "block";
      document.querySelector(".chat-container").style.display = "none";
    };
    header.prepend(button);
  }
}
window.addEventListener("resize", () => {
  if (window.innerWidth >= 600) {
    document.querySelector(".sidebar").style.display = "block";
    document.querySelector(".chat-container").style.display = "block";
  }
});



function searchRooms() {
  const search = document.getElementById("room-search").value.toLowerCase();
  const items = document.querySelectorAll("#room-list li");
  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(search) ? "block" : "none";
  });
}

function selectRoom(roomName) {
  currentRoom = roomName;
  document.getElementById("current-room").textContent = roomName;

  // Remove active class from all rooms
  const items = document.querySelectorAll("#room-list li");
  items.forEach(item => item.classList.remove("active-room"));

  // Add active class to the selected room
  const selectedItem = Array.from(items).find(item => item.textContent === roomName);
  if (selectedItem) selectedItem.classList.add("active-room");

  if (!rooms[currentRoom].members.includes(username)) {
    rooms[currentRoom].members.push(username);
  }
  renderMessages();
}

function sendMessage(e) {
  e.preventDefault();
  const input = document.getElementById("message-input");
  const msg = input.value.trim();
  if (!msg || !currentRoom) return;

  rooms[currentRoom].messages.push({
    sender: username,
    message: msg,
    time: new Date().toLocaleTimeString()
  });

  input.value = "";
  renderMessages();
}

function renderMessages() {
  const box = document.getElementById("messages");
  box.innerHTML = "";
  rooms[currentRoom].messages.forEach(({ sender, message, time }) => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<div class="meta">${sender} | ${time}</div><div>${message}</div>`;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}
