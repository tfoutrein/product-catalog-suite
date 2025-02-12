<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import toast from 'svelte-french-toast';
  import { Search } from 'lucide-svelte';
  import DataTable from '../components/DataTable.svelte';
  import InventoryForm from '../components/InventoryForm.svelte';

  let products: any[] = [];
  let loading = true;
  let searchQuery = '';
  let page = 1;
  let totalPages = 1;
  let showForm = false;
  let selectedItem: any = null;

  const columns = [
    { key: 'name', label: 'Produit' },
    { key: 'brand', label: 'Marque' },
    { key: 'stock', label: 'Stock' },
    { key: 'location', label: 'Emplacement' }
  ];

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      const response = await axios.get('/api/inventory');
      products = response.data.map((item: any) => ({
        ...item,
        name: item.Product.name,
        brand: item.Product.brand,
        stock: item.quantity
      }));
      totalPages = Math.ceil(products.length / 10);
    } catch (error) {
      toast.error('Erreur lors du chargement des données d\'inventaire');
    } finally {
      loading = false;
    }
  }

  async function handleEdit(item: any) {
    selectedItem = item;
    showForm = true;
  }

  function handleSearch() {
    if (searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      totalPages = Math.ceil(products.length / 10);
      page = 1;
    } else {
      loadData();
    }
  }
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1>Gestion des Stocks</h1>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        on:click={() => {
          selectedItem = null;
          showForm = true;
        }}
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
      >
        Ajouter un produit
      </button>
    </div>
  </div>

  <div class="mt-6">
    <div class="flex gap-4 mb-4">
      <div class="relative flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Rechercher un produit..."
          class="h-10 w-full pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search class="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>
      <button
        type="button"
        on:click={handleSearch}
        class="h-10 px-4 inline-flex items-center justify-center border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Rechercher
      </button>
    </div>

    <DataTable
      {columns}
      data={products}
      {loading}
      {page}
      {totalPages}
      onPageChange={(newPage) => page = newPage}
      onEdit={handleEdit}
    />
  </div>

  <InventoryForm
    bind:show={showForm}
    item={selectedItem}
    on:save={loadData}
    on:close={() => {
      showForm = false;
      selectedItem = null;
    }}
  />
</div> 