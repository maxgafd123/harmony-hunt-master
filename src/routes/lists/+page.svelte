<script>
    import { onMount } from "svelte";
    import { authStore } from "../../stores/authStore";
    import { db } from "../../lib/firebase";
    import {collection, where, query, getDocs} from "@firebase/firestore"
    import List from "../../components/List.svelte";
  
    let userLists = [];
  
    async function fetchUserLists() {
      const uid = $authStore.currentUser.uid;
      const listsRef = collection(db, "lists");
      const q = query(listsRef, where("userId", "==", uid))
      const snapshot = await getDocs(q);
      userLists = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  
    onMount(() => {
      if ($authStore.currentUser) {
        fetchUserLists();
      }
    });
  </script>
  
  
  
  {#if $authStore.currentUser}
    {#if userLists.length === 0}
    <p>You don't have any lists yet.</p>
    {:else}
    <div class="mx-auto px-4 max-2-4xl">
    <h1 class="text-2xl font-bold mb-4">Your Lists</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each userLists as list}
      <List {list} />
      {/each}
    </div>
  </div>
    {/if}
  {:else}
  <p>Please log in to view your lists.</p>
  {/if}