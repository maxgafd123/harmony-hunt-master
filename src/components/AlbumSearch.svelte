<script>
  /** @type {import('./$types').PageData} */
  let searchInput = "";
  let searchResults = [];

  async function searchAlbums() {}
</script>

<form action="/search" method="GET" role="search">
  <input
    name="q"
    type="search"
    bind:value={searchInput}
    placeholder="Search"
    class="bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full px-4 py-2 mr-2"
  />
  <button
    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
    on:click={searchAlbums}>Search</button
  >
</form>
