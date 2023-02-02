<script>
  import { userData } from "../lib/UserData";
  import axios from "axios";
  import { Alert, Button, Input } from "flowbite-svelte";
  import logo from "../assets/logo.png";

  document.title = `Silahkan Login | ${
    import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa"
  }`;

  export let error = null;

  let username = "";
  let password = "";
  let loading = false;

  const submit = async () => {
    loading = true;
    try {
      const login = await axios.post("/users/login", { username, password });
      userData.set(login.data.data);
      loading = false;
    } catch (err) {
      password = "";
      error = err.response.data.message;
      loading = false;
    }
  };
</script>

<main>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <a
        href="/"
        class="flex flex-col items-center mb-6 font-semibold text-gray-900 dark:text-white"
      >
        <img
          class="w-16 h-16 mb-3"
          src={logo}
          alt={`Logo ${import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa"}`}
        />
        <h1 class="text-4xl text-blue-800">
          {import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa"}
        </h1>
      </a>
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          {#if error}
            <Alert class="flex justify-center font-bold" color="red"
              >{error}</Alert
            >
          {/if}
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Silahkan Login
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            on:submit|preventDefault={submit}
          >
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Username</label
              >
              <Input
                disabled={loading}
                type="text"
                name="username"
                id="username"
                bind:value={username}
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="username"
                required
                autofocus
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <Input
                disabled={loading}
                type="password"
                name="password"
                id="password"
                bind:value={password}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              disabled={loading}
              type="submit"
              class="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
              >MASUK</Button
            >
          </form>
        </div>
      </div>
    </div>
  </section>
</main>
