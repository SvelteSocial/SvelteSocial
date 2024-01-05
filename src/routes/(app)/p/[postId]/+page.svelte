<script lang="ts">
  import Post from '$lib/components/Post.svelte'
  import { createPostQuery } from '$lib/queries.js'

  export let data
  $: ({ id, author } = data.post)

  $: createPostQuery({ postId: id }, { initialData: data.post })

  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
  $: formattedDate = formatter.format(new Date(data.post.createdAt))
  // format should be Jan 5, 2023 at 8:30 PM
</script>

<svelte:head>
  <title>SvelteSocial post by {author.name} | {formattedDate}</title>
  <meta name="description" content="{data.post.caption} - {author.username}" />
</svelte:head>
<Post postId={id} />
