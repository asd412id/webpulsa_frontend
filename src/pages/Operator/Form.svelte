<script>
  import axios from "axios";
  import {
    Button,
    Modal,
    Label,
    Input,
    Alert,
    Fileupload,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { ModalTransition } from "../../lib/ModalTransition";
  import { notification } from "../../lib/Notification";
  import { isBase64 } from "../../lib/StringHelper";

  export let show = false;
  export let id = null;
  export let data = {
    name: "",
    logo: "",
  };
  let base64;
  let file;

  let error = null;
  let loading = false;

  $: if (show) {
    loading = false;
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
      data.logo = String(base64);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    loading = true;
    error = null;
    let pb = data.logo;
    if (!data.name) {
      error = "Data tidak lengkap";
      loading = false;
    } else {
      if (!isBase64(data.logo)) {
        data.logo = "";
      }
      try {
        if (!id) {
          await axios.post("/operators", data);
        } else {
          await axios.put(`/operators/${id}`, data);
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
        data.logo = pb;
        error = err.response.data.message;
        loading = false;
      }
    }
  };
</script>

<Modal
  bind:open={show}
  size="xs"
  autoclose={false}
  class="w-full z-50"
  transition={ModalTransition}
>
  <form class="flex flex-col space-y-6" on:submit|preventDefault={submit}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      {id ? `Ubah Data ${data.name}` : "Tambah Data"}
    </h3>
    {#if error}
      <Alert color="red" class="flex justify-center">{error}</Alert>
    {/if}
    <Label class="space-y-2">
      <span>Nama</span>
      <Input
        type="text"
        name="name"
        placeholder="Nama Operator"
        bind:value={data.name}
        disabled={loading}
        required
      />
    </Label>
    <Label class="space-y-2">
      <span>Logo</span>
      <div>
        <input
          bind:this={file}
          type="file"
          on:change={handleImage}
          class="hidden"
          accept=".jpg,.jpeg,.png"
        />
        <Button color="green" size="sm" on:click={() => file.click()}
          >Pilih Logo</Button
        >
        {#if data.logo}
          <img src={data.logo} class="w-24 h-auto mt-2" alt="" />
        {/if}
      </div>
    </Label>
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
