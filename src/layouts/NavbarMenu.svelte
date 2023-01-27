<script>
  import { userData } from "../lib/UserData";
  import axios from "axios";
  import {
    NavHamburger,
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownHeader,
    DropdownDivider,
  } from "flowbite-svelte";
  import FaUserCircle from "svelte-icons/fa/FaUserCircle.svelte";
  import { useNavigate } from "svelte-navigator";
  import Account from "../pages/Account.svelte";

  const navigate = useNavigate();
  let showForm = false;

  const logout = async () => {
    try {
      userData.set(null);
      await axios.post("/users/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
</script>

<main>
  <Account bind:show={showForm} />
  <div class={$$restProps.class || ""}>
    <div class={"flex justify-end items-center py-2 px-4 shadow"}>
      <div class="flex items-center md:order-2">
        <Avatar
          id="avatar-menu"
          class="cursor-pointer text-sky-600 hover:text-sky-700 hover:transition-colors hover:duration-150"
        >
          <FaUserCircle />
        </Avatar>
        <NavHamburger on:click class1="w-full md:flex md:w-auto md:order-1" />
      </div>
      <Dropdown
        placement="bottom-end"
        triggeredBy="#avatar-menu"
        class="right-2"
      >
        <DropdownHeader>
          <span class="block text-sm">{$userData?.name}</span>
          <span class="block truncate text-sm font-medium">
            {$userData?.username}
          </span>
        </DropdownHeader>
        <DropdownItem on:click={() => (showForm = true)}
          >Pengaturan</DropdownItem
        >
        <DropdownDivider />
        <DropdownItem on:click={logout}>Sign out</DropdownItem>
      </Dropdown>
    </div>
  </div>
</main>
