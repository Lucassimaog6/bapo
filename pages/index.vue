<script setup>
	let email = '';
	let password = '';

	const userEmail = useState('token');

	const login = async () => {
		const { data } = await useFetch('/api/login', {
			method: 'POST',
			body: {
				email,
				password,
			},
		});

		if (data.value !== false) {
			userEmail.value = data.value;
			navigateTo('/chat');
		} else {
			alert('Senha incorreta');
		}
	};
</script>

<template>
	<main class="min-h-screen flex flex-col gap-4 justify-center items-center">
		<input
			class="w-60 border-2 border-gray-400 px-2 py-1 rounded-md"
			type="email"
			id="email"
			placeholder="mail@example.com"
			v-model="email"
		/>

		<input
			class="w-60 border-2 border-gray-400 px-2 py-1 rounded-md placeholder:tracking-widest"
			type="password"
			id="password"
			placeholder="••••••••••••••"
			v-model="password"
		/>

		<button
			class="w-60 bg-gray-400 rounded-md p-1 text-white"
			v-on:click="login"
		>
			Entrar
		</button>
	</main>
</template>
