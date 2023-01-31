<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
  } from "flowbite-svelte";
  import { Link } from "svelte-navigator";

  import logo from "../assets/logo.svg";

  export let title = "Selamat Datang";
  export let active = location.pathname;
  export let app_name = import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa";

  document.title = `${title} | ${
    import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa"
  }`;

  let menus = [
    {
      url: "/",
      name: "Beranda",
    },
    {
      url: "/blog",
      name: "Blog",
    },
  ];
</script>

<div class="relative">
  <Navbar
    navClass="shadow px-8 sm:px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b"
    let:hidden
    let:toggle
  >
    <NavBrand href="/">
      <img src={logo} class="mr-3 h-6 sm:h-9" alt={app_name} />
      <span
        class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
        >{app_name}</span
      >
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
      {#each menus as menu}
        <Link to={menu.url}>
          <NavLi href={menu.url} active={menu.url === active} class="uppercase"
            >{menu.name}</NavLi
          >
        </Link>
      {/each}
    </NavUl>
  </Navbar>
  <div class="w-full md:pt-32 pt-24 px-8 max-h-screen overflow-y-auto">
    <slot />
  </div>
</div>
