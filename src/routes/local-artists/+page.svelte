<script>
    export let data

    $: events = data.events

    
</script>
<h1>This is the local artists page</h1>


{#if events && events.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each events as event}
      <a
        class="bg-white rounded-md shadow-md p-4 flex flex-col space-y-4"
        href="{event.url}"
        target="_blank"
      >
        <img
          class="rounded-md object-cover h-48 w-full"
          src="{event.images[0].url}"
          alt="{event.name}"
        />
        <h2 class="text-xl font-bold">{event.name}</h2>
        <p class="text-sm">
          Start date: {event.dates.start.localDate}
          {#if event.dates.start.localTime}
            <br />Start time: {event.dates.start.localTime}
          {/if}
        </p>
        {#if event._embedded && event._embedded.venues}
          <p class="text-sm">Venue: {event._embedded.venues[0].name}</p>
        {/if}
      </a>
    {/each}
  </div>
{:else}
  <p class="text-lg">No events found.</p>
{/if}