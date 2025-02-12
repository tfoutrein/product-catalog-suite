<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { X } from 'lucide-svelte';
  import toast from 'svelte-french-toast';
  import axios from 'axios';

  export let item: any = null;
  export let show = false;

  const dispatch = createEventDispatcher();

  let loading = false;
  let availableProducts: any[] = [];

  interface InventoryFormData {
    product_id?: string;
    quantity: number;
    min_threshold: number;
    location: string;
  }

  let formData: InventoryFormData = {
    product_id: '',
    quantity: 0,
    min_threshold: 10,
    location: ''
  };

  onMount(async () => {
    if (!item) {
      await loadAvailableProducts();
    }
  });

  async function loadAvailableProducts() {
    try {
      const [productsRes, inventoryRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/inventory')
      ]);

      // Filtrer les produits qui ne sont pas déjà dans l'inventaire
      const inventoryProductIds = new Set(inventoryRes.data.map((inv: any) => inv.product_id));
      availableProducts = productsRes.data.filter((product: any) => !inventoryProductIds.has(product.id));
    } catch (error) {
      toast.error('Erreur lors du chargement des produits disponibles');
    }
  }

  function initializeForm() {
    if (item) {
      formData = {
        quantity: item.quantity || 0,
        min_threshold: item.min_threshold || 10,
        location: item.location || ''
      };
    } else {
      formData = {
        product_id: '',
        quantity: 0,
        min_threshold: 10,
        location: ''
      };
    }
  }

  $: if (show) {
    initializeForm();
    if (!item) {
      loadAvailableProducts();
    }
  }

  function close() {
    show = false;
    dispatch('close');
  }

  async function handleSubmit() {
    try {
      if (formData.quantity < 0) {
        toast.error('La quantité ne peut pas être négative');
        return;
      }

      if (!item && !formData.product_id) {
        toast.error('Veuillez sélectionner un produit');
        return;
      }

      loading = true;
      console.log('Données envoyées:', formData);

      if (item) {
        const response = await axios.put(`/api/inventory/${item.id}`, formData);
        console.log('Réponse du serveur:', response.data);
        toast.success('Stock mis à jour avec succès');
      } else {
        const response = await axios.post('/api/inventory', formData);
        console.log('Réponse du serveur:', response.data);
        toast.success('Produit ajouté à l\'inventaire avec succès');
      }
      dispatch('save');
      close();
    } catch (error: any) {
      console.error('Erreur:', error.response?.data || error);
      toast.error(item ? 'Erreur lors de la mise à jour du stock' : 'Erreur lors de l\'ajout à l\'inventaire');
    } finally {
      loading = false;
    }
  }
</script>

{#if show}
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
  <div class="fixed inset-y-0 right-0 z-10 w-[600px] overflow-y-auto bg-white dark:bg-gray-800 shadow-xl">
    <div class="flex h-full flex-col">
      <!-- En-tête -->
      <div class="flex items-center justify-between px-4 py-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          {item ? `Modifier le stock - ${item.Product.name}` : 'Ajouter un produit à l\'inventaire'}
        </h3>
        <button
          type="button"
          class="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          on:click={close}
        >
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Contenu -->
      <div class="flex-1 px-4 py-6">
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          {#if !item}
            <div>
              <label for="product_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Produit</label>
              <select
                id="product_id"
                bind:value={formData.product_id}
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">Sélectionner un produit</option>
                {#each availableProducts as product}
                  <option value={product.id}>{product.name} - {product.brand}</option>
                {/each}
              </select>
            </div>
          {/if}

          <div>
            <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantité en stock</label>
            <input
              type="number"
              id="quantity"
              bind:value={formData.quantity}
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="min_threshold" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Seuil d'alerte</label>
            <input
              type="number"
              id="min_threshold"
              bind:value={formData.min_threshold}
              min="0"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Une alerte sera générée lorsque le stock passera sous ce seuil
            </p>
          </div>

          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Emplacement</label>
            <input
              type="text"
              id="location"
              bind:value={formData.location}
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <!-- Actions -->
          <div class="mt-6 flex items-center justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              type="button"
              on:click={close}
              class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if} 