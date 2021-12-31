<script>
  export let active = false;
  console.log(active);
</script>

<button
  class="button border hover:bg-blue-500 hover:text-white text-blue-500 bg-transparent font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none ease-linear transition-all duration-150"
  class:active
  type="button"
  on:click
>
  <slot />
</button>

<style>
  .button.active {
    @apply border-blue-500 text-white bg-blue-600;
  }

  .button:first-of-type {
    @apply rounded-l;
  }

  .button:last-of-type {
    @apply rounded-r;
  }
</style>
