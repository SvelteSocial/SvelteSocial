<script lang="ts">
  import Post from '$lib/components/Post.svelte'
  import { createPostQuery } from '$lib/queries.js'

  export let data
  $: postQuery = createPostQuery<true>({ postId: data.postId })
</script>

<Post postId={$postQuery.data.id} />
