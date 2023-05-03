<script>
    export let data

    $: albums = data.searchResults.albums?.items
    
    $: console.log(data)
</script>

<div class="flex flex-col items-center gap-4">
    {#each albums as album}
    <a href={`/album/${album.id}`} class="block w-full md:w-1/2 lg:w-1/2 xl:w-1/3 bg-white rounded-lg shadow p-4 hover:bg-gray-100 transition-colors duration-200">
      <div class="flex">
        <div>
          <img src={album.images[1].url} alt="Album cover" class="mx-auto mb-4 rounded-lg shadow-lg w-24 h-24 object-cover" />
        </div>
        <div class="ml-4">
          <h2 class="text-lg font-semibold mb-1">{album.name}</h2>
          <p class="text-gray-600 mb-1">{album.artists[0].name}</p>
          {#if album.listeners !== null && album.playcount !== null && album.listeners && album.playcount}
          <p class="text-gray-600">Listeners: {album.listeners.toLocaleString()} Playcount: {album.playcount.toLocaleString()}</p>
        {:else}
          <p class="text-gray-600">Listeners: N/A, Playcount: N/A</p>
        {/if}
        </div>
      </div>
    </a>
  {/each}
  </div>

