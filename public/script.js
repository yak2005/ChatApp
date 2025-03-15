const socket = io();
let username;

document.getElementById('join-chat').addEventListener('click', () => {
    const usernameInput = document.getElementById('username-input');
    if (usernameInput.value) {
        username = usernameInput.value;
        document.getElementById('username-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        socket.emit('new user', username);
    }
});

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', { username, message: input.value });
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const timestamp = new Date().toLocaleTimeString();
    const item = document.createElement('li');
    item.textContent = `[${timestamp}] ${data.username}: ${data.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

input.addEventListener('input', () => {
    socket.emit('typing', username);
});

socket.on('typing', (user) => {
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.textContent = `${user} is typing...`;
    setTimeout(() => {
        typingIndicator.textContent = '';
    }, 1000);
});
