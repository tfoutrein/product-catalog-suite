<script lang="ts">
  import { Link } from "svelte-routing";
  import { 
    Home,
    Package,
    Tags,
    Store
  } from 'lucide-svelte';
  import SettingsDrawer from './SettingsDrawer.svelte';

  const menuItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/products", label: "Produits", icon: Package },
    { path: "/categories", label: "Catégories", icon: Tags },
    { path: "/inventory", label: "Inventaire", icon: Store }
  ];
</script>

<aside class="relative w-64 bg-white dark:bg-gray-800 flex flex-col h-full z-50">
  <!-- Fond avec effet de profondeur -->
  <div class="absolute inset-0 bg-white dark:bg-gray-800 colorful:bg-gradient-to-br colorful:from-indigo-600/95 colorful:to-purple-600/95" 
    style="
      box-shadow: 
        calc(var(--depth-value) * 20px) 0 calc(var(--depth-value) * 60px) rgba(0, 0, 0, calc(var(--depth-value) * 0.3)),
        calc(var(--depth-value) * 5px) 0 calc(var(--depth-value) * 20px) rgba(0, 0, 0, calc(var(--depth-value) * 0.2)),
        inset calc(var(--depth-value) * -5px) 0 calc(var(--depth-value) * 10px) rgba(255, 255, 255, calc(var(--depth-value) * 0.1));
      transform: translateZ(0);
    "
  >
  </div>

  <!-- Overlay pour l'animation du dégradé -->
  <div 
    class="absolute inset-0 opacity-0 colorful:opacity-100 transition-opacity duration-300"
    style="
      background: linear-gradient(45deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
      background-size: 300% 300%;
      animation: gradient-shift 15s ease infinite;
    "
  >
  </div>

  <!-- Bordure avec effet de profondeur -->
  <div class="absolute inset-y-0 right-0 w-[1px]"
    style="
      background: linear-gradient(to bottom, 
        transparent,
        rgba(0, 0, 0, calc(var(--depth-value) * 0.1)) 20%,
        rgba(0, 0, 0, calc(var(--depth-value) * 0.1)) 80%,
        transparent
      );
    "
  >
  </div>

  <div class="relative flex-1 px-3 py-4 overflow-y-auto">
    <div class="mb-5 px-2">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white colorful:text-white">Backoffice</h2>
    </div>
    <ul class="space-y-2 font-medium">
      {#each menuItems as item}
        <li>
          <Link 
            to={item.path} 
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 colorful:text-white/90 colorful:hover:bg-white/10"
          >
            <svelte:component 
              this={item.icon} 
              class="w-6 h-6 text-gray-500 dark:text-gray-400 colorful:text-white/75" 
            />
            <span class="ml-3">{item.label}</span>
          </Link>
        </li>
      {/each}
    </ul>
  </div>
  
  <div class="relative mt-auto">
    <SettingsDrawer />
  </div>
</aside>

<style>
  @keyframes gradient-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style> 