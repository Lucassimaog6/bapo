<script setup>
	const userEmail = useState('token');
	if (userEmail.value === undefined) {
		navigateTo('/');
	}
</script>

<template>
	<h1>{{ userEmail }}</h1>
</template>
