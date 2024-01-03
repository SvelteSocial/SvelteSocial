<script lang="ts">
  import { signOut } from '@auth/sveltekit/client'
  import { Button } from './ui/button'
  import { LogOut } from 'lucide-svelte'
</script>

<aside class="p-4">
  <nav class="contents">
    <ul class="flex h-full flex-col justify-between">
      <li>
        <Button variant="outline" size="icon" href="/explore">H</Button>
      </li>
      <li>
        <Button variant="outline" size="icon" on:click={() => signOut()}>
          <LogOut size="17" />
        </Button>
      </li>
    </ul>
  </nav>
</aside>
