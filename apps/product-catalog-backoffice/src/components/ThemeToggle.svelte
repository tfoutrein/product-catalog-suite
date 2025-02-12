<script lang="ts">
  import { theme } from '../stores/theme';
  import { Sun, Moon, Sparkles } from 'lucide-svelte';

  const themes = ['light', 'dark', 'colorful'] as const;
  type ThemeMode = typeof themes[number];

  function setTheme(newTheme: ThemeMode) {
    theme.set(newTheme);
  }

  $: activeIndex = themes.indexOf($theme as ThemeMode);
</script>

<div class="relative">
  <div class="flex items-center bg-gray-200 dark:bg-gray-700 colorful:bg-purple-200 p-1 rounded-full w-[120px] h-10">
    <!-- Cercle de sélection -->
    <div
      class="absolute inset-y-1 left-1 w-9 h-8 bg-white dark:bg-gray-800 colorful:bg-gradient-to-br colorful:from-pink-500 colorful:to-purple-600 rounded-full shadow-sm transition-transform duration-200"
      style="transform: translateX({activeIndex * 40}px)"
    />
    
    <!-- Boutons -->
    <div class="relative z-10 grid grid-cols-3 w-full">
      {#each themes as mode}
        <button
          class="flex items-center justify-center h-8"
          class:text-gray-900={$theme === mode}
          class:text-gray-500={$theme !== mode}
          class:dark:text-white={$theme === mode && mode === 'dark'}
          class:dark:text-gray-400={$theme !== mode}
          class:colorful:text-white={$theme === mode && mode === 'colorful'}
          on:click={() => setTheme(mode)}
          title="Mode {mode === 'light' ? 'clair' : mode === 'dark' ? 'sombre' : 'coloré'}"
        >
          {#if mode === 'light'}
            <Sun class="h-5 w-5 stroke-[2.5]" />
          {:else if mode === 'dark'}
            <Moon class="h-5 w-5 stroke-[2.5]" />
          {:else}
            <Sparkles class="h-5 w-5 stroke-[2.5]" />
          {/if}
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  button {
    -webkit-tap-highlight-color: transparent;
  }
  
  button:focus {
    outline: none;
  }
  
  button:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
</style> 