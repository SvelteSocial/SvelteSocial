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

  // a reference to the component, used to call FilePond methods
  let pond

  // pond.getFiles() will return the active files

  // the name to use for the internal file input
  let name = 'filepond'

  // handle filepond events
  function handleInit() {
    console.log('FilePond has initialised')
  }

  function handleAddFile(err, fileItem) {
    console.log('A file has been added', fileItem)
  }
</script>

<Popover.Root>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content>
    <FilePond
      bind:this={pond}
      {name}
      server="/api"
      allowMultiple={true}
      oninit={handleInit}
      onaddfile={handleAddFile}
    />
  </Popover.Content>
</Popover.Root>
