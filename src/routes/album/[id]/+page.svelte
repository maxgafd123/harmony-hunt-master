<script>
import ReviewForm from '../../../components/ReviewForm.svelte';
  export let data;

  let showReviewForm = false;

  $: album = data.album;
  $: reviews = data.reviews

  $: averageRating = reviews.length > 0
  ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
  : 'N/A';

$: numberOfRatings = reviews.length;

  function getCopyrightSymbol(string) {
    switch (string) {
      case "C":
        return "©";
      case "R":
        return "®";
      case "P":
        return "℗";
    }
  }
</script>

{#if showReviewForm}
  <ReviewForm albumId={album.id} on:close={() => (showReviewForm = false)} />
{/if}
<div class="relative">
<div class="container mx-auto px-4 py-8">
    <div class="flex items-center mb-8">
      <div>
        <h1 class="text-4xl font-bold">{album.name}</h1>
        <img src={album.images[1].url} alt="Album cover" class="mt-4 mb-8">
      </div>
      <p class="text-lg mb-2">Number of ratings: {numberOfRatings}</p>
      <p class="text-lg mb-4">Average rating: {averageRating}</p>
      <button
        type="button"
        class="bg-blue-600 text-white px-4 py-2 rounded"
        on:click={() => (showReviewForm = true)}
      >
        Submit a Review
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-4 rounded shadow">
        <h2 class="text-2xl font-semibold mb-4">Tracklist</h2>
        <ol class="list-decimal list-inside">
          {#each album.tracks.items as track}
            <li class="text-lg">{track.name}</li>
          {/each}
        </ol>
      </div>
      <div>
        <p class="text-lg mb-4">
          {new Date(album.release_date).toLocaleDateString('en', {dateStyle: 'medium'})}
        </p>
        {#each album.copyrights as copyright}
          <p class="text-sm mb-2">
            {getCopyrightSymbol(copyright.type)}{copyright.text}
          </p>
        {/each}
      </div>
    </div>
  </div>
</div>
