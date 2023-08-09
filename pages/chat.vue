<script setup>
const userId = useState("token");
if (userId.value === undefined) {
	navigateTo('/');
}

let content = ''

const sendMessage = async () => {
  console.log(content)
  await useFetch('/api/message', {
    method: 'POST',
    body: { 
      content: content,
      userId: userId
    }
  })
}

const { data: messages } = await useFetch('/api/message')

</script>

<template>
  <main class="bg-slate-300 h-screen grid-rows-[1fr_auto]">
    <div class="flex flex-col gap-4">
      <div class="bg-gray-800 text-white p-4 w-fit rounded-lg m-4" v-for="mes in messages">
        {{ mes.content }}
      </div>
    </div>

    <div class="bg-gray-400 absolute bottom-0 w-screen flex items-center">
      <input v-model="content" class="p-2 w-full bg-transparent" type="text" />
      <button v-on:click="sendMessage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path
            d="M223.87,114l-168-95.89A16,16,0,0,0,32.93,37.32l31,90.47a.42.42,0,0,0,0,.1.3.3,0,0,0,0,.1l-31,90.67A16,16,0,0,0,48,240a16.14,16.14,0,0,0,7.92-2.1l167.91-96.05a16,16,0,0,0,.05-27.89ZM48,224l0-.09L78.14,136H136a8,8,0,0,0,0-16H78.22L48.06,32.12,48,32l168,95.83Z"
          ></path>
        </svg>
      </button>
    </div>
  </main>
</template>
