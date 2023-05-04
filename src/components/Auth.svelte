<script>
    import { authHandlers, authStore } from "../stores/authStore";
    import { onDestroy } from "svelte";

let register = true;
let error;
let username = '';
let email = '';
let password = '';
let confirmPassword = '';

authStore.subscribe((state) => {
  error = state.error;
});


async function handleSubmit () {
    if(!email || !password || (register && !confirmPassword)) {
        return
    }

    if (register && password === confirmPassword) {
        try {
            await authHandlers.signup(email, password, username);
        } catch (err) {
            console.log(err)
        }
    } else {
        try {
            await authHandlers.login(email, password);
        } catch (err) {
            console.log(err)
        }
    }

    if ($authStore.currentUser) {
        window.location.href='/privatedashboard'
    }
}

onDestroy (() => {
      authStore.update(state => ({ ...state, error: null}));
    })

</script>

<main class="flex justify-center items-center h-screen">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md">
      <h1 class="text-3xl font-bold mb-4 text-center">Sign Up</h1>
      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2" for="username">
          Username
        </label>
        <input bind:value={username} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Enter your username" />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2" for="email">
          Email
        </label>
        <input bind:value={email} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Enter your email" />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2" for="password">
          Password
        </label>
        <input bind:value={password} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Enter your password" />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-bold mb-2" for="confirm-password">
          Confirm Password
        </label>
        <input bind:value={confirmPassword} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="confirm-password" type="password" placeholder="Confirm your password" />
      </div>
      <div class="flex items-center justify-between">
        <button on:click={handleSubmit} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Sign Up
        </button>
        <div class="flex flex-col ml-6">
          <span class="text-gray-700 text-sm mb-2">
            Already have an account?
          </span>
          <a class="text-blue-500 hover:text-blue-800 text-sm font-bold" href="/login">
            Log In
          </a>
        </div>
      </div>
      {#if error}
    <div class="bg-red-500 text-white px-4 py-2 rounded mt-4">
      {error}
    </div>
    {/if}
    </form>
    
  </main>