<script lang="ts">
  import { depth } from '../stores/theme';
  import { Layers } from 'lucide-svelte';

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    depth.set(Number(target.value));
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 colorful:text-purple-900">
    <Layers class="w-5 h-5" />
    <span class="text-sm font-medium">Profondeur</span>
  </div>
  
  <div class="px-1">
    <input
      type="range"
      min="0"
      max="100"
      value={$depth}
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 colorful:bg-purple-200"
      on:input={handleChange}
    />
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    background: theme(colors.primary.600);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  :global(.dark) input[type="range"]::-webkit-slider-thumb {
    background: theme(colors.primary.500);
  }

  :global(.colorful) input[type="range"]::-webkit-slider-thumb {
    background: linear-gradient(to right, theme(colors.pink.500), theme(colors.purple.600));
  }

  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: theme(colors.primary.600);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.1);
  }

  :global(.dark) input[type="range"]::-moz-range-thumb {
    background: theme(colors.primary.500);
  }

  :global(.colorful) input[type="range"]::-moz-range-thumb {
    background: linear-gradient(to right, theme(colors.pink.500), theme(colors.purple.600));
  }
</style> 