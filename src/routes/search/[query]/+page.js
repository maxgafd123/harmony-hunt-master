const LAST_FM_API_KEY = "a8fbe334ea1f19f411997351ef904a44";

async function fetchAlbumRatingFromLastFm(fetch, artist, album) {
  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LAST_FM_API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&format=json`
  );

  const albumData = await response.json();
  if (albumData.album && albumData.album.playcount && albumData.album.listeners) {
    const playcount = parseInt(albumData.album.playcount);
    const listeners = parseInt(albumData.album.listeners);
    return { listeners, playcount };
  }

  return null;
}

function filterDuplicates(albums) {
  const seenIds = new Set();
  const filteredAlbums = albums.filter((album) => {
    if (seenIds.has(album.id)) {
      return false;
    }
    seenIds.add(album.id);
    return true;
  });
  console.log("Filtered Albums:", filteredAlbums)
  return filteredAlbums;
  
}

export async function load({ fetch, params, route }) {
  const clientAccess = "M2IyMDk4ODkxZjY4NGZkMWI3ZmNmOTg2MDQ5YTU4MTg6NTgzMThjYTlhN2E3NDI2M2E2OTU1YjlhN2I3NTRhNzg=";
  const query = params?.query;
  console.log("Query", query)
  const searchParams = new URLSearchParams({
    q: query,
    type: "album",
    limit: "10",
    market: "US",
  }).toString();

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
  console.log(accessToken);

  const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const searchResponseJSON = await searchResponse.json();

  // Fetch listeners and playcount for each album from Last.fm
  const albumsWithListenersAndPlaycount = await Promise.all(
    searchResponseJSON.albums.items.map(async (album) => {
      const artist = album.artists[0].name;
      const listenersAndPlaycount = await fetchAlbumRatingFromLastFm(fetch, artist, album.name);
      return { ...album, ...listenersAndPlaycount };
    })
  );

  const albumFiltered = filterDuplicates(albumsWithListenersAndPlaycount);

  return {
    title: `Search results for: ${query}`,
    searchResults: {
      ...searchResponseJSON,
      albums: {
        ...searchResponseJSON.albums,
        items: albumFiltered,
      },
    },
  };
}