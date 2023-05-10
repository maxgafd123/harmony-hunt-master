<script>
  import { updateDoc, doc, deleteDoc } from "firebase/firestore";
  import { db } from "../lib/firebase"
    export let list;

    let editing = false;
    let updatedName = list.name;
    let updatedDescription = list.description;

    function toggleEditing() {
      editing = !editing;
    }

    async function updateList() {
      const listRef = doc(db, "lists", list.id);
      await updateDoc(listRef, {
        name: updatedName,
        description: updatedDescription,
      });

      list.name = updatedName;
      list.description = updatedDescription;
      editing = false;
    }

    async function deleteList() {
      if (confirm("Are you sure you want to delete this list?")) {
        const listRef = doc(db, "lists", list.id);
        await deleteDoc(listRef);
        location.reload();
      }
    }

    async function removeAlbum(albumId) {
      if (confirm("Are you sure you want to remove this album from the list?")) {
        const updatedAlbums = list.albums.filter((album) => album.id !== albumId);
        await updateDoc(doc(db, "lists", list.id), { albums: updatedAlbums});
        list.albums = updatedAlbums;
      }
    }
  </script>
  
  <div class="bg-white shadow rounded-lg p-4">
    <div class="flex justify-between items-start mb-2">
      <div>
        <h2 class="text-xl font-bold">{list.name}</h2>
        <p class="text-gray-600">{list.description}</p>
      </div>
      <div class="space-y-2">
        {#if editing}
        <div>
          <input
            type="text"
            class="border border-gray-300 rounded px-4 py-2 mb-2"
            bind:value={updatedName}
          />
          <textarea
            class="border border-gray-300 rounded px-4 py-2 w-full"
            bind:value={updatedDescription}
          />
        </div>
        <button
        class="bg-green-600 text-white px-4 py-2 rounded"
        on:click={() => updateList()}
      >
        Save
      </button>
      {:else}
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded"
          on:click={() => toggleEditing()}
        >
          Edit List
        </button>
        {/if}
       
        <button
          class="bg-red-600 text-white px-4 py-2 rounded"
          on:click={() => deleteList()}
        >
          Delete List
        </button>
      </div>
    </div>
    <ul>
      {#each list.albums as album}
      <li class="flex items-center justify-between space-x-2">
        <a href="album/{album.id}" class="flex items-center space-x-2">
          <img src={album.cover} alt={album.name} class="w-16 h-16" />
          <div>
            <p>{album.name}</p>
            <p class="text-gray-600">{album.artist}</p>
          </div>
        </a>
        <button
          class="text-red-600 font-bold text-xl"
          on:click={() => removeAlbum(album.id)}
        >
          ×
        </button>
      </li>
      {/each}
    </ul>
  </div>