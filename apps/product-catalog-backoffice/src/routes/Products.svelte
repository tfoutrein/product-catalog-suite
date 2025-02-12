<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import toast from 'svelte-french-toast';
  import { Plus, Search } from 'lucide-svelte';
  import DataTable from '../components/DataTable.svelte';
  import ProductForm from '../components/ProductForm.svelte';

  let products: any[] = [];
  let filteredProducts: any[] = [];
  let categories: any[] = [];
  let loading = true;
  let showForm = false;
  let selectedProduct: any = null;
  let searchQuery = '';
  let page = 1;
  let totalPages = 1;

  const columns = [
    { key: 'image_url', label: 'Image', type: 'image' },
    { key: 'name', label: 'Nom' },
    { key: 'brand', label: 'Marque' },
    { key: 'price', label: 'Prix' }
  ];

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories')
      ]);
      products = productsRes.data;
      filteredProducts = [...products];
      categories = categoriesRes.data;
      updatePagination();
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      loading = false;
    }
  }

  function updatePagination() {
    totalPages = Math.ceil(filteredProducts.length / 10);
    page = 1;
  }

  function handleEdit(product: any) {
    selectedProduct = product;
    showForm = true;
  }

  async function handleDelete(product: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${product.id}`);
        toast.success('Produit supprimé avec succès');
        await loadData();
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  }

  // Recherche en temps réel
  $: {
    if (products.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        filteredProducts = products.filter(product => 
          (product.name?.toLowerCase().includes(query)) ||
          (product.brand?.toLowerCase().includes(query)) ||
          (product.description?.toLowerCase().includes(query))
        );
      } else {
        filteredProducts = [...products];
      }
      updatePagination();
    }
  }

  function handleSave() {
    loadData();
  }
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1>Gestion des Produits</h1>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        on:click={() => {
          selectedProduct = null;
          showForm = true;
        }}
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
      >
        <Plus class="h-4 w-4 mr-2" />
        Nouveau Produit
      </button>
    </div>
  </div>

  <div class="mt-6">
    <div class="flex gap-4 mb-4">
      <div class="relative flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Rechercher par nom, marque ou description..."
          class="h-10 w-full pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search class="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>

    <DataTable
      {columns}
      data={filteredProducts}
      {loading}
      {page}
      {totalPages}
      onPageChange={(newPage) => page = newPage}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  </div>

  <ProductForm
    bind:show={showForm}
    product={selectedProduct}
    {categories}
    on:save={handleSave}
    on:close={() => {
      showForm = false;
      selectedProduct = null;
    }}
  />
</div> 