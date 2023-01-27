<script>
  import axios from "axios";
  import { Button, Modal } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import FaQuestion from "svelte-icons/fa/FaQuestion.svelte";
  import { ModalTransition } from "../lib/ModalTransition";
  import { notification } from "../lib/Notification";
  export let show = false;
  export let url = null;
  export let acceptText = "Ya, Saya Yakin";
  export let rejectText = "Batal";

  let loading = false;
  const dispatch = createEventDispatcher();
  
  $: if(show){
	loading = false;
  }

  const submit = async () => {
    loading = true;
    try {
      const res = await axios.delete(url);
      show = false;
      loading = false;
      notification.set({
        show: true,
        type: "success",
        message: res.data.message,
        duration: 3,
      });
      dispatch("onDelete");
    } catch (error) {
      notification.set({
        show: true,
        type: "error",
        message: error.response.data.message,
        duration: 3,
      });
      loading = false;
    }
  };
</script>

<Modal bind:open={show} size="xs" transition={ModalTransition}>
  <div class="text-center">
    <div class="flex justify-center">
      <div class="w-14 h-14 text-red-700">
        <FaQuestion />
      </div>
    </div>
    <div class="mb-5 mt-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      <slot />
    </div>
    <form on:submit|preventDefault={submit}>
      <Button type="submit" color="red" class="mr-2" disabled={loading}
        >{acceptText}</Button
      >
      <Button
        color="alternative"
        disabled={loading}
        on:click={() => (show = false)}>{rejectText}</Button
      >
    </form>
  </div>
</Modal>
