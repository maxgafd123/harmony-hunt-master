<script>
  import { onMount } from "svelte";
  import { authStore } from "../stores/authStore";
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
  } from "firebase/firestore";
  import { db } from "../lib/firebase";
  import {createEventDispatcher} from "svelte";

  export let album;

  let lists = [];
  let newListName = "";
  let newListDescription = "";

  onMount(async () => {
    const listQuery = query(
      collection(db, "lists"),
      where("userId", "==", $authStore.currentUser.uid)
    );
    const querySnapshot = await getDocs(listQuery);
    lists = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  });
  const dispatch = createEventDispatcher();
  function close() {
      dispatch("close");
    }

  async function addAlbumToList(list) {
    const albumData = {
      id: album.id,
      name: album.name,
      artist: album.artists[0].name,
      cover: album.images[1].url,
    };

    if (list.albums && list.albums.some(a => a.id === albumData.id)) {
      alert ("This album is already in the list!");
      return;
    }


    if (list.albums) {
      list.albums.push(albumData);
    } else {
      list.albums = [albumData];
    }

    await updateDoc(doc(db, "lists", list.id), { albums: list.albums });
    alert("List Updated!");
    close();
  }

  async function createNewList() {
    if (!newListName.trim()) {
      alert("List name cannot be empty.");
      return;
    }

    const newList = {
      name: newListName,
      description: newListDescription,
      userId: $authStore.currentUser.uid,
      albums: [
        {
          id: album.id,
          name: album.name,
          artist: album.artists[0].name,
          cover: album.images[1].url,
        },
      ],
    };

    await addDoc(collection(db, "lists"), newList);
    alert("New List Created!");
    close();
  }
</script>

<div class="fixed inset-0 flex items-center justify-center z-50">
  <div class="bg-white w-full max-w-xl p-8 mx-4 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4">Add to List</h2>
    {#if lists.length > 0}
      <h3 class="text-xl font-semibold mb-2">Choose a list:</h3>
      <ul>
        {#each lists as list}
          <li class="mb-2">
            <button
              class="bg-blue-600 text-white px-4 py-2 rounded"
              on:click={() => addAlbumToList(list)}
            >
              {list.name}
            </button>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="mb-4">You have no lists. Create a new one below.</p>
    {/if}
    <h3 class="text-xl font-semibold mb-2 mt-4">Create a new list:</h3>
    <input
      type="text"
      class="border border-gray-300 rounded px-4 py-2 w-full mb-2"
      placeholder="List name"
      bind:value={newListName}
    />
    <textarea
      class="border border-gray-300 rounded px-4 py-2 w-full mb-4"
      placeholder="List description (optional)"
      bind:value={newListDescription}
    />
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
      on:click={() => createNewList()}
    >
      Create List and Add Album
    </button>
    <button
      class="bg-gray-400 text-white px-4 py-2 rounded w-full"
      on:click={() => close()}
    >
      Cancel
    </button>
  </div>
</div>
