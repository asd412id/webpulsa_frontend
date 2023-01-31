<script>
  // @ts-nocheck

  import axios from "axios";
  import dateFormat from "dateformat";
  import { Badge, ImagePlaceholder, Input } from "flowbite-svelte";
  import { onMount } from "svelte";
  import IoIosSearch from "svelte-icons/io/IoIosSearch.svelte";
  import { Link } from "svelte-navigator";
  import FrontPage from "../../layouts/FrontPage.svelte";
  import InfiniteScroll from "../../lib/InfiniteScroll.svelte";
  import { cutLongText } from "../../lib/StringHelper";
  import striptags from "striptags";

  let page = 0;
  let size = 5;
  let search = "";
  let data = [];
  let newData = [];
  let loading = true;
  let error = null;
  let st;

  onMount(async () => {
    await fetchPosts();
  });

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `/posts/publish?page=${page}&size=${size}&search=${search}`
      );
      newData = res.data.data.datas;
      data = [...data, ...newData];
      loading = false;
    } catch (err) {
      error = err.response.data.message;
      loading = false;
    }
  };

  $: if (search) {
    clearTimeout(st);
    st = setTimeout(() => {
      page = 0;
      data = [];
      loading = true;
      fetchPosts();
    }, 500);
  }
</script>

<FrontPage title="Blog">
  <div class="md:px-32 px-1">
    <h1 class="text-3xl pb-2 border-b-2 border-gray-300">BLOG</h1>
    <div class="my-5 flex flex-col gap-5">
      <Input type="search" bind:value={search} placeholder="Cari berita ...">
        <span class="w-5 h-5" slot="right">
          <IoIosSearch />
        </span>
      </Input>
      {#if loading}
        {#each [1, 2, 3] as s}
          <div class="rounded shadow p-3 border border-gray-100">
            <ImagePlaceholder />
          </div>
        {/each}
      {:else if data.length}
        {#each data as v}
          <Link to={`/blog/${v.slug}`}>
            <div
              class="rounded shadow p-3 border border-gray-100 hover:scale-105 transition-all duration-150"
            >
              <div class="flex flex-col md:flex-row gap-3">
                <div class="md:w-3/12 w-full">
                  <img
                    src={`/assets/${v.picture}`}
                    alt={v.title}
                    class="w-full h-48 object-cover"
                  />
                </div>
                <div class="md:w-9/12 py-3 flex flex-col w-full">
                  <div class="italic">
                    {dateFormat(new Date(v.date_publish), "dd mmmm yyyy HH:MM")}
                  </div>
                  <h2 class="text-2xl">{v.title}</h2>
                  <div>{cutLongText(striptags(v.content), 250)}</div>
                  {#if v.categories.length}
                    <div class="flex gap-1 mt-3 flex-wrap">
                      {#each v.categories as c}
                        <Badge>{c.name}</Badge>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </Link>
        {/each}
      {:else}
        <div
          class="rounded shadow p-3 border border-gray-100 hover:scale-105 transition-all duration-150"
        >
          <div class="text-center">Postingan tidak ditemukan!</div>
        </div>
      {/if}
    </div>
  </div>
  <InfiniteScroll
    hasMore={newData.length}
    threshold={size}
    on:loadMore={() => {
      page++;
      fetchPosts();
    }}
  />
</FrontPage>
