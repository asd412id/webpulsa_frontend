<script>
  // @ts-nocheck

  import axios from "axios";

  // @ts-nocheck

  import {
    Alert,
    Input,
    ListPlaceholder,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarWrapper,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import FrontPage from "../../layouts/FrontPage.svelte";
  import InfiniteScroll from "../../lib/InfiniteScroll.svelte";

  let loadingOps = true;
  let loadingPulsa = true;
  let page = 0;
  let size = 10;
  let search = "";
  let operators = [];
  let newPulsas = [];
  let pulsas = [];
  let st;

  onMount(() => {
    getOperators();
  });

  $: if (search != undefined) {
    page = 0;
    pulsas = [];
    loadingPulsa = true;
    getPulsas();
  }

  const getOperators = async () => {
    const res = await axios.get("/operators?page=0&size=1000");
    operators = res.data.data.datas;
    loadingOps = false;
  };

  const getPulsas = async () => {
    const res = await axios.get(
      `/pulsas?page=${page}&size=${size}&search=${search}`
    );
    newPulsas = res.data.data.datas;
    pulsas = [...pulsas, ...newPulsas];
    loadingPulsa = false;
  };

  const clickMenu = (e, name) => {
    e.preventDefault();
    search = name;
  };

  const searchData = (e) => {
    clearTimeout(st);
    st = setTimeout(() => {
      search = e.target.value;
    }, 500);
  };
</script>

<FrontPage title="Selamat Datang">
  <div class="flex flex-col md:px-32">
    <div class="md:px-8">
      <Input
        placeholder="Cari data"
        size="lg"
        class="bg-white"
        on:keyup={searchData}
      />
    </div>
  </div>
  <div class="md:mt-10 md:flex-row flex flex-col py-5 gap-5 md:gap-12">
    <div class="md:w-4/12 w-full">
      <Sidebar class="!w-full shadow rounded">
        <SidebarWrapper>
          <SidebarGroup ulClass="flex flex-col gap-2 px-5">
            <SidebarItem
              label="Semua Operator"
              aClass="flex gap-2 justify-between py-1 items-center hover:text-sky-500 hover:scale-105 transition-all duration-150"
              activeClass="flex gap-2 justify-between py-1 items-center font-bold text-sky-500"
              active={search === ""}
              on:click={(e) => clickMenu(e, "")}
            />
            {#if loadingOps}
              <ListPlaceholder />
            {:else}
              {#each operators as ops}
                <SidebarItem
                  label={ops.name}
                  aClass="flex gap-2 justify-between py-1 items-center hover:text-sky-500 hover:scale-105 transition-all duration-150"
                  activeClass="flex gap-2 justify-between py-1 items-center font-bold text-sky-500"
                  active={String(search).toLowerCase() ===
                    String(ops.name).toLowerCase()}
                  on:click={(e) => clickMenu(e, ops.name)}
                >
                  <svelte:fragment slot="subtext">
                    <img
                      src={`/assets/${ops.logo}`}
                      alt={`Logo ${ops.name}`}
                      class="h-8 w-auto"
                    />
                  </svelte:fragment>
                </SidebarItem>
              {/each}
            {/if}
          </SidebarGroup>
        </SidebarWrapper>
      </Sidebar>
    </div>
    <div class="w-full md:w-8/12">
      {#if loadingPulsa}
        <div class="flex justify-center h-48 items-center">
          <Spinner size={10} />
        </div>
      {:else}
        <div class="flex flex-col gap-1">
          <Table shadow striped={true} hoverable={true}>
            <TableHead class="bg-gray-100">
              <TableHeadCell>Jenis Pulsa</TableHeadCell>
              <TableHeadCell>Kode Pulsa</TableHeadCell>
              <TableHeadCell>Operator</TableHeadCell>
              <TableHeadCell>Harga</TableHeadCell>
            </TableHead>
            <TableBody tableBodyClass="divide-y">
              {#if pulsas.length}
                {#each pulsas as row}
                  <TableBodyRow key={row.id}>
                    <TableBodyCell>{row.pulsa_category.name}</TableBodyCell>
                    <TableBodyCell>{row.name}</TableBodyCell>
                    <TableBodyCell>
                      <div class="flex gap-3 items-center flex-wrap">
                        {#each row.operator as opr}
                          <div class="flex gap-1 items-center">
                            <img
                              src={`/assets/${opr.logo}`}
                              alt=""
                              class="max-h-5"
                            />
                            <span>{opr.name}</span>
                          </div>
                        {/each}
                      </div>
                    </TableBodyCell>
                    <TableBodyCell
                      >Rp {Intl.NumberFormat("id").format(
                        row.price
                      )}</TableBodyCell
                    >
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
        </div>
      {/if}
    </div>
  </div>
  <InfiniteScroll
    threshold={size}
    hasMore={newPulsas.length}
    on:loadMore={() => {
      page++;
      getPulsas();
    }}
  />
</FrontPage>
