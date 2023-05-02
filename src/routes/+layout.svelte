<script>
    import "../app.css";
    import {onMount} from 'svelte'
    import {auth} from '../lib/firebase'
    import {authStore} from '../stores/authStore'
    import { slide } from "svelte/transition"
    import AlbumSearch from "../components/AlbumSearch.svelte";

    onMount(() => {
        let unsubscribe = auth.onAuthStateChanged((user) => {
            console.log(user)
            authStore.update((curr) => {
                return {...curr, isLoading: false, currentUser: user};
            })
        })

        return unsubscribe;
    })

    function handleLogout() {
      auth.signOut()
        .then(() => {
          window.location.href = '/';
        })
        .catch((err) => {
          console.error(err);
        })
    }

    
    let mobileMenu = false;

    
</script>

<!--Navigation bar, reponsive for mobile with mobileMenu-->

<nav class="bg-gray-800 py-4">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
    <div class="flex sm:items-center">
      <a href="/home" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
      <a href="/music" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Music</a>
      <a href="/lists" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">List</a>
      <a href="/local-artists" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Local Artists</a>
    </div>
    <div class="flex sm:items-center mt-4 sm:mt-0">
      <AlbumSearch />
      <div class="flex sm:hidden ml-4">
        <button class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" on:click={() => mobileMenu = !mobileMenu}>Menu</button>
      </div>
      {#if $authStore.currentUser}
      <div class="hidden sm:flex sm:items-center ml-4">
        <button class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" on:click={handleLogout}>Log Out</button>
        <a href="/privatedashboard" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 ml-2 rounded-md text-sm font-medium">My Account</a>
    </div>
      {:else}

      <div class="hidden sm:flex sm:items-center ml-4" transition:slide="{{ duration: 300 }}" class:hidden={!mobileMenu}>
        <a href="/signup" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign Up</a>
        <a href="/login" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 ml-2 rounded-md text-sm font-medium">Log In</a>
      </div>
      {/if}
    </div>
  </div>
</nav>

{#if !$authStore.currentUser && !import.meta.env.SSR && window.location.pathname === '/privatedashboard'}
    <p>You must be logged in to access the private dashboard</p>
{/if}

<slot />