<script>
    import "../app.css";
    import {onMount} from 'svelte'
    import {auth} from '../lib/firebase'
    import {authStore} from '../stores/authStore'
    import { slide } from "svelte/transition"
    import AlbumSearch from "../components/AlbumSearch.svelte";
    import LoadingIcon from "../components/LoadingIcon.svelte";
    import { navigating } from "$app/stores";
    let mobileMenu = false;
    let loading = false;

    let navigatingUnsubscribe;

    export async function load({ session }) {
    if (auth.currentUser) {
      return { props: { user: auth.currentUser } };
    }
  }
  onMount(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      authStore.update((curr) => {
        return { ...curr, isLoading: false, currentUser: user };
      });
    });

    navigatingUnsubscribe = navigating.subscribe((nav) => {
      if (nav === null) {
        loading = false;
      } else {
        loading = true;
      }
    });

    return () => {
      unsubscribe();
      navigatingUnsubscribe();
    };
  });

    function handleLogout() {
      auth.signOut()
        .then(() => {
          window.location.href = '/';
        })
        .catch((err) => {
          console.error(err);
        })
    }
    

    
   
    
</script>

<!--Navigation bar, reponsive for mobile with mobileMenu-->
<div class="flex flex-col min-h-screen">
<nav class="bg-gray-800 py-4">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
    <div class="flex sm:items-center">
      <a href="/home" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
      <a href="/lists" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Lists</a>
      <a href="/local-artists" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Local Artists</a>
    </div>
    <div class="flex sm:items-center mt-4 sm:mt-0">
      <div class="sm:mr-4">
        <AlbumSearch />
      </div>
      <div class="flex sm:hidden ml-4">
        <button class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" on:click={() => mobileMenu = !mobileMenu}>Menu</button>
      </div>
      {#if $authStore.currentUser}
      <div class="hidden sm:flex sm:items-center ml-4">
        <button class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" on:click={handleLogout}>Log Out</button>
        <a href="/privatedashboard" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 ml-2 rounded-md text-sm font-medium">My Account</a>
      </div>
      <div class="sm:hidden flex flex-col ml-4" transition:slide="{{ duration: 300 }}" class:hidden={!mobileMenu}>
        <button class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" on:click={handleLogout}>Log Out</button>
        <a href="/privatedashboard" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 ml-2 rounded-md text-sm font-medium">My Account</a>
      </div>
      {:else}
      <div class="sm:hidden flex flex-col ml-4" transition:slide="{{ duration: 300 }}" class:hidden={!mobileMenu}>
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

<main class="flex-grow">
  {#if loading}
  <div class="fixed inset-0 flex items-center justify-center">
    <LoadingIcon size="w-8" color="text-blue-500" />
  </div>
{/if}
<slot />
</main>


<footer class="bg-gray-800 text-white text-center p-4">
  <p>Powered by:</p>
  <div class="flex justify-center space-x-4">
    <a href="https://www.ticketmaster.com/" target="_blank" rel="noopener noreferrer">
      <img class="h-12 w-auto" src="/t_logo.png" alt="Powered by Ticketmaster" />
    </a>
    <a href="https://www.spotify.com/" target="_blank" rel="noopener noreferrer">
      <img class="h-12 w-auto" src="/Spotify.png" alt="Powered by Spotify" />
    </a>
    <a href="https://www.last.fm/" target="_blank" rel="noopener noreferrer">
      <img class="h-12 w-auto" src="/lastfm.png" alt="Powered by Last.fm" />
    </a>
  </div>
  <p>
    This product uses the Ticketmaster, Spotify and Last.fm APIs but is not
    endorsed, certified, or otherwise approved by Ticketmaster, Spotify or Last.fm.
  </p>
</footer>
</div>