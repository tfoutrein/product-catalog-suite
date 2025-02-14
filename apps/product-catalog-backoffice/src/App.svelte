<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { Toaster } from 'svelte-french-toast';
  import Sidebar from './components/Sidebar.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import Products from './routes/Products.svelte';
  import Categories from './routes/Categories.svelte';
  import Inventory from './routes/Inventory.svelte';
  import Users from './routes/Users.svelte';
  import Login from './routes/Login.svelte';
  import ProtectedRoute from './components/ProtectedRoute.svelte';
  import { setContext } from 'svelte';
  import { depth } from './stores/theme';
  import { auth } from './stores/auth';
  import { onMount } from 'svelte';

  export let url = "";
  setContext('url', url);

  let isAuthenticated = false;

  onMount(() => {
    const initialDepth = $depth;
    document.documentElement.style.setProperty('--depth-value', (initialDepth / 100).toString());

    return auth.subscribe(state => {
      isAuthenticated = state.isAuthenticated;
    });
  });

  $: if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--depth-value', ($depth / 100).toString());
  }
</script>

<Toaster />

<Router {url}>
  {#if isAuthenticated}
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900 colorful:bg-gradient-to-br colorful:from-pink-100 colorful:to-purple-100">
      <Sidebar />
      
      <main class="relative flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 colorful:bg-transparent transition-all duration-300">
        <div class="container mx-auto px-6 py-8">
          <Route path="/" component={Dashboard} />
          <Route path="/products" component={Products} />
          <Route path="/categories" component={Categories} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/users" component={Users} />
        </div>
      </main>
    </div>
  {:else}
    <Route path="/login" component={Login} />
    <Route path="*">
      <ProtectedRoute path="*">
        <div />
      </ProtectedRoute>
    </Route>
  {/if}
</Router>

<style lang="postcss">
  :global(:root) {
    --depth-value: 0.5;
    --gradient-start: theme('colors.violet.500');
    --gradient-mid: theme('colors.fuchsia.500');
    --gradient-end: theme('colors.pink.500');
  }

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

  @keyframes hue-rotate {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }

  :global(html) {
    @apply bg-gray-100 dark:bg-gray-900;
  }

  :global(.colorful html) {
    background: linear-gradient(45deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    background-size: 300% 300%;
    animation: gradient-shift 15s ease infinite;
    @apply bg-opacity-10;
  }

  :global(h1) {
    @apply text-gray-900 dark:text-white;
  }

  :global(.colorful h1) {
    background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% auto;
    animation: gradient-shift 8s ease infinite;
  }

  :global(.card) {
    @apply bg-white dark:bg-gray-800;
    box-shadow: calc(var(--depth-value) * 10px) calc(var(--depth-value) * 10px) calc(var(--depth-value) * 20px) rgba(0, 0, 0, calc(var(--depth-value) * 0.15));
    transform: translateZ(0);
  }

  :global(.colorful .card) {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    background-size: 300% 300%;
    animation: gradient-shift 12s ease infinite;
    @apply backdrop-blur-sm;
  }

  :global(.input) {
    @apply bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white;
    box-shadow: 0 calc(var(--depth-value) * 4px) calc(var(--depth-value) * 8px) rgba(0, 0, 0, calc(var(--depth-value) * 0.1));
  }

  :global(.colorful .input) {
    background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
    background-size: 200% auto;
    animation: gradient-shift 8s ease infinite;
    @apply border-violet-300 text-white placeholder-violet-200;
  }

  :global(.button-primary) {
    @apply bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white;
    box-shadow: 0 calc(var(--depth-value) * 8px) calc(var(--depth-value) * 16px) rgba(0, 0, 0, calc(var(--depth-value) * 0.2));
    transform: translateZ(0);
  }

  :global(.colorful .button-primary) {
    background: linear-gradient(45deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    background-size: 200% auto;
    animation: gradient-shift 5s ease infinite;
    transition: all 0.3s ease;
  }

  :global(.colorful .button-primary:hover) {
    background-size: 250% auto;
    animation: gradient-shift 3s ease infinite;
    filter: brightness(1.1);
  }

  :global(.button-secondary) {
    @apply bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600;
    box-shadow: 0 calc(var(--depth-value) * 4px) calc(var(--depth-value) * 8px) rgba(0, 0, 0, calc(var(--depth-value) * 0.1));
    transform: translateZ(0);
  }

  :global(.colorful .button-secondary) {
    background: linear-gradient(45deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    background-size: 200% auto;
    animation: gradient-shift 8s ease infinite;
    @apply bg-opacity-50 text-white border-violet-300;
  }

  :global(.colorful .button-secondary:hover) {
    background-size: 250% auto;
    animation: gradient-shift 4s ease infinite;
    filter: brightness(1.1);
  }

  :global(.stats-card) {
    @apply bg-white dark:bg-gray-800 transition-all duration-300;
    box-shadow: 
      calc(var(--depth-value) * 15px) calc(var(--depth-value) * 15px) calc(var(--depth-value) * 30px) rgba(0, 0, 0, calc(var(--depth-value) * 0.1)),
      calc(var(--depth-value) * 5px) calc(var(--depth-value) * 5px) calc(var(--depth-value) * 15px) rgba(0, 0, 0, calc(var(--depth-value) * 0.1));
  }

  :global(.colorful .stats-card) {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    background-size: 300% 300%;
    animation: gradient-shift 10s ease infinite;
    @apply backdrop-blur-sm;
    box-shadow: 
      calc(var(--depth-value) * 15px) calc(var(--depth-value) * 15px) calc(var(--depth-value) * 30px) rgba(139, 92, 246, calc(var(--depth-value) * 0.3)),
      calc(var(--depth-value) * 5px) calc(var(--depth-value) * 5px) calc(var(--depth-value) * 15px) rgba(236, 72, 153, calc(var(--depth-value) * 0.2));
  }

  :global(.stats-icon) {
    @apply text-gray-600 dark:text-gray-400;
  }

  :global(.colorful .stats-icon) {
    background: linear-gradient(45deg, var(--gradient-start), var(--gradient-end));
    animation: hue-rotate 10s linear infinite;
    @apply text-white bg-opacity-30;
  }

  :global(.table) {
    @apply relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden;
    box-shadow: 
      calc(var(--depth-value) * 20px) calc(var(--depth-value) * 20px) calc(var(--depth-value) * 60px) rgba(0, 0, 0, calc(var(--depth-value) * 0.3)),
      calc(var(--depth-value) * 5px) calc(var(--depth-value) * 5px) calc(var(--depth-value) * 20px) rgba(0, 0, 0, calc(var(--depth-value) * 0.2)),
      inset 0 0 calc(var(--depth-value) * 10px) rgba(255, 255, 255, calc(var(--depth-value) * 0.1));
    transform: translateZ(0);
  }

  :global(.colorful .table) {
    background: linear-gradient(135deg, color-mix(in srgb, var(--gradient-start) 95%, black), color-mix(in srgb, var(--gradient-end) 95%, black));
    background-size: 200% 200%;
    animation: gradient-shift 15s ease infinite;
  }

  :global(.table-header) {
    @apply relative bg-gray-50 dark:bg-gray-700;
    box-shadow: 0 calc(var(--depth-value) * 4px) calc(var(--depth-value) * 8px) rgba(0, 0, 0, calc(var(--depth-value) * 0.15));
  }

  :global(.colorful .table-header) {
    background: linear-gradient(90deg, color-mix(in srgb, var(--gradient-start) 90%, black), color-mix(in srgb, var(--gradient-end) 90%, black));
    background-size: 200% auto;
    animation: gradient-shift 10s ease infinite;
  }

  :global(.table-row) {
    @apply relative hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200;
    box-shadow: 
      0 calc(var(--depth-value) * 1px) 0 rgba(0, 0, 0, calc(var(--depth-value) * 0.05)),
      0 calc(var(--depth-value) * -1px) 0 rgba(255, 255, 255, calc(var(--depth-value) * 0.05));
  }

  :global(.colorful .table-row:hover) {
    background: linear-gradient(90deg, color-mix(in srgb, var(--gradient-start) 50%, transparent), color-mix(in srgb, var(--gradient-end) 50%, transparent));
    background-size: 200% auto;
    animation: gradient-shift 5s ease infinite;
  }

  :global(.form) {
    @apply bg-white dark:bg-gray-800;
    box-shadow: calc(var(--depth-value) * 25px) calc(var(--depth-value) * 25px) calc(var(--depth-value) * 50px) rgba(139, 92, 246, calc(var(--depth-value) * 0.25));
    transform: translateZ(0);
  }

  :global(.colorful .form) {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    background-size: 300% 300%;
    animation: gradient-shift 15s ease infinite;
    @apply backdrop-blur-sm;
  }
</style> 