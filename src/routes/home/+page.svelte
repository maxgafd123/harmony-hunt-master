<script>
  export let data;

  $: newReleases = data.newReleases;
  $: popularReviews = data.popularReviews;
</script>

<div class="container mx-auto px-4">
  <h1 class="text-2xl font-bold mb-4">New Releases</h1>

  <div class="overflow-x-auto whitespace-nowrap">
    {#each newReleases as album}
      <a
        href="album/{album.id}"
        class="bg-white rounded-lg p-4 shadow inline-block w-64 mr-4 text-decoration-none"
      >
        <div class="bg-white rounded-lg p-4 shadow inline-block w-64 mr-4">
          <img
            src={album.images[1].url}
            alt={album.name}
            class="w-full h-48 object-cover rounded mb-2"
          />
          <h2 class="text-xl font-bold truncate">{album.name}</h2>
          <p class="text-gray-600">{album.artists[0].name}</p>
        </div>
      </a>
    {/each}
  </div>
  <h1 class="text-2xl font-bold mb-4">Popular Reviews</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each popularReviews as review}
      <div class="bg-white rounded-lg p-4 shadow">
        <h2 class="text-xl font-bold truncate">{review.albumName}</h2>
        <p class="text-gray-600">{review.artistName}</p>
        <div class="w-full">
          <img
            class="mx-auto mb-4 rounded-lg shadow-lg w-24 h-24 object-cover"
            src={review.albumImageUrl}
            alt={review.albumName}
          />
        </div>
        <p>{review.content}</p>
        <div class="mt-2">
          <span class="text-gray-500">Likes: {Object.keys(review.likes).length}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
