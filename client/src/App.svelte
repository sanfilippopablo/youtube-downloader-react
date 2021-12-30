<script lang="ts">
  import DownloadCard from "./DownloadCard.svelte";
  import { downloads } from "./stores";

  let url = "";
  let artist = "";
  let title = "";

  function download() {
    downloads.download({ url, artist, title });
  }
</script>

<div class="h-screen flex">
  <div class="flex-1 p-8 gap-16 flex flex-col">
    <div class="flex items-center justify-center">
      <button
        class=" border border-blue-500 hover:bg-blue-500 text-white bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-l outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
        type="button"
      >
        Música
      </button>
      <button
        class="text-blue-500 bg-transparent border-t border-b border-r border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-r outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
        type="button"
      >
        Mensaje
      </button>
    </div>
    <div class="gap-4 flex flex-col">
      <input
        type="text"
        placeholder="URL"
        class="px-3 py-4 placeholder-gray-400 text-gray-600 relative bg-white rounded text-base border border-gray-400 outline-none focus:outline-none focus:ring w-full"
        bind:value={url}
      />
      <input
        type="text"
        placeholder="Artista"
        class="px-3 py-4 placeholder-gray-400 text-gray-600 relative bg-white rounded text-base border border-gray-400 outline-none focus:outline-none focus:ring w-full"
        bind:value={artist}
      />
      <input
        type="text"
        placeholder="Título"
        class="px-3 py-4 placeholder-gray-400 text-gray-600 relative bg-white rounded text-base border border-gray-400 outline-none focus:outline-none focus:ring w-full"
        bind:value={title}
      />
    </div>
    <div>
      <h2 class="border-b font-medium text-lg mb-4">Cortar</h2>
      <div class="flex gap-4 items-center text-l justify-center">
        <input
          type="text"
          placeholder="Desde"
          class="px-2 py-2 text-sm placeholder-gray-400 text-gray-600 relative bg-white rounded border border-gray-400 outline-none focus:outline-none focus:ring w-24"
        />
        <input
          type="text"
          placeholder="Hasta"
          class="px-2 py-2 text-sm placeholder-gray-400 text-gray-600 relative bg-white rounded border border-gray-400 outline-none focus:outline-none focus:ring w-24"
        />
      </div>
    </div>
    <div>
      <h2 class="border-b font-medium text-lg mb-4">Opciones</h2>
      <div class="flex gap-2 items-center text-l">
        <input type="checkbox" id="addToNew" name="subscribe" value="newsletter" />
        <label for="addToNew">
          Agregar a lista de reproducción <em>Lo nuevo</em>
        </label>
      </div>
    </div>
    <button
      class="bg-blue-500 text-white active:bg-purple-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
      type="button"
      on:click={download}
    >
      Descargar
    </button>
  </div>
  <div class="flex flex-col flex-1 gap-2 p-8 bg-gray-100 overflow-scroll border-l">
    {#each [...$downloads.values()] as download}
      <DownloadCard {download} />
    {/each}
  </div>
</div>
