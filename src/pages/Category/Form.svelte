<script>
  import axios from "axios";
  import { Button, Modal, Label, Input, Alert } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { ModalTransition } from "../../lib/ModalTransition";
  import { notification } from "../../lib/Notification";

  export let show = false;
  export let id = null;
  export let data = {
    name: "",
  };

  let error = null;
  let loading = false;

  $: if (show) {
    loading = false;
  }

  const dispatch = createEventDispatcher();

  const submit = async () => {
    loading = true;
    error = null;
    if (!data.name) {
      error = "Data tidak lengkap";
      loading = false;
    } else {
      try {
        if (!id) {
          await axios.post("/post-category", data);
        } else {
          await axios.put(`/post-category/${id}`, data);
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
      <span>Nama Kategori</span>
      <Input
        type="text"
        name="name"
        placeholder="Nama Kategori"
        bind:value={data.name}
        disabled={loading}
        required
      />
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
