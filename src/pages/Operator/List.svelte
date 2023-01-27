<script>
  // @ts-nocheck

  import axios from "axios";
  import {
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
      name: "",
      logo: "",
    },
    data: {
      id: null,
      name: "",
      logo: "",
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
      `/operators/?page=${page}&size=${limit}&search=${search}`
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
    url={`/operators/${deleteForm.id}`}
    on:onDelete={reloadData}
    >{`Yakin ingin menghapus ${deleteForm.text}?`}</DeleteModal
  >
  <Form
    bind:show={form.show}
    bind:data={form.data}
    bind:id={form.data.id}
    on:onSubmit={reloadData}
  />
  <Auth title="Daftar Operator">
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
            <TableHeadCell>Logo</TableHeadCell>
            <TableHeadCell>Nama Operator</TableHeadCell>
            <TableHeadCell>Jumlah Jenis Pulsa</TableHeadCell>
            <TableHeadCell>
              <span class="sr-only">Edit</span>
            </TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            {#if data.length}
              {#each data as row}
                <TableBodyRow key={row.id}>
                  <TableBodyCell
                    >{#if row.logo}
                      <img
                        src={`/assets/${row.logo}`}
                        alt=""
                        class="w-auto max-h-16"
                      />
                    {/if}</TableBodyCell
                  >
                  <TableBodyCell>{row.name}</TableBodyCell>
                  <TableBodyCell>{row.pulsa?.length}</TableBodyCell>
                  <TableBodyCell>
                    <div class="flex gap-1 justify-end">
                      <Button
                        size="xs"
                        color="yellow"
                        on:click={() => {
                          form.data = {
                            ...{
                              id: row.id,
                              name: row.name,
                              logo: `/assets/${row.logo}`,
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
                          deleteForm.text = row.name;
                          deleteForm.show = true;
                        }}>Hapus</Button
                      >
                    </div>
                  </TableBodyCell>
                </TableBodyRow>
              {/each}
            {:else}
              <TableBodyRow>
                <TableBodyCell colspan={4} class="text-center"
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
