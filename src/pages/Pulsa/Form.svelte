<script>
  // @ts-nocheck

  import axios from "axios";
  import { Button, Modal, Label, Input, Alert, Select } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import IoIosSearch from "svelte-icons/io/IoIosSearch.svelte";
  import InfiniteScroll from "../../lib/InfiniteScroll.svelte";
  import { ModalTransition } from "../../lib/ModalTransition";
  import { notification } from "../../lib/Notification";

  export let show = false;
  export let id = null;
  export let data = {
    cat_id: "",
    name: "",
    price: 0,
    operators: [],
  };

  const dispatch = createEventDispatcher();
  let error = null;
  let loading = false;
  let page = 0;
  let operators = [];
  let fetchOperators = [];
  let pulsaCats = [];
  let searchOperator = "";
  let st;

  $: if (show) {
    loading = false;
    page = 0;
    operators = [];
    getOperators();
    getPulsaCategories();
  }

  $: if (searchOperator !== undefined) {
    clearTimeout(st);
    st = setTimeout(() => {
      page = 0;
      operators = [];
      getOperators();
    }, 500);
  }

  const getOperators = async () => {
    const res = await axios.get(
      `/operators?page=${page}&size=10&search=${searchOperator}`
    );
    fetchOperators = [...operators, ...res.data.data.datas];
    operators = fetchOperators;
  };

  const getPulsaCategories = async () => {
    const res = await axios.get(`/pulsa-category?page=0&size=1000`);
    pulsaCats = res.data.data.datas;
  };

  $: formattedValue = new Intl.NumberFormat("id").format(data.price);

  const handleInput = (e) => {
    data.price = e.target.value.replace(/[^\d]/g, "");
  };

  const handleCheck = (event) => {
    let option = event.target.value;
    if (event.target.checked) {
      data.operators.push(option);
    } else {
      let index = data.operators.indexOf(option);
      data.operators.splice(index, 1);
    }
  };

  const submit = async () => {
    loading = true;
    error = null;
    if (!data.name || !data.price) {
      error = "Data tidak lengkap";
      loading = false;
    } else {
      try {
        if (!id) {
          await axios.post("/pulsas", data);
        } else {
          await axios.put(`/pulsas/${id}`, data);
        }
        show = false;
        loading = false;
        notification.set({
          show: true,
          type: "success",
          message: "Data berhasil disimpan",
          duration: 3,
        });
        dispatch("onSubmit");
      } catch (err) {
        error = err.response.data.message;
        loading = false;
      }
    }
  };
</script>

<Modal
  bind:open={show}
  autoclose={false}
  class="w-full z-50"
  transition={ModalTransition}
>
  <form class="flex flex-col space-y-5" on:submit|preventDefault={submit}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      {id ? `Ubah Data ${data.name}` : "Tambah Data"}
    </h3>
    {#if error}
      <Alert color="red" class="flex justify-center">{error}</Alert>
    {/if}
    <div class="flex gap-5">
      <div class="flex flex-col w-full gap-4">
        <Label class="space-y-2">
          <span>Jenis Pulsa</span>
          <select
            class="block w-full text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-sm p-2.5"
            bind:value={data.cat_id}
            disabled={loading}
            required
          >
            <option value="">Pilih Jenis Pulsa</option>
            {#each pulsaCats as pc}
              <option value={pc.id}>{pc.name}</option>
            {/each}
          </select>
        </Label>
        <Label class="space-y-2">
          <span>Nama Pulsa</span>
          <Input
            type="text"
            name="name"
            placeholder="Nama Pulsa"
            bind:value={data.name}
            disabled={loading}
            required
          />
        </Label>
        <Label class="space-y-2">
          <span>Harga</span>
          <Input
            type="text"
            name="price"
            placeholder="Harga Pulsa"
            value={formattedValue}
            inputmode="numeric"
            on:input={handleInput}
            required
          >
            <span slot="left">Rp</span>
          </Input>
        </Label>
      </div>
      <div class="flex flex-col w-full gap-4">
        <Label class="space-y-2">
          <span>Pilih Operator</span>
          <Input
            type="search"
            bind:value={searchOperator}
            placeholder="Cari operator ..."
          >
            <span class="w-5 h-5" slot="right">
              <IoIosSearch />
            </span>
          </Input>
          <div class="bg-gray-200 rounded p-4 max-h-64 overflow-y-auto">
            {#each operators as option}
              <label class="py-2 flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={option.id}
                  on:change={handleCheck}
                  checked={data.operators.includes(option.id)}
                  class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <img src={`/assets/${option.logo}`} alt="" class="max-h-5" />
                <span>{option.name}</span>
              </label>
            {/each}
            <InfiniteScroll
              hasMore={fetchOperators.length}
              on:loadMore={() => {
                page++;
                getOperators();
              }}
              threshold={10}
            />
          </div>
        </Label>
      </div>
    </div>
    <div class="flex gap-1 justify-end">
      <Button disabled={loading} type="submit">Simpan</Button>
      <Button
        disabled={loading}
        type="button"
        color="alternative"
        on:click={() => (show = false)}>Batal</Button
      >
    </div>
  </form>
</Modal>
