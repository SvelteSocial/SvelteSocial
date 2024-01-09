<script lang="ts">
  import type { EventHandler } from 'svelte/elements'
  import { Textarea } from '$lib/components/ui/textarea'
  import { Button } from '$lib/components/ui/button'
  import { Smile } from 'lucide-svelte'

  export let postId: string

  const submitHandler = (({ currentTarget }) => {
    const data = new FormData(currentTarget)
    console.log(data.get('t'))
  }) satisfies EventHandler<SubmitEvent, HTMLFormElement>
</script>

<form on:submit|preventDefault={submitHandler} class="flex items-center gap-2">
  <Button size="icon" variant="ghost"><Smile color="white" /></Button>
  <!-- <div class="h-14 flex-1"></div> -->
  <Textarea
    name="content"
    id="textarea"
    class="scroll h-[15px] min-h-[15px] flex-1 resize-none !border-none !outline-none !ring-0"
    placeholder="Add a comment..."
  />
  <Button size="icon" variant="ghost" type="submit">Post</Button>
</form>

<!-- <style>
  :global(#textarea ::-webkit-scrollbar) {
    display: none;
  }
</style> -->
