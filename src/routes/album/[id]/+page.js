import { db } from "../../../lib/firebase"
import {collection, query, where, getDocs} from "firebase/firestore"
export async function load ({fetch, params}) {
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
  const albumID = params.id;

  

 
//Fetch the album that the user clicked on from Spotify API
    const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumID}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
          },
    }
    )
    if (!albumRes.ok) {
        throw new Error("Failed to Load")
    }
   
    const albumJSON = await albumRes.json();
    console.log(albumJSON);

    const artistId = albumJSON.artists[0].id

    let artistGenres = [];

    if (artistId) {
      const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (artistRes.ok) {
        const artistJSON = await artistRes.json();
        artistGenres = artistJSON.genres;
      }
    }
//Fetch review data from Firebase on album

const reviewsCollection = collection(db, "reviews");
const q = query(reviewsCollection, where("albumId", "==", params.id));
const querySnapshot = await getDocs(q);

const reviews = [];
querySnapshot.forEach((doc) => {
  
  reviews.push({
    id: doc.id,
    ...doc.data()
  });
})

    return {
        album: albumJSON,
        reviews,
        title: albumJSON.name,
        genres: artistGenres
    }
}