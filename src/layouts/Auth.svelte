<script>
  // @ts-nocheck

  import { userData } from "../lib/UserData";
  import axios from "axios";
  import { Spinner } from "flowbite-svelte";
  import Login from "../pages/Login.svelte";
  import NavbarMenu from "./NavbarMenu.svelte";
  import SidebarMenu from "./SidebarMenu.svelte";
  import Toast from "../components/Toast.svelte";
  import { notification } from "../lib/Notification";
  export let title = "Beranda";
  export let active = location.pathname;
  document.title = `${title} | ${
    import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa"
  }`;

  let loading = true;
  let error = null;

  const checkLogin = async () => {
    try {
      const login = await axios.get("/users/status");
      userData.set(login.data);
      loading = false;
    } catch (err) {
      loading = false;
      error = err.response.data.message;
    }
  };

  if (!$userData) {
    checkLogin();
  } else {
    loading = false;
  }
</script>

<main>
  {#if loading}
    <div class="flex fixed inset-0 justify-center items-center">
      <Spinner color="blue" size={12} />
    </div>
  {:else if $userData}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="md:left-72 left-0 md:pl-8 top-10 pt-10 right-0 md:pr-8 bottom-0 pb-10 fixed overflow-y-auto"
    >
      <div class="font-bold md:text-3xl text-xl text-center md:text-left mb-5">
        {title}
      </div>
      <slot />
    </div>
    <NavbarMenu class="fixed top-0 md:left-64 left-0 right-0 bg-gray-50" />
    <SidebarMenu class={`fixed left-0 top-0 bottom-0`} {active} />
    <Toast
      bind:show={$notification.show}
      bind:type={$notification.type}
      bind:message={$notification.message}
      bind:duration={$notification.duration}
    />
  {:else}
    <Login {error} />
  {/if}
</main>
