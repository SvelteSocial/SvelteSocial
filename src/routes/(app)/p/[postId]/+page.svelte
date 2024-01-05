<script lang="ts">
  import Post from '$lib/components/Post.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  export let data
  $: ({ post } = data)
</script>

<Post {post} />
