<script lang="ts">
  import { signOut } from '@auth/sveltekit/client'
  import { Button } from './ui/button'
  import { Home, LogOut, Search } from 'lucide-svelte'
  import Upload from './Upload.svelte'
</script>

<aside class="p-4">
  <nav class="contents">
    <ul class="flex h-full flex-col justify-between">
      <div>
        <li><Button variant="outline" size="sm" href="/explore">SvelteSocial</Button></li>
      </div>
      <div>
        <li><Button variant="ghost" size="icon" href="/explore"><Home size="17" /></Button></li>
        <li><Button variant="ghost" size="icon" href="/settings"><Search size="17" /></Button></li>
        <li><Button variant="ghost" size="icon" href="/settings"><Search size="17" /></Button></li>
      </div>
      <li>
        <Button variant="ghost" size="icon" on:click={() => signOut()}>
          <LogOut size="17" />
        </Button>
      </li>
      <li>
        <Upload />
      </li>
    </ul>
  </nav>
</aside>
