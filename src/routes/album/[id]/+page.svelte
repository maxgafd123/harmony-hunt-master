<script>
  import ReviewForm from "../../../components/ReviewForm.svelte";
  import EditReviewForm from "../../../components/EditReviewForm.svelte";
  import { authStore } from "../../../stores/authStore";
  export let data;

  let showReviewForm = false;
  let showEditReviewForm = false;

  $: album = data.album;
  $: reviews = data.reviews;

  $: averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "N/A";

  $: numberOfRatings = reviews.length;

  $: userReview = $authStore.currentUser
    ? reviews.find((review) => review.userId === $authStore.currentUser.uid)
    : null;

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
  <ReviewForm
    albumId={album.id}
    userId={$authStore.currentUser.uid}
    on:close={() => (showReviewForm = false)}
  />
{/if}
{#if showEditReviewForm}
  <EditReviewForm
    albumId={album.id}
    userId={$authStore.currentUser.uid}
    existingReview={userReview}
    on:close={() => (showEditReviewForm = false)}
  />
{/if}
<div class="relative">
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-start justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold">{album.name}</h1>
        <img src={album.images[1].url} alt="Album cover" class="mt-4 mb-8" />
      </div>
      <div class="flex flex-col justify-between">
        <div class="flex items-center mb-4 space-x-6">
          <div>
            <p class="text-lg">Number of ratings: {numberOfRatings}</p>
          </div>
          <div class="border-r h-8"></div>
          <div>
            <p class="text-lg">Average rating: {averageRating}</p>
          </div>
          <div class="border-r h-8"></div>
          {#if $authStore.currentUser && userReview}
            <div>
              <p class="text-lg">Your rating: {userReview.rating}/5</p>
            </div>
          {/if}
        </div>
        {#if $authStore.currentUser}
          {#if userReview}
            <button type="button" class="bg-blue-600 text-white px-4 py-2 rounded w-full" on:click={() => (showEditReviewForm = true)}>
              Edit Review
            </button>
          {:else}
            <button
              type="button"
              class="bg-blue-600 text-white px-4 py-2 rounded w-full"
              on:click={() => (showReviewForm = true)}
            >
              Submit a Review
            </button>
          {/if}
        {:else}
          <a
            href="/login"
            class="bg-blue-600 text-white px-4 py-2 rounded inline-block w-full"
          >
            Login to Submit a Review
          </a>
        {/if}
      </div>
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
          {new Date(album.release_date).toLocaleDateString("en", {
            dateStyle: "medium",
          })}
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
