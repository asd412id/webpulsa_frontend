<script>
  // @ts-nocheck

  import axios from "axios";
  import {
    Badge,
    Button,
    Input,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import dateFormat from "dateformat";
  import Auth from "../../layouts/Auth.svelte";
  import IoIosSearch from "svelte-icons/io/IoIosSearch.svelte";
  import InfiniteScroll from "../../lib/InfiniteScroll.svelte";
  import Form from "./Form.svelte";
  import DeleteModal from "../../components/DeleteModal.svelte";
  import { searchKey } from "../../lib/StringHelper";

  let data = [];
  let newData = [];
  let page = 0;
  let limit = 20;
  let search = "";
  let st;
  let isLoading = true;

  const form = {
    show: false,
    default: {
      id: null,
      title: "",
      content: "",
      picture: "",
      publish: true,
      slug: null,
      categories: [],
      date_publish: new Date(),
    },
    data: {
      id: null,
      title: "",
      content: "",
      picture: "",
      publish: true,
      slug: null,
      categories: [],
      date_publish: new Date(),
    },
  };

  const deleteForm = {
    id: null,
    show: false,
    text: false,
  };

  onMount(async () => {
    await loadData();
  });

  const searchData = (event) => {
    if (searchKey(event)) {
      event.preventDefault();
    } else {
      clearTimeout(st);
      st = setTimeout(reloadData, 500);
    }
  };

  async function loadData() {
    const response = await axios.get(
      `/posts/?page=${page}&size=${limit}&search=${search}`
    );
    newData = response.data.data.datas;
    data = [...data, ...newData];
    isLoading = false;
  }

  const reloadData = () => {
    page = 0;
    data = [];
    loadData();
  };
</script>

<main>
  <DeleteModal
    bind:show={deleteForm.show}
    url={`/posts/${deleteForm.id}`}
    on:onDelete={reloadData}
    >{`Yakin ingin menghapus ${deleteForm.text}?`}</DeleteModal
  >
  <Form
    bind:show={form.show}
    bind:data={form.data}
    bind:id={form.data.id}
    on:onSubmit={reloadData}
  />
  <Auth title="Daftar Postingan">
    <div class="flex flex-col gap-2">
      <div class="flex md:justify-between justify-center">
        <Button
          size="sm"
          on:click={() => {
            form.data = { ...form.default };
            form.show = true;
          }}>Tambah Data</Button
        >
        <div>
          <Input
            type="search"
            placeholder="Cari data ..."
            bind:value={search}
            on:keyup={searchData}
            on:change={searchData}
          >
            <span class="w-5 h-5" slot="right">
              <IoIosSearch />
            </span>
          </Input>
        </div>
      </div>
      {#if isLoading}
        <div class="flex justify-center">
          <Spinner size={10} color="blue" />
        </div>
      {:else}
        <Table shadow striped={true} hoverable={true}>
          <TableHead class="bg-gray-100">
            <TableHeadCell>Gambar</TableHeadCell>
            <TableHeadCell>Judul Postingan</TableHeadCell>
            <TableHeadCell>Tanggal Posting</TableHeadCell>
            <TableHeadCell>Kategori</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>
              <span class="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            {#if data.length}
              {#each data as row}
                <TableBodyRow key={row.id}>
                  <TableBodyCell
                    >{#if row.picture}
                      <img
                        src={`/assets/${row.picture}`}
                        alt=""
                        class="w-auto max-h-16"
                      />
                    {/if}</TableBodyCell
                  >
                  <TableBodyCell>{row.title}</TableBodyCell>
                  <TableBodyCell
                    >{dateFormat(
                      new Date(row.date_publish),
                      "dd/mm/yyyy HH:MM"
                    )}</TableBodyCell
                  >
                  <TableBodyCell>
                    <div class="flex flex-wrap gap-1">
                      {#each row.categories as c}
                        <Badge color="indigo">{c.name}</Badge>
                      {/each}
                    </div>
                  </TableBodyCell>
                  <TableBodyCell>
                    {#if row.publish}
                      <Badge color="green">Terbit</Badge>
                    {:else}
                      <Badge color="yellow">Draf</Badge>
                    {/if}
                  </TableBodyCell>
                  <TableBodyCell>
                    <div class="flex gap-1 justify-end">
                      <Button
                        size="xs"
                        color="yellow"
                        on:click={() => {
                          const dt = new Date(row.date_publish);
                          form.data = {
                            ...{
                              id: row.id,
                              title: row.title,
                              content: row.content,
                              slug: row.slug,
                              picture: `/assets/${row.picture}`,
                              publish: row.publish,
                              date_publish: dt,
                              categories: [...row.categories.map((e) => e.id)],
                            },
                          };
                          form.show = true;
                        }}>Edit</Button
                      >
                      <Button
                        size="xs"
                        color="red"
                        on:click={() => {
                          deleteForm.id = row.id;
                          deleteForm.text = row.title;
                          deleteForm.show = true;
                        }}>Hapus</Button
                      >
                    </div>
                  </TableBodyCell>
                </TableBodyRow>
              {/each}
            {:else}
              <TableBodyRow>
                <TableBodyCell colspan={6} class="text-center"
                  >Data tidak tersedia</TableBodyCell
                >
              </TableBodyRow>
            {/if}
          </TableBody>
        </Table>
      {/if}
    </div>
    <InfiniteScroll
      threshold={limit}
      hasMore={newData.length}
      on:loadMore={() => {
        page++;
        loadData();
      }}
    />
  </Auth>
</main>
