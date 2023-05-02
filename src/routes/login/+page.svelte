<script>
    import {authHandlers, authStore} from '../../stores/authStore';
    import { onDestroy } from 'svelte';
  
    let email = '';
    let password = '';
    let error;

    authStore.subscribe((state) => {
        error = state.error;
    })
  
    async function handleSubmit(e) {
      e.preventDefault();
      try {
        await authHandlers.login(email, password);
        window.location.href='/privatedashboard'
      } catch (error) {
        throw error;
      }
    }

    function clearError() {
      authStore.update((state) => ({ ...state, error: null }));
    }

    onDestroy (() => {
      authStore.update(state => ({ ...state, error: null}));
    })
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 mb-8">Login to your account</h2>
      <div class="mb-6">
        <label for="email" class="block text-gray-700 font-bold mb-2">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          bind:value={email}
          on:input={clearError}
          placeholder="Email address"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="mb-6">
        <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          bind:value={password}
          on:input={clearError}
          placeholder="Password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          on:click={handleSubmit}
        >
          Login
        </button>
        <div class="flex flex-col ml-6">
          <span class="text-gray-700 text-sm mb-2">Don't have an account?</span>
          <a class="text-blue-500 hover:text-blue-800 text-sm font-bold" href="/signup">
            Sign Up
          </a>
        </div>
      </div>
      {#if error}
      <div class="bg-red-500 text-white px-4 py-2 rounded mt-4">
        {error}
      </div>
      {/if}
    </form>
  </div>