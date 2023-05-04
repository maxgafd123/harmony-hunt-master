const TICKETMASTER_API_KEY = "3fR9XZ2VQJVGcMXJEZQGlC6MrXkdKZuG";

async function getUserCity() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
        );
        const data = await response.json();
        resolve(data.address.city);
      } catch (error) {
        reject(error);
      }
    }, reject);
  });
}


async function fetchEventsByLocation(fetch, location) {
  const searchParams = new URLSearchParams({
    apikey: TICKETMASTER_API_KEY,
    city: location,
    classificationName: "Music",
    size: 12,
  }).toString();

  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${searchParams}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.statusText}`);
  }

  const eventData = await response.json();
  console.log(eventData);
  return eventData._embedded ? eventData._embedded.events : [];
}

export async function load({ fetch }) {
 let location;
 try {
  location = await getUserCity()
 } catch (error) {
  console.error("Failed to get user location", error)
 }
  const events = await fetchEventsByLocation(fetch, location);

  return {
    title: `Events in ${location}`,
    events,
  };
}