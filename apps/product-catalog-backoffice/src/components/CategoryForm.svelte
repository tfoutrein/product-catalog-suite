<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';
  import toast from 'svelte-french-toast';
  import axios from 'axios';

  interface SubCategory {
    id?: string;
    name: string;
    description: string;
  }

  interface Category {
    id?: string;
    name: string;
    description: string;
    SubCategories?: SubCategory[];
  }

  export let category: Category | null = null;
  export let show = false;

  const dispatch = createEventDispatcher();

  let loading = false;

  interface CategoryFormData {
    name: string;
    description: string;
    SubCategories: SubCategory[];
  }

  let formData: CategoryFormData = {
    name: '',
    description: '',
    SubCategories: []
  };

  let newSubCategory: SubCategory = { name: '', description: '' };

  // Initialisation du formulaire quand il s'ouvre
  function initializeForm() {
    if (category) {
      formData = {
        name: category.name || '',
        description: category.description || '',
        SubCategories: category.SubCategories ? [...category.SubCategories] : []
      };
    } else {
      formData = {
        name: '',
        description: '',
        SubCategories: []
      };
    }
  }

  $: if (show) {
    initializeForm();
  }

  function close() {
    show = false;
    dispatch('close');
  }

  function addSubCategory() {
    if (newSubCategory.name) {
      formData.SubCategories = [...formData.SubCategories, { ...newSubCategory }];
      newSubCategory = { name: '', description: '' };
    } else {
      toast.error('Le nom de la sous-catégorie est requis');
    }
  }

  function removeSubCategory(index: number) {
    formData.SubCategories = formData.SubCategories.filter((_, i) => i !== index);
  }

  async function handleSubmit() {
    try {
      if (!formData.name) {
        toast.error('Le nom de la catégorie est requis');
        return;
      }

      loading = true;

      if (category) {
        await axios.put(`/api/categories/${category.id}`, formData);
        toast.success('Catégorie mise à jour avec succès');
      } else {
        await axios.post('/api/categories', formData);
        toast.success('Catégorie créée avec succès');
      }
      dispatch('save');
      close();
    } catch (error: any) {
      console.error('Erreur:', error.response?.data || error);
      toast.error('Erreur lors de l\'enregistrement de la catégorie');
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSubCategory();
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
          {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
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
          <div>
            <label for="category_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
            <input
              type="text"
              id="category_name"
              bind:value={formData.name}
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="category_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="category_description"
              bind:value={formData.description}
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div class="mt-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Sous-catégories</h4>
              <span class="text-xs text-gray-500 dark:text-gray-400">Appuyez sur Entrée pour ajouter</span>
            </div>

            <div class="space-y-3">
              {#if formData.SubCategories.length > 0}
                {#each formData.SubCategories as subCategory, i}
                  <div class="flex items-center space-x-2">
                    <div class="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        bind:value={subCategory.name}
                        class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        bind:value={subCategory.description}
                        class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      on:click={() => removeSubCategory(i)}
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X class="h-5 w-5" />
                    </button>
                  </div>
                {/each}
              {:else}
                <p class="text-sm text-gray-500 dark:text-gray-400 italic">Aucune sous-catégorie</p>
              {/if}

              <div class="flex items-center space-x-2 pt-4">
                <div class="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    bind:value={newSubCategory.name}
                    placeholder="Nom de la sous-catégorie"
                    on:keypress={handleKeyPress}
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    bind:value={newSubCategory.description}
                    placeholder="Description (optionnelle)"
                    on:keypress={handleKeyPress}
                    class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                <button
                  type="button"
                  on:click={addSubCategory}
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Ajouter
                </button>
              </div>
            </div>
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