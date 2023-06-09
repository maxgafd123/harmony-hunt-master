<script>
  import ReviewForm from "../../../components/ReviewForm.svelte";
  import EditReviewForm from "../../../components/EditReviewForm.svelte";
  import AddList from "../../../components/AddList.svelte";
  import { authStore } from "../../../stores/authStore";
  import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
  import { db } from "../../../lib/firebase";
  import { goto } from "$app/navigation"
  export let data;

  let showReviewForm = false;
  let showEditReviewForm = false;
  let activeTab = "info";
  let showAddListModal = false;

  $: album = data.album;
  $: reviews = data.reviews;
  $: genre = data.genres;
  

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

  $: totalDuration = album.tracks.items.reduce(
    (sum, track) => sum + track.duration_ms,
    0
  );

  $: hasExplicitTracks = album.tracks.items.some((track) => track.explicit);

  $: spotifyUrl = album.external_urls.spotify;

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

  function formatGenres(genre) {
    return genre
      .map((genre) =>
        genre
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(", ");
  }

  async function toggleLikeReview(review) {
    const reviewDocRef = doc(db, "reviews", review.id);
    const reviewDocSnap = await getDoc(reviewDocRef);

    if (reviewDocSnap.exists()) {
      const currentLikes = reviewDocSnap.data().likes || {};
      const currentUserId = $authStore.currentUser.uid;

      if (currentLikes[currentUserId]) {
        delete currentLikes[currentUserId];
      } else {
        currentLikes[currentUserId] = true;
      }

      await updateDoc(reviewDocRef, { likes: currentLikes });

      // Find the review in the local reviews array and update its likes field
      const reviewIndex = reviews.findIndex(
        (r) => r.reviewId === review.reviewId
      );
      if (reviewIndex !== -1) {
        reviews[reviewIndex].likes = currentLikes;
      }

      // Force Svelte to update the state by reassigning the reviews array
      reviews = [...reviews];
    }
  }

  async function deleteReview(reviewId) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmDelete) {
      try {
        const reviewDocRef = doc(db, "reviews", reviewId);
        await deleteDoc(reviewDocRef);
        alert("Review deleted!");
        location.reload();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("An error occured. Please try again.");
      }
    }
  }
</script>

{#if showReviewForm}
  <ReviewForm
    albumId={album.id}
    albumName={album.name}
    albumImageUrl={album.images[1].url}
    artistName={album.artists[0].name}
    userId={$authStore.currentUser.uid}
    on:close={() => (showReviewForm = false)}
  />
{/if}
{#if showEditReviewForm}
  <EditReviewForm
    albumId={album.id}
    userId={$authStore.currentUser.uid}
    existingReview={userReview}
    documentId={userReview.id}
    on:close={() => (showEditReviewForm = false)}
  />
{/if}
<div class="relative">
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row items-center justify-center md:justify-start mb-8 text-center md:text-left">
      <div class="mb-8 md:mb-0 md:mr-8 flex flex-col items-center md:items-start">
        <div>
        <h1 class="text-4xl font-bold">{album.name}</h1>
        <h4 class="text-3xl font-bold">{album.artists[0].name}</h4>
        <img src={album.images[1].url} alt="Album cover" class="mt-4 mb-8" />
      </div>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <div class="flex items-center mb-4 space-x-6">
          <div>
            <p class="text-lg">Number of ratings: {numberOfRatings}</p>
          </div>
          <div class="border-r h-8" />
          <div>
            <p class="text-lg">Average rating: {averageRating}</p>
          </div>
          <div class="border-r h-8" />
          {#if $authStore.currentUser && userReview}
            <div>
              <p class="text-lg">Your rating: {userReview.rating}/5</p>
            </div>
          {/if}
        </div>
        {#if $authStore.currentUser}
          {#if userReview}
            <button
              type="button"
              class="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
              on:click={() => (showEditReviewForm = true)}
            >
              Edit Review
            </button>
          {:else}
            <button
              type="button"
              class="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
              on:click={() => (showReviewForm = true)}
            >
              Submit a Review
            </button>
          {/if}
        {:else}
          <a
            href="/login"
            class="bg-blue-600 text-white px-4 py-2 rounded inline-block w-full mb-4 text-center"
          >
            Login to Submit a Review
          </a>
        {/if}
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="bg-green-600 text-white px-4 py-2 rounded inline-block w-full text-center mb-4"
        >
          Listen on Spotify
        </a>
        {#if $authStore.currentUser}
          <button
            type="button"
            class="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
            on:click={() => (showAddListModal = true)}
          >
            Add to list
          </button>
        {/if}

        {#if showAddListModal}
          <AddList {album} on:close={() => (showAddListModal = false)} />
        {/if}
      </div>
    </div>
    <div class="mb-4">
      <button
        class={`${
          activeTab === "info" ? "bg-blue-600 text-white" : "bg-gray-200"
        } px-4 py-2 rounded-tl-lg rounded-tr-lg`}
        on:click={() => (activeTab = "info")}
      >
        Album Information
      </button>
      <button
        class={`${
          activeTab === "reviews" ? "bg-blue-600 text-white" : "bg-gray-200"
        } px-4 py-2 rounded-tl-lg rounded-tr-lg`}
        on:click={() => (activeTab = "reviews")}
      >
        Reviews
      </button>
    </div>
    {#if activeTab === "info"}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-200 p-4 rounded shadow">
          <h2 class="text-2xl font-semibold mb-4">Tracklist</h2>
          <ol class="list-decimal list-inside">
            {#each album.tracks.items as track}
              <li class="text-lg">{track.name}</li>
            {/each}
          </ol>
        </div>
        <div class="md:pl-8">
          <div class="bg-gray-200 rounded p-4 md:p-4">
            <h2 class="text-2xl font-semibold mb-4">Album Information</h2>
            <p class="text-lg mb-4">
              Release date:
              {new Date(album.release_date).toLocaleDateString("en", {
                dateStyle: "medium",
              })}
            </p>
            <p class="text-lg mb-4">Genres: {formatGenres(genre)}</p>
            <p class="text-lg mb-4">
              Duration: {Math.floor(totalDuration / 60000)} minutes
            </p>
            <p class="text-lg mb-4">
              Explicit Lyrics: {hasExplicitTracks ? "Yes" : "No"}
            </p>
            <h2 class="text-2xl font-semibold mb-4">Copyright Information</h2>
            {#each album.copyrights as copyright}
              <p class="text-sm mb-2">
                {getCopyrightSymbol(copyright.type)}{copyright.text}
              </p>
            {/each}
          </div>
        </div>
      </div>
    {:else if activeTab === "reviews"}
      <div class="bg-gray-200 p-4 rounded shadow">
        <h2 class="text-2xl font-semibold mb-4">Reviews</h2>
        {#if reviews.length > 0}
          <ul>
            {#each reviews as review}
              <li class="mb-6">
                <div class="flex items-center mb-2">
                  <p class="text-lg font-bold">{review.title}:</p>
                  <p class="text-lg ml-2">{review.rating}/5</p>
                </div>
                <p class="text-lg">{review.content}</p>
                <p class="text-sm text-gray-600">
                  Reviewed by: {review.username}
                </p>
                {#if $authStore.currentUser && review.userId === $authStore.currentUser.uid}
                  <button
                    class="bg-red-500 text-white px-4 py-2 rounded"
                    on:click={() => deleteReview(review.id)}
                  >
                    Delete
                  </button>
                {/if}
                <button
                  class="bg-blue-500 text-white px-4 py-2 rounded"
                  on:click={() => $authStore.currentUser ? toggleLikeReview(review) : goto('/login')}
                >
                  {#if $authStore.currentUser && Object.keys(review.likes).includes($authStore.currentUser.uid)}
                    Unlike
                  {:else}
                    Like
                  {/if}
                </button>
                <span class="ml-2 text-lg"
                  >{Object.keys(review.likes).length}
                  {Object.keys(review.likes).length === 1
                    ? "Like"
                    : "Likes"}</span
                >
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-lg">No reviews available for this album.</p>
        {/if}
      </div>
    {/if}
  </div>
</div>
