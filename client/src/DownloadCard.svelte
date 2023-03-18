<script lang="ts">
  import MoreIcon from "./MoreIcon.svelte";
  import type { DownloadState } from "./types";

  import { match, P } from "ts-pattern";
  export let download: DownloadState;

  const color = match(download.status)
    .with({ Error: P._ }, () => "red")
    .with("Complete", () => "green")
    .otherwise(() => "blue");

  const percentage = match(download.status)
    .with({ Downloading: P.select() }, (state) => state.percent)
    .otherwise(() => 0);
</script>

<div class={`border border-${color}-500 rounded p-2 bg-white`}>
  <div class="flex items-center">
    <div class="flex-1">
      <span class="font-medium">{download.title} </span>
      <span class="text-sm text-gray-600">{download.artist}</span>
    </div>
    <div class="rounded-full w-min p-2 transition cursor-pointer hover:bg-gray-300">
      <MoreIcon />
    </div>
  </div>
  <div class="relative pt-1">
    <div class="flex mb-2 items-center justify-between">
      <div class={`text-xs font-semibold inline-block uppercase text-${color}-600`}>
        {match(download.status)
          .with("Preprocessing", () => "Preparando")
          .with({ Downloading: P._ }, () => "Descargando")
          .with("Complete", () => "Completo")
          .with({ Error: P.select() }, (error) => `Error: ${error}`)
          .exhaustive()}
      </div>
      <div class={`text-right text-xs font-semibold inline-block text-${color}-600`}>
        {percentage}
      </div>
    </div>
    <div class={`overflow-hidden h-2 mb-4 text-xs flex rounded bg-${color}-200`}>
      <div
        style="width: {percentage}%"
        class={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500 rounded-full`}
      />
    </div>
  </div>
</div>
