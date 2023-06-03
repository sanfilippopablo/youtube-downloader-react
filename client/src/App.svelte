<script lang="ts">
  import * as yup from "yup";
  import { HOST } from "./api";
  import ButtonToggle from "./ButtonToggle.svelte";
  import DownloadCard from "./DownloadCard.svelte";
  import { downloads } from "./stores";
  import { DownloadInput, DownloadType } from "./types";

  let schema = yup.object().shape({
    url: yup.string().url().required(),
    artist: yup.string().required(),
    title: yup.string().required(),
    start: yup.string().matches(/\d\d:\d\d:\d\d/, { excludeEmptyString: true }),
    end: yup.string().matches(/\d\d:\d\d:\d\d/, { excludeEmptyString: true }),
  });

  let download_type: DownloadType = "Música";
  let url = "";
  let artist = "";
  let title = "";
  let start = "";
  let end = "";

  async function download() {
    const isValid = await schema.isValid({ url, artist, title, start, end });
    console.log({ isValid });
    if (isValid) {
      const data: DownloadInput = { url, artist, title, download_type };
      if (start || end) {
        data.cut = { start, end };
      }
      downloads.download(data);
    }
  }

  let playlistsPromise = (async () =>
    fetch(`http://${HOST}/api/playlists`).then((response) => response.json()))() as Promise<
    Array<string>
  >;

  $: console.log($downloads);
</script>

<div class="h-screen flex">
  <div class="flex-1 p-8 justify-between flex flex-col">
    <div class="flex items-center justify-center">
      <ButtonToggle
        active={download_type === "Música"}
        on:click={() => {
          download_type = "Música";
        }}
      >
        Música
      </ButtonToggle>
      <ButtonToggle
        active={download_type === "Mensaje"}
        on:click={() => {
          download_type = "Mensaje";
        }}
      >
        Mensaje
      </ButtonToggle>
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
          bind:value={start}
        />
        <input
          type="text"
          placeholder="Hasta"
          class="px-2 py-2 text-sm placeholder-gray-400 text-gray-600 relative bg-white rounded border border-gray-400 outline-none focus:outline-none focus:ring w-24"
          bind:value={end}
        />
      </div>
    </div>
    <div>
      <h2 class="border-b font-medium text-lg mb-4">Opciones</h2>
      {#await playlistsPromise then playlists}
        {#each playlists as playlist}
          <div class="flex gap-2 items-center text-l">
            <input type="checkbox" id="addToNew" name="subscribe" value="newsletter" />
            <label for="addToNew">
              Agregar a lista de reproducción <em>{playlist}</em>
            </label>
          </div>
        {/each}
      {/await}
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
