<script>
    import { db } from "../lib/firebase";
    import { createEventDispatcher } from "svelte";
    import { collection, doc, updateDoc } from "firebase/firestore";
  
    export let albumId = "";
    export let userId = "";
    export let existingReview;
    export let documentId;

    //test
    
    let review = {
      title: existingReview.title,
      content: existingReview.content,
      rating: existingReview.rating,
    };

    console.log(existingReview)
    const dispatch = createEventDispatcher();
  
    function close() {
      dispatch("close");
    }
  
    function setRating(newRating) {
      review.rating = newRating;
    }
  
    async function submitReview() {
      if (review.title.trim() === "" || review.content.trim() === "") {
        alert("Please enter a title and review content.");
        return;
      }
  
      try {
        const reviewDoc = doc(db, "reviews", documentId);
        await updateDoc(reviewDoc, {
          title: review.title,
          content: review.content,
          rating: review.rating,
          updatedAt: new Date(),
        });
  
        alert("Review updated!");
        review = {
          title: "",
          content: "",
          rating: 1,
        };
        location.reload()
      } catch (error) {
        console.error("Error updating review:", error);
        alert("An error occurred. Please try again.");
      }
    }
  </script>
  

<div
  class="fixed inset-0 z-50 flex items-center justify-center"
  style="background-color: rgba(0, 0, 0, 0.5);"
>
  <form
    class="bg-white w-full max-w-lg p-6 rounded shadow"
    on:submit|preventDefault={submitReview}
  >
    <h2 class="text-2xl font-bold mb-4">Edit Review</h2>
    <div class="mb-4">
      <label class="block mb-2">Title</label>
      <input
        type="text"
        class="border border-gray-300 w-full p-2 rounded"
        bind:value={review.title}
        required
      />
    </div>
    <div class="mb-4">
      <label class="block mb-2">Review</label>
      <textarea
        class="border border-gray-300 w-full p-2 rounded h-32"
        bind:value={review.content}
        required
      />
    </div>
    <div class="mb-4">
      <label class="block mb-2">Rating</label>
      <div>
        {#each [1, 2, 3, 4, 5] as star}
          <button
            type="button"
            class="text-yellow-400 text-2xl"
            on:click={() => setRating(star)}
          >
            {star <= review.rating ? "★" : "☆"}
          </button>
        {/each}
      </div>
    </div>
    <div class="flex justify-end">
      <button
        type="button"
        class="bg-gray-400 text-white px-4 py-2 rounded mr-2"
        on:click={close}
      >
        Cancel
      </button>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </div>
  </form>
</div>
