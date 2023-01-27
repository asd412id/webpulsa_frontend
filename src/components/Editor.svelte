<script>
  import { quill } from "svelte-quill";
  export let content = "";
  export let editor;

  const options = {
    modules: {
      toolbar: [
        [{ header: 1 }, { header: 2 }, "blockquote", "link"],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "ordered" }],
        [{ align: [] }],
        ["clean"],
      ],
    },
    placeholder: "Isi postingan...",
    theme: "snow",
  };
</script>

<svelte:head>
  <link href="//cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
</svelte:head>
<div
  bind:this={editor}
  class="editor"
  use:quill={options}
  on:text-change={(e) => (content = e.detail)}
/>
