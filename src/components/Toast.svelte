<script>
  import { Toast, Button } from "flowbite-svelte";
  import { slide } from "svelte/transition";
  import MdCheckCircle from "svelte-icons/md/MdCheckCircle.svelte";
  import MdError from "svelte-icons/md/MdError.svelte";

  export let show = false;
  export let type = "success";
  export let message = "";
  export let duration = 6;

  $: if (show == true) {
    timeout();
  }

  function timeout() {
    if (--duration > 0) return setTimeout(timeout, 1000);
    show = false;
  }
</script>

<Toast
  simple
  transition={slide}
  bind:open={show}
  position="top-right"
  color={type === "success" ? "green" : "red"}
>
  <svelte:fragment slot="icon">
    <span class="w-6 h-6">
      <svelte:component this={type === "success" ? MdCheckCircle : MdError} />
    </span>
  </svelte:fragment>
  {message}
</Toast>
