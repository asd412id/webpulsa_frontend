<script>
  // @ts-nocheck

  import axios from "axios";
  import dateFormat from "dateformat";
  import { Badge, ImagePlaceholder, TextPlaceholder } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { useParams } from "svelte-navigator";
  import FrontPage from "../../layouts/FrontPage.svelte";

  const params = useParams();
  let slug = $params.slug;
  let data = null;
  let loading = true;
  let postTitle = "Memuat halaman ...";

  onMount(async () => {
    await fetchPost();
  });

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/publish/${slug}`);
      data = res.data.data;
      if (!data?.title) {
        postTitle = "Halaman tidak ditemukan";
      } else {
        postTitle = data.title;
      }
      loading = false;
    } catch (err) {
      error = err.response.data.message;
      loading = false;
    }
  };
</script>

<svelte:head>
  <title
    >{`${postTitle} | ${
      import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa"
    }`}</title
  >
</svelte:head>
<FrontPage title={postTitle} active="/blog">
  <div class="md:px-32 px-1">
    <h1 class="text-3xl">{postTitle}</h1>
    <span
      >{data?.date_publish
        ? dateFormat(new Date(data?.date_publish), "dd mmmm yyyy HH:MM")
        : "memuat ..."}</span
    >
    <hr />
    <div class="my-5 flex flex-col gap-5">
      {#if loading}
        <div class="grid gap-3 grid-cols-2 w-full">
          {#each [0, 1, 2, 3, 4, 5] as a}
            <div class="flex">
              <TextPlaceholder class="w-full" />
            </div>
          {/each}
        </div>
      {:else if data}
        <div class="flex flex-col gap-3">
          <div>
            <img
              src={`/assets/${data.picture}`}
              alt={data.title}
              class="w-full md:max-h-96 max-h-64 object-cover"
            />
          </div>
          <div>
            {@html data.content}
          </div>
          <div>
            {#each data.categories as c}
              <Badge>{c.name}</Badge>
            {/each}
          </div>
        </div>
      {:else}
        <div
          class="rounded shadow p-3 border border-gray-100 hover:scale-105 transition-all duration-150"
        >
          <div class="text-center">Postingan tidak tersedia!</div>
        </div>
      {/if}
    </div>
  </div>
</FrontPage>
