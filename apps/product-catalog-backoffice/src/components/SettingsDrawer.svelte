<script lang="ts">
  import { slide } from 'svelte/transition';
  import { Settings } from 'lucide-svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import DepthSlider from './DepthSlider.svelte';

  export let isCollapsed = false;
  let isOpen = false;
</script>

<div class="relative">
  {#if isOpen && !isCollapsed}
    <div
      transition:slide={{ duration: 300, axis: 'y' }}
      class="absolute bottom-full left-0 w-full bg-white dark:bg-gray-800 colorful:bg-transparent border-t border-gray-200 dark:border-gray-700 colorful:border-white/10 rounded-t-lg shadow-lg colorful:shadow-none"
    >
      <!-- Contenu -->
      <div class="relative p-4 space-y-4">
        <DepthSlider />
        <div class="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  {/if}

  <!-- Bouton pour ouvrir/fermer le tiroir -->
  <button
    on:click={() => isOpen = !isOpen}
    class="relative w-full p-4 flex items-center justify-center text-gray-500 dark:text-gray-400 colorful:text-white/75 hover:bg-gray-100 dark:hover:bg-gray-700 colorful:hover:bg-white/10 transition-colors duration-200 bg-white dark:bg-gray-800 colorful:bg-transparent border-t border-gray-200 dark:border-gray-700 colorful:border-white/10"
  >
    <!-- Icône -->
    <Settings 
      class="relative w-6 h-6" 
      style="transform: rotate({isOpen && !isCollapsed ? '180deg' : '0deg'}); transition: transform 0.3s ease" 
    />
  </button>
</div> 