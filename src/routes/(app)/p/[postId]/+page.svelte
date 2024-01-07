<script lang="ts">
  import Post from '$lib/components/Post.svelte'

  export let data
</script>

<Post postId={data.postId} />
