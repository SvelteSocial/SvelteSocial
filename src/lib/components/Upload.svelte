<script lang="ts">
  import './Upload.postcss'
  import * as Popover from '$lib/components/ui/popover'
  // @ts-expect-error - no types
  import FilePond, { registerPlugin, supported } from 'svelte-filepond'

  // Import the Image EXIF Orientation and Image Preview plugins
  // Note: These need to be installed separately
  // `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

  // Register the plugins
  registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
</script>

<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>
    <FilePond name="filepond" allowMultiple={true} server="/api" />
  </Popover.Content>
</Popover.Root>
