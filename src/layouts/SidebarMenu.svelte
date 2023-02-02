<script>
  import {
    Sidebar,
    SidebarWrapper,
    SidebarBrand,
    SidebarItem,
    SidebarGroup,
  } from "flowbite-svelte";
  import logo from "../assets/logo.png";
  import MdDashboard from "svelte-icons/md/MdDashboard.svelte";
  import FaBroadcastTower from "svelte-icons/fa/FaBroadcastTower.svelte";
  import FaMoneyBill from "svelte-icons/fa/FaMoneyBill.svelte";
  import FaTags from "svelte-icons/fa/FaTags.svelte";
  import FaFileAlt from "svelte-icons/fa/FaFileAlt.svelte";
  import FaHashtag from "svelte-icons/fa/FaHashtag.svelte";
  import { Link } from "svelte-navigator";
  import { SidebarToggle } from "../lib/SidebarToggle";

  let site = {
    name: import.meta.env.VITE_APP_NAME || "Aplikasi Pulsa",
    href: "/admin",
    img: logo,
  };

  export let active = "beranda";

  const menus = [
    // {
    //   icon: MdDashboard,
    //   name: "Beranda",
    //   link: "/admin",
    // },
    {
      icon: FaBroadcastTower,
      name: "Daftar Operator",
      link: "/admin",
    },
    {
      icon: FaHashtag,
      name: "Jenis Pulsa",
      link: "/admin/jenis-pulsa",
    },
    {
      icon: FaMoneyBill,
      name: "Daftar Pulsa",
      link: "/admin/pulsa",
    },
    {
      icon: FaTags,
      name: "Kategori",
      link: "/admin/kategori",
    },
    {
      icon: FaFileAlt,
      name: "Postingan",
      link: "/admin/post",
    },
  ];
</script>

<div class:hidden={!$SidebarToggle}>
  <Sidebar class={$$restProps.class || ""}>
    <SidebarWrapper class="rounded-none min-h-full shadow">
      <SidebarGroup>
        <SidebarBrand {site} />
        {#each menus as menu}
          <Link to={menu.link}>
            <SidebarItem
              href={menu.link}
              label={menu.name}
              active={menu.link === active ? true : false}
            >
              <svelte:fragment slot="icon">
                <span class="w-5 h-5">
                  <svelte:component this={menu.icon} />
                </span>
              </svelte:fragment>
            </SidebarItem>
          </Link>
        {/each}
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
</div>
