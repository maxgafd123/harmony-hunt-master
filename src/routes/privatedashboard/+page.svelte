<script>
    import { authStore } from "../../stores/authStore"
    import { collection, query, where, orderBy, limit, onSnapshot, doc, getDocs, deleteDoc, updateDoc} from "firebase/firestore"
    import { db } from "../../lib/firebase"

    let user;
    let recentReviews = [];
    let unsubscribe;
    let username;
    let newUsername = "";
    let isEditing = false;

authStore.subscribe(async ($authStore) => {
    user = $authStore.currentUser;
    if (unsubscribe) {
        unsubscribe();
    }

    if (user) {

       const userDocsQuery = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
       );

       const querySnapshot = await getDocs(userDocsQuery);
       querySnapshot.forEach((doc) => {
        username = doc.data().username
       })
        const userReviewsQuery = query(
            collection(db, "reviews"),
            where("userId", "==", $authStore.currentUser.uid),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        unsubscribe = onSnapshot(userReviewsQuery, (querySnapshot) => {
            recentReviews = [];
            querySnapshot.forEach((doc) => {
                recentReviews.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        });
    }
});

async function saveUsername() {
  const userDocsQuery = query(
    collection(db, "users"),
    where("uid", "==", user.uid)
  );

  const querySnapshot = await getDocs(userDocsQuery);
  querySnapshot.forEach(async (docRef) => {
    await updateDoc(doc(db, "users", docRef.id), {
      username: newUsername,
    });
    username = newUsername;
    newUsername = "";
    isEditing = false;
  });
}

async function deleteReview(reviewId) {
    const confirmDelete = confirm("Are you sure you want to delete this review?");
    if (confirmDelete) {
      try {
        const reviewDocRef = doc(db, "reviews", reviewId);
        await deleteDoc(reviewDocRef);
        alert("Review deleted!");
        location.reload();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("An error occured. Please try again.")
      }
    }

  }


</script>

<main class="container mx-auto mt-10 px-4">
  {#if user}
      <h1 class="text-3xl font-bold mb-4">Welcome, {username}!</h1>
      {#if isEditing}
  <div class="mb-4">
    <label for="newUsername" class="block text-sm mb-2">New username:</label>
    <input
      type="text"
      id="newUsername"
      bind:value={newUsername}
      class="border border-gray-300 px-3 py-2 rounded"
    />
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      on:click={saveUsername}
    >
      Save
    </button>
    <button
      class="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2"
      on:click={() => (isEditing = false)}
    >
      Cancel
    </button>
  </div>
{:else}
  <button
    class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    on:click={() => (isEditing = true)}
  >
    Change username
  </button>
{/if}
      <section>
          <h2 class="text-2xl font-semibold mb-4">Recent Reviews</h2>
          {#if recentReviews.length > 0}
              <ul>
                  {#each recentReviews as review (review.id)}
                      <li class="mb-6 bg-gray-100 p-4 rounded shadow">
                          <div class="flex items-start">
                              <img src="{review.albumImageUrl}" alt="{review.albumName} album cover" class="w-20 h-20 object-cover rounded mr-4"/>
                              <a href="/album/{review.albumId}" class="text-blue-500 hover:text-blue-800 text-xl font-semibold">
                                  {review.albumName}
                              </a>
                          </div>
                          <h3 class="text-lg font-bold mt-2">{review.title}</h3>
                          <div class="flex mt-1">
                              {#each [1, 2, 3, 4, 5] as star}
                                  <span class="text-yellow-400 text-lg">
                                      {star <= review.rating ? '★' : '☆'}
                                  </span>
                              {/each}
                          </div>
                          <p class="mt-2">{review.content}</p>
                          <button class="bg-red-500 text-white px-4 py-2 rounded" on:click={() => deleteReview(review.id)}>
                            Delete
                          </button>
                      </li>
                  {/each}
              </ul>
          {:else}
              <p>You have not written any reviews yet.</p>
          {/if}
      </section>
  {:else}
      <p>Loading...</p>
  {/if}
</main>
