const input_email = document.getElementById('email');
const input_password = document.getElementById('password');
const button = document.querySelector('button');

if (localStorage.getItem('userId')) window.location.href = '/chat';

button.addEventListener('click', async () => {
    const email = input_email.value;
    const password = input_password.value;

    const response = await fetch('https://solid-broccoli-6p7wpwgw94j35x9g-8080.preview.app.github.dev/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })

    if (!response.ok) return alert('Error');
    const data = await response.json();
    if (data.error) return alert(data.error);

    localStorage.setItem('userId', data.userId);
    window.location.href = '/chat';
});
