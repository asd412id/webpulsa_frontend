<script>
  // @ts-nocheck

  import axios from "axios";
  import { Button, Modal, Label, Input, Alert, Select } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import Editor from "../../components/Editor.svelte";
  import { ModalTransition } from "../../lib/ModalTransition";
  import { notification } from "../../lib/Notification";
  import { isBase64 } from "../../lib/StringHelper";
  import Flatpickr from "svelte-flatpickr";
  import "flatpickr/dist/flatpickr.css";
  import "flatpickr/dist/themes/light.css";
  import IoIosSearch from "svelte-icons/io/IoIosSearch.svelte";
  import InfiniteScroll from "../../lib/InfiniteScroll.svelte";

  export let show = false;
  export let id = null;

  export let data = {
    name: "",
    picture: "",
    content: "",
    publish: true,
    slug: null,
    date_publish: datetime,
  };
  let base64;
  let file;
  let error = null;
  let loading = false;
  let content;

  let page = 0;
  let categories = [];
  let fetchCategories = [];
  let searchCategory = "";
  let st;
  let editor;

  $: if (show) {
    loading = false;
    setTimeout(() => {
      editor.getElementsByClassName("ql-editor")[0].innerHTML = data.content;
    }, 1);
  }

  const dispatch = createEventDispatcher();

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file.size > 1000000) {
      error = "Ukuran file tidak boleh lebih dari 1MB";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      base64 = e.target.result;
      data.picture = String(base64);
    };
    reader.readAsDataURL(file);
  };

  $: if (searchCategory !== undefined) {
    clearTimeout(st);
    st = setTimeout(() => {
      page = 0;
      categories = [];
      getCategories();
    }, 500);
  }

  const getCategories = async () => {
    const res = await axios.get(
      `/post-category?page=${page}&size=10&search=${searchCategory}`
    );
    fetchCategories = [...categories, ...res.data.data.datas];
    categories = fetchCategories;
  };

  const handleCheck = (event) => {
    let option = event.target.value;
    if (event.target.checked) {
      data.categories.push(option);
    } else {
      let index = data.categories.indexOf(option);
      data.categories.splice(index, 1);
    }
  };

  const submit = async () => {
    loading = true;
    error = null;
    let pb = data.picture;
    if (!data.title) {
      error = "Data tidak lengkap";
      loading = false;
    } else {
      data.content = content.html;
      if (!isBase64(data.picture)) {
        data.picture = "";
      }
      try {
        if (!id) {
          await axios.post("/posts", data);
        } else {
          await axios.put(`/posts/${id}`, data);
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
        data.picture = pb;
        error = err.response.data.message;
        loading = false;
      }
    }
  };
</script>

<Modal
  bind:open={show}
  size="xl"
  autoclose={false}
  class="w-full z-50"
  transition={ModalTransition}
>
  <form class="flex flex-col space-y-6" on:submit|preventDefault={submit}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      {id ? `Ubah Data ${data.title}` : "Tambah Data"}
    </h3>
    {#if error}
      <Alert color="red" class="flex justify-center">{error}</Alert>
    {/if}
    <div class="flex flex-col md:flex-row gap-5">
      <div class="flex flex-col gap-5 w-full md:w-8/12">
        <Label class="space-y-2">
          <span>Judul Postingan</span>
          <Input
            type="text"
            name="name"
            placeholder="Nama post"
            bind:value={data.title}
            disabled={loading}
            required
          />
        </Label>
        {#if data.slug}
          <Label class="space-y-2">
            <span>Slug/Alamat URL</span>
            <Input
              type="text"
              name="slug"
              placeholder="Slug/Url"
              bind:value={data.slug}
              disabled={loading}
            />
          </Label>
        {/if}
        <div>
          <Label class="mb-2">Isi Postingan</Label>
          <Editor bind:content bind:editor />
        </div>
      </div>
      <div class="flex flex-col gap-5 w-full md:w-4/12">
        <Label class="space-y-2">
          <span>Status</span>
          <Select bind:value={data.publish}>
            <option value={true}>Terbit</option>
            <option value={false}>Draft</option>
          </Select>
        </Label>
        <Label class="space-y-2">
          <span>Waktu Terbit</span>
          <Flatpickr
            options={{
              enableTime: true,
              time_24hr: true,
              defaultDate: data.date_publish,
              dateFormat: "d/m/Y H:i",
            }}
            bind:value={data.date_publish}
            on:change={(value) => {
              data.date_publish = value.detail[1];
            }}
            class={"block w-full disabled:cursor-not-allowed disabled:opacity-50 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 p-2.5 text-sm rounded-lg"}
          />
        </Label>
        <Label class="space-y-2">
          <span>Pilih Kategori</span>
          <Input
            type="search"
            bind:value={searchCategory}
            placeholder="Cari kategori ..."
          >
            <span class="w-5 h-5" slot="right">
              <IoIosSearch />
            </span>
          </Input>
          <div class="bg-gray-200 rounded p-4 max-h-64 overflow-y-auto">
            {#each categories as option}
              <label class="py-2 flex gap-2 items-center">
                <input
                  type="checkbox"
                  value={option.id}
                  on:change={handleCheck}
                  checked={data.categories.includes(option.id)}
                  class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <img src={`/assets/${option.logo}`} alt="" class="max-h-5" />
                <span>{option.name}</span>
              </label>
            {/each}
            <InfiniteScroll
              hasMore={fetchCategories.length}
              on:loadMore={() => {
                page++;
                getCategories();
              }}
              threshold={10}
            />
          </div>
        </Label>
        <Label class="space-y-2">
          <span>Thumbnail</span>
          <div>
            <input
              bind:this={file}
              type="file"
              on:change={handleImage}
              class="hidden"
              accept=".jpg,.jpeg,.png"
            />
            <Button color="green" size="sm" on:click={() => file.click()}
              >Pilih Gambar</Button
            >
            {#if data.picture}
              <img src={data.picture} class="w-24 h-auto mt-2" alt="" />
            {/if}
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
