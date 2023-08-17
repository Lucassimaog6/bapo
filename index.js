const input_email = document.getElementById('email');
const input_password = document.getElementById('password');
const button = document.querySelector('button');

if (localStorage.getItem('token')) window.location.href = '/chat';

button.addEventListener('click', async () => {
    const email = input_email.value;
    const password = input_password.value;

    const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
    })

    if (!response.ok) return alert('Error');
    const data = await response.json();
    if (data.error) return alert(data.error);

    localStorage.setItem('token', data.token);
    window.location.href = '/chat';
});
