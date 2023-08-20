if (!localStorage.getItem('userId')) {
    window.location.href = 'index.html';
}

const input_message = document.querySelector('input');
const button = document.querySelector('button');
const ul = document.querySelector('ul');
const divOverflow = document.querySelector('#scroll');
const ws = new WebSocket('ws://54.198.45.10:8081');

window.addEventListener('load', () => {
    getMessages()
    setTimeout(() => {
        divOverflow.scrollTop = divOverflow.scrollHeight;
    }, 500);
});

input_message.focus();

const sendMessage = () => {
    const content = input_message.value;
    const userId = localStorage.getItem('userId');
    body = {
        content: content,
        userId: userId
    }
    ws.send(JSON.stringify(body));
    input_message.value = '';
    input_message.focus();
}

input_message.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendMessage();
});

button.addEventListener('click', sendMessage);

ws.addEventListener('message', async (event) => {
    const { content, userId, email } = JSON.parse(event.data);
    createMessage(email, content, userId);
});

const getMessages = async () => {
    const response = await fetch('http://54.198.45.10:8080/messages');
    const messages = await response.json();
    messages.forEach(message => {
        createMessage(message.email, message.content, message.userId);
    });    
}

function createMessage(email, content, userId) {
    const li = document.createElement('li');
    if (userId == localStorage.getItem('userId')) {
        li.classList.add('flex', 'justify-end', 'text-right');
    }
    li.innerHTML = `
    <div class="flex flex-col m-2">
        <span class="font-bold">${email}</span>
        <span class="w-fit bg-black/20 p-2 px-4 rounded-lg ">${content}</span>
    </div>
    `;
    ul.appendChild(li)
    divOverflow.scrollTop = divOverflow.scrollHeight;
}