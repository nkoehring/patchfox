<script>
  const MessageRenderer = require("../../core/components/MessageRenderer.svelte")
  const Spinner = require("../../core/components/Spinner.svelte")

  export let feed

  let messagePromise
  let lastMsgs = []

  messagePromise = ssb
    .query(
      {
        value: {
          author: feed
        }
      },
      10
    )
    .then(msgs => {
      lastMsgs = msgs

      window.scrollTo(0, 0)
    })
  // todo: refactor navigation here. This is a hack it shouldn't hide and show values which are
  // not reloading.
  const loadMoreMessages = lt => {
    messagePromise = ssb
      .query({
        value: {
          author: feed,
          timestamp: { $lt: lt }
        }
      })
      .then(msgs => {
        lastMsgs = msgs
        window.scrollTo(0, 0)
      })
  }
</script>

<div>
  {#await messagePromise}
    <Spinner />
  {:then data}
    {#each lastMsgs as msg (msg.key)}
      <MessageRenderer {msg} />
    {:else}
      <p>You don't have messages from this user in your database.</p>
    {/each}
    {#if lastMsgs.length > 0}
      <ul class="pagination">

        <li class="page-item page-next">
          <a
            href="#/public"
            on:click|stopPropagation|preventDefault={() => {
              loadMoreMessages(lastMsgs[lastMsgs.length - 1].value.timestamp);
            }}>
            <div class="page-item-subtitle">Load More</div>
          </a>
        </li>
      </ul>
    {/if}
  {:catch n}
    <p>Error fetching messages: {n.message}.</p>
    <p>
      Try
      <a on:click={() => location.reload()} href={location}>
        reloading the page.
      </a>
    </p>

  {/await}

</div>
