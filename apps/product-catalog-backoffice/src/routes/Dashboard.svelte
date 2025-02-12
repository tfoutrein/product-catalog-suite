<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import toast from 'svelte-french-toast';
  import BrandCloud from '../components/BrandCloud.svelte';
  import { navigate } from 'svelte-routing';
  import { Package, Tags, ShoppingBag } from 'lucide-svelte';

  interface Stats {
    products: number;
    categories: number;
    brands: number;
  }

  interface Product {
    id: string;
    name: string;
    brand?: string;
  }

  let stats: Stats = {
    products: 0,
    categories: 0,
    brands: 0
  };

  let loading = true;

  onMount(async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get<Product[]>('/api/products'),
        axios.get('/api/categories')
      ]);

      // Calculer le nombre unique de marques
      const uniqueBrands = new Set(productsRes.data.map(product => product.brand).filter(Boolean));

      stats = {
        products: productsRes.data.length,
        categories: categoriesRes.data.length,
        brands: uniqueBrands.size
      };
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      loading = false;
    }
  });

  function navigateTo(path: string) {
    navigate(path);
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
    Catalogue de Produits
  </h1>

  <div class="max-w-5xl mx-auto">
    {#if loading}
      <div class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Chargement des statistiques...</p>
      </div>
    {:else}
      <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
        <!-- Statistiques -->
        <button
          class="stats-card flex items-center p-4 rounded-lg shadow-xs hover:shadow-md transition-shadow transform hover:scale-105 duration-200 cursor-pointer"
          on:click={() => navigateTo('/products')}
        >
          <div class="stats-icon p-4 rounded-full">
            <Package class="h-8 w-8" />
          </div>
          <div class="flex flex-col items-center w-[calc(100%-5rem)]">
            <p class="mb-2 text-lg font-medium text-gray-600 dark:text-gray-400 colorful:text-purple-600">
              Produits
            </p>
            <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200 colorful:text-purple-900">
              {stats.products}
            </p>
          </div>
        </button>
        
        <button
          class="stats-card flex items-center p-4 rounded-lg shadow-xs hover:shadow-md transition-shadow transform hover:scale-105 duration-200 cursor-pointer"
          on:click={() => navigateTo('/categories')}
        >
          <div class="stats-icon p-4 rounded-full">
            <Tags class="h-8 w-8" />
          </div>
          <div class="flex flex-col items-center w-[calc(100%-5rem)]">
            <p class="mb-2 text-lg font-medium text-gray-600 dark:text-gray-400 colorful:text-purple-600">
              Catégories
            </p>
            <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200 colorful:text-purple-900">
              {stats.categories}
            </p>
          </div>
        </button>
        
        <button
          class="stats-card flex items-center p-4 rounded-lg shadow-xs hover:shadow-md transition-shadow transform hover:scale-105 duration-200 cursor-pointer"
          on:click={() => navigateTo('/products?view=brands')}
        >
          <div class="stats-icon p-4 rounded-full">
            <ShoppingBag class="h-8 w-8" />
          </div>
          <div class="flex flex-col items-center w-[calc(100%-5rem)]">
            <p class="mb-2 text-lg font-medium text-gray-600 dark:text-gray-400 colorful:text-purple-600">
              Marques
            </p>
            <p class="text-2xl font-semibold text-gray-700 dark:text-gray-200 colorful:text-purple-900">
              {stats.brands}
            </p>
          </div>
        </button>
      </div>

      <!-- Nuage de logos -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Marques Populaires
        </h2>
        <BrandCloud />
      </div>
    {/if}
  </div>
</div> 