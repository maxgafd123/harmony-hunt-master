<script>
    export let list;
  </script>
  
  <div class="bg-white shadow rounded-lg p-4">
    <h2 class="text-xl font-bold">{list.name}</h2>
    <p class="text-gray-600">{list.description}</p>
    <ul>
      {#each list.albums as album}
      <li class="flex items-center space-x-2">
        <img src={album.cover} alt={album.name} class="w-16 h-16" />
        <div>
          <p>{album.name}</p>
          <p class="text-gray-600">{album.artist}</p>
        </div>
      </li>
      {/each}
    </ul>
  </div>