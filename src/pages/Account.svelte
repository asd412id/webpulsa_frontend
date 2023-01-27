<script>
  import axios from "axios";
  import { Button, Modal, Label, Input, Alert } from "flowbite-svelte";
  import { ModalTransition } from "../lib/ModalTransition";
  import { notification } from "../lib/Notification";
  import { userData } from "../lib/UserData";
  export let show = false;

  let name = $userData.name;
  let username = $userData.username;
  let password = "";
  let repassword = "";
  let error = null;
  let loading = false;

  const submit = async () => {
    loading = true;
    error = null;
    if (password && password !== repassword) {
      error = "Perulangan password tidak benar";
      loading = false;
    } else {
      try {
        const update = await axios.post("/users/account", {
          name,
          username,
          password,
        });
        userData.set(update.data.data);
        show = false;
        loading = false;
        password = "";
        repassword = "";
        notification.set({
          show: true,
          type: "success",
          message: "Data berhasil diubah",
          duration: 3,
        });
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
  class="w-full"
  transition={ModalTransition}
>
  <form class="flex flex-col space-y-6" on:submit|preventDefault={submit}>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      Ubah Data Akun
    </h3>
    {#if error}
      <Alert color="red" class="flex justify-center">{error}</Alert>
    {/if}
    <Label class="space-y-2">
      <span>Nama</span>
      <Input
        type="text"
        name="name"
        placeholder="Nama"
        bind:value={name}
        disabled={loading}
        required
      />
    </Label>
    <Label class="space-y-2">
      <span>Username</span>
      <Input
        type="text"
        name="username"
        placeholder="username"
        bind:value={username}
        disabled={loading}
        required
      />
    </Label>
    <Label class="space-y-2">
      <span>Password</span>
      <Input
        type="password"
        name="password"
        placeholder="•••••"
        bind:value={password}
        disabled={loading}
      />
    </Label>
    <Label class="space-y-2">
      <span>Ulang Password</span>
      <Input
        type="password"
        name="repassword"
        placeholder="•••••"
        bind:value={repassword}
        disabled={loading}
      />
    </Label>
    <div class="flex gap-1 justify-end">
      <Button disabled={loading} type="submit">Simpan Pengaturan</Button>
      <Button
        disabled={loading}
        type="button"
        color="alternative"
        on:click={() => (show = false)}>Batal</Button
      >
    </div>
  </form>
</Modal>
