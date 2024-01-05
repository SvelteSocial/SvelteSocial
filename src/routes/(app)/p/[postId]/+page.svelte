<script lang="ts">
  import Post from '$lib/components/Post.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  import { createPostQuery } from '$lib/queries.js'

  export let data
  $: ({ id } = data.post)

  $: createPostQuery({ postId: id }, { initialData: data.post })
</script>

<Post postId={id} />
