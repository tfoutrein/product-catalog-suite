<script lang="ts">
  import { slide } from 'svelte/transition';
  import { 
    User,
    Settings as SettingsIcon,
    LogOut,
    ChevronDown
  } from 'lucide-svelte';
  import { auth } from '../stores/auth';
  import { navigate } from 'svelte-routing';
  import toast from 'svelte-french-toast';

  export let isCollapsed = false;
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      isMenuOpen = false;
    }
  }

  function handleLogout() {
    auth.logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="user-menu relative px-3 py-4 border-t border-gray-200 dark:border-gray-700 colorful:border-white/10">
  <button
    on:click|stopPropagation={toggleMenu}
    class="flex items-center w-full rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 colorful:hover:bg-white/10 transition-colors duration-200"
  >
    <!-- Avatar -->
    <div class="relative">
      {#if $auth.user?.picture}
        <img
          src={$auth.user.picture}
          alt={$auth.user.name}
          class="w-8 h-8 rounded-full object-cover bg-gray-200 dark:bg-gray-600"
        />
      {:else}
        <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 colorful:bg-white/20 flex items-center justify-center">
          <User class="w-4 h-4 text-primary-600 dark:text-primary-400 colorful:text-white" />
        </div>
      {/if}
      <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 colorful:border-indigo-600/95"></div>
    </div>

    {#if !isCollapsed}
      <div class="ml-3 flex-1 text-left">
        <p class="text-sm font-medium text-gray-900 dark:text-white colorful:text-white truncate">
          {$auth.user?.name || 'Utilisateur'}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 colorful:text-white/75 truncate">
          {$auth.user?.email || ''}
        </p>
      </div>
      <ChevronDown 
        class="w-4 h-4 text-gray-500 dark:text-gray-400 colorful:text-white/75 transition-transform duration-200"
        style="transform: rotate({isMenuOpen ? '180deg' : '0deg'})"
      />
    {/if}
  </button>

  {#if isMenuOpen && !isCollapsed}
    <div
      transition:slide={{ duration: 200 }}
      class="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-gray-800 colorful:bg-indigo-600/95 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 colorful:border-white/10 overflow-hidden"
      style="
        box-shadow: 
          calc(var(--depth-value) * 8px) calc(var(--depth-value) * 8px) calc(var(--depth-value) * 16px) rgba(0, 0, 0, calc(var(--depth-value) * 0.2)),
          0 4px 6px -1px rgba(0, 0, 0, 0.1);
      "
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 colorful:border-white/10">
        <p class="text-sm font-medium text-gray-900 dark:text-white colorful:text-white">
          {$auth.user?.name || 'Utilisateur'}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 colorful:text-white/75 mt-0.5 truncate">
          {$auth.user?.email || ''}
        </p>
      </div>
      
      <div class="py-2">
        <button
          class="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 colorful:text-white hover:bg-gray-100 dark:hover:bg-gray-700 colorful:hover:bg-white/10 flex items-center"
        >
          <SettingsIcon class="w-4 h-4 mr-3" />
          Paramètres du compte
        </button>
        <button
          on:click={handleLogout}
          class="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 colorful:text-white hover:bg-gray-100 dark:hover:bg-gray-700 colorful:hover:bg-white/10 flex items-center"
        >
          <LogOut class="w-4 h-4 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  {/if}
</div> 