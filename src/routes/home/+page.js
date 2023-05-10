import { db } from "../../lib/firebase"
import {collection, where, query, orderBy, getDocs, limit} from "firebase/firestore"

async function getPopularReviewsThisWeek() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    const reviewsRef = collection(db, "reviews");
    const popularReviewsQuery = query(
      reviewsRef,
      where('createdAt', '>=', oneWeekAgo),
      orderBy('createdAt'),
    );
    const popularReviewsSnapshot = await getDocs(popularReviewsQuery);
  
    const popularReviews = popularReviewsSnapshot.docs.map(doc => doc.data());
  
    // Sort the reviews based on the number of likes
    popularReviews.sort((a, b) => Object.keys(b.likes || {}).length - Object.keys(a.likes || {}).length);
  
    return popularReviews;
  }
  


const LAST_FM_API_KEY = "a8fbe334ea1f19f411997351ef904a44";
export async function load ({fetch, page}) {
    const clientAccess = "M2IyMDk4ODkxZjY4NGZkMWI3ZmNmOTg2MDQ5YTU4MTg6NTgzMThjYTlhN2E3NDI2M2E2OTU1YjlhN2I3NTRhNzg=";
  
        // Get an access token from Spotify
    const authResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${clientAccess}`,
      },
      body: "grant_type=client_credentials",
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;
//Fetch new releases from Spotify
    const newReleaseRes = await fetch(`https://api.spotify.com/v1/browse/new-releases`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
          },
    }
    )

    if (!newReleaseRes.ok) {
        throw new Error("Failed to fetch new releases")
    }

    const newReleasesJSON = await newReleaseRes.json();
    console.log(newReleasesJSON);
    const popularReviews = await getPopularReviewsThisWeek();
    console.log(popularReviews)

    
   

    return {
        newReleases: newReleasesJSON.albums.items,
       popularReviews,
    }
}
