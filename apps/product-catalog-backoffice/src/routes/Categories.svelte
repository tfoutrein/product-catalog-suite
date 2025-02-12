<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import toast from 'svelte-french-toast';
  import { Plus, Search } from 'lucide-svelte';
  import CategoryForm from '../components/CategoryForm.svelte';
  import DataTable from '../components/DataTable.svelte';

  let categories: any[] = [];
  let filteredCategories: any[] = [];
  let loading = true;
  let showForm = false;
  let selectedCategory: any = null;
  let searchQuery = '';

  const columns = [
    { key: 'name', label: 'Nom' },
    { key: 'description', label: 'Description' },
    { key: 'subCategoriesCount', label: 'Sous-catégories' }
  ];

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      const response = await axios.get('/api/categories?include=products');
      categories = response.data.map((category: any) => ({
        ...category,
        subCategoriesCount: category.SubCategories?.length || 0
      }));
      filteredCategories = [...categories];
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      loading = false;
    }
  }

  function handleEdit(category: any) {
    selectedCategory = category;
    showForm = true;
  }

  async function handleDelete(category: any) {
    // Vérifier si la catégorie a des produits associés
    const totalProducts = category.SubCategories?.reduce((sum: number, sub: { Products?: any[] }) => sum + (sub.Products?.length || 0), 0) || 0;

    if (totalProducts > 0) {
      toast.error(`Impossible de supprimer la catégorie car ${totalProducts} produit${totalProducts > 1 ? 's' : ''} lui ${totalProducts > 1 ? 'sont associés' : 'est associé'}`, {
        duration: 5000,
        style: 'background: #fff; color: #e11d48; max-width: none;',
        className: 'border border-red-500 px-4 py-2 shadow-lg'
      });
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await axios.delete(`/api/categories/${category.id}`);
        toast.success('Catégorie supprimée avec succès');
        await loadData();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression de la catégorie';
        toast.error(errorMessage, {
          duration: 5000,
          style: 'background: #fff; color: #e11d48; max-width: none;',
          className: 'border border-red-500 px-4 py-2 shadow-lg'
        });
      }
    }
  }

  // Recherche en temps réel
  $: {
    if (categories.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        filteredCategories = categories.filter(category =>
          (category.name?.toLowerCase().includes(query)) ||
          (category.description?.toLowerCase().includes(query)) ||
          category.SubCategories?.some((sub: any) => 
            sub.name?.toLowerCase().includes(query) ||
            sub.description?.toLowerCase().includes(query)
          )
        );
      } else {
        filteredCategories = [...categories];
      }
    }
  }

  function handleSave() {
    loadData();
  }
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1>Gestion des Catégories</h1>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        on:click={() => {
          selectedCategory = null;
          showForm = true;
        }}
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
      >
        <Plus class="h-4 w-4 mr-2" />
        Nouvelle Catégorie
      </button>
    </div>
  </div>

  <div class="mt-6">
    <div class="flex gap-4 mb-4">
      <div class="relative flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Rechercher par nom, description ou sous-catégorie..."
          class="h-10 w-full pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search class="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    {:else}
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <DataTable
          {columns}
          data={filteredCategories}
          {loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    {/if}
  </div>

  <CategoryForm
    bind:show={showForm}
    category={selectedCategory}
    on:save={handleSave}
    on:close={() => {
      showForm = false;
      selectedCategory = null;
    }}
  />
</div> 