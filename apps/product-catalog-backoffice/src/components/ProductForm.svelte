<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';
  import toast from 'svelte-french-toast';
  import axios from 'axios';
  import { Circle2 } from 'svelte-loading-spinners';

  interface SubCategory {
    id: string;
    name: string;
    description?: string;
  }

  interface Category {
    id: string;
    name: string;
    description?: string;
    SubCategories?: SubCategory[];
  }

  export let product: any = null;
  export let categories: Category[] = [];
  export let show = false;

  const dispatch = createEventDispatcher();

  let loading = false;

  interface ProductFormData {
    id?: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    image_url: string;
    weight_volume: string;
    sub_category_id: string;
    attributes: Array<{ name: string; value: string }>;
  }

  let formData: ProductFormData = {
    name: '',
    description: '',
    price: 0,
    brand: '',
    image_url: '',
    weight_volume: '',
    sub_category_id: '',
    attributes: []
  };

  let newAttribute = { name: '', value: '' };
  let selectedCategoryId = '';
  let subCategories: SubCategory[] = [];

  let brandLogo = '';

  let generatingDescription = false;

  // Initialisation du formulaire
  function initializeForm() {
    if (product) {
      formData = {
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        brand: product.brand || '',
        image_url: product.image_url || '',
        weight_volume: product.weight_volume || '',
        sub_category_id: product.sub_category_id || '',
        attributes: product.attributes ? [...product.attributes] : []
      };

      if (product.sub_category_id) {
        const category = categories.find(cat => 
          cat.SubCategories?.some((sub: SubCategory) => sub.id === product.sub_category_id)
        );
        if (category) {
          selectedCategoryId = category.id;
          subCategories = category.SubCategories || [];
        }
      }
    } else {
      formData = {
        name: '',
        description: '',
        price: 0,
        brand: '',
        image_url: '',
        weight_volume: '',
        sub_category_id: '',
        attributes: []
      };
      selectedCategoryId = '';
      subCategories = [];
    }
  }

  $: if (show) {
    initializeForm();
  }

  $: if (selectedCategoryId) {
    const category = categories.find(cat => cat.id === selectedCategoryId);
    if (category) {
      subCategories = category.SubCategories || [];
      if (!subCategories.some(sub => sub.id === formData.sub_category_id)) {
        formData.sub_category_id = '';
      }
    }
  } else {
    subCategories = [];
    formData.sub_category_id = '';
  }

  function close() {
    show = false;
    dispatch('close');
  }

  function addAttribute() {
    if (newAttribute.name && newAttribute.value) {
      formData.attributes = [...formData.attributes, { ...newAttribute }];
      newAttribute = { name: '', value: '' };
    } else {
      toast.error('Le nom et la valeur de l\'attribut sont requis');
    }
  }

  function removeAttribute(index: number) {
    formData.attributes = formData.attributes.filter((_, i) => i !== index);
  }

  async function handleSubmit() {
    try {
      if (!formData.sub_category_id) {
        toast.error('Veuillez sélectionner une sous-catégorie');
        return;
      }

      loading = true;
      console.log('Données envoyées:', formData);

      if (product) {
        const response = await axios.put(`/api/products/${product.id}`, formData);
        console.log('Réponse du serveur:', response.data);
        toast.success('Produit mis à jour avec succès');
      } else {
        const response = await axios.post('/api/products', formData);
        console.log('Réponse du serveur:', response.data);
        toast.success('Produit créé avec succès');
      }
      dispatch('save');
      close();
    } catch (error: any) {
      console.error('Erreur:', error.response?.data || error);
      toast.error('Erreur lors de l\'enregistrement du produit');
    } finally {
      loading = false;
    }
  }

  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    if (target) {
      target.src = '/placeholder-product.svg';
    }
  };

  async function fetchBrandLogo(brandName: string) {
    if (!brandName) {
      brandLogo = '';
      return;
    }
    try {
      brandLogo = `https://logo.clearbit.com/${brandName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`;
    } catch (error) {
      console.error('Erreur lors de la récupération du logo:', error);
      brandLogo = '';
    }
  }

  const handleBrandLogoError = () => {
    brandLogo = '';
  };

  $: if (formData.brand) {
    fetchBrandLogo(formData.brand);
  }

  async function generateDescription() {
    if (!formData.name) {
      toast.error('Le nom du produit est requis pour générer une description');
      return;
    }
    
    try {
      generatingDescription = true;
      
      // Lancer la requête de description
      const descriptionPromise = axios.post('/api/descriptions/generate', {
        name: formData.name,
        brand: formData.brand
      });

      // Lancer la détection de marque en parallèle si pas de marque
      if (!formData.brand) {
        const brandToast = toast.loading('Détection de la marque...');
        axios.post('/api/brands/detect', { name: formData.name })
          .then(response => {
            if (response.data?.brand) {
              formData.brand = response.data.brand;
              toast.success('Marque détectée : ' + response.data.brand, { id: brandToast });
            } else {
              toast.error('Aucune marque détectée', { id: brandToast });
            }
          })
          .catch(error => {
            console.error('Erreur lors de la détection de la marque:', error);
            toast.error('Erreur lors de la détection de la marque', { id: brandToast });
          });
      }

      // Afficher un toast pour indiquer que la génération est en cours
      const loadingToast = toast.loading('Génération de la description en cours...');

      // Attendre la réponse de la description
      const response = await descriptionPromise;

      if (response.data) {
        // Mettre à jour la description immédiatement si disponible
        if (response.data.description) {
          formData.description = response.data.description;
          toast.success('Description générée avec succès', { id: loadingToast });
        }

        // Mettre à jour l'image si disponible
        if (response.data.imageUrl) {
          formData.image_url = response.data.imageUrl;
        }
      } else {
        throw new Error('Aucune description générée');
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la description:', error);
      toast.error('Erreur lors de la génération de la description');
    } finally {
      generatingDescription = false;
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
          {product ? 'Modifier le produit' : 'Nouveau produit'}
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
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <div class="mt-1 flex space-x-2">
              <textarea
                id="description"
                bind:value={formData.description}
                rows="3"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              <button
                type="button"
                on:click={generateDescription}
                disabled={!formData.name || generatingDescription}
                class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {#if generatingDescription}
                  <Circle2 
                    size="16"
                    unit="px"
                    colorOuter="#0ea5e9"
                    colorCenter="#0ea5e9"
                  />
                {:else}
                  Générer par IA
                {/if}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Prix</label>
              <input
                type="number"
                id="price"
                bind:value={formData.price}
                min="0"
                step="0.01"
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="brand" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Marque</label>
              <div class="mt-1 flex items-center space-x-4">
                {#if brandLogo}
                  <div class="relative group">
                    <img
                      src={brandLogo}
                      alt="Logo {formData.brand}"
                      class="h-8 w-8 object-contain bg-white rounded-md"
                      on:error={handleBrandLogoError}
                    />
                    <div class="absolute opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-[4] left-0 top-0 z-[9999] transition-all duration-300 ease-in-out origin-top-left">
                      <img
                        src={brandLogo}
                        alt="Logo {formData.brand}"
                        class="h-8 w-8 object-contain bg-white rounded-lg shadow-xl"
                        on:error={handleBrandLogoError}
                      />
                    </div>
                  </div>
                {/if}
                <input
                  type="text"
                  id="brand"
                  bind:value={formData.brand}
                  class="block flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label for="image_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL de l'image</label>
            <div class="mt-1 flex items-center space-x-4">
              <input
                type="url"
                id="image_url"
                bind:value={formData.image_url}
                class="block flex-1 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
              <div class="relative group">
                <img
                  src={formData.image_url || '/placeholder-product.svg'}
                  alt="Aperçu du produit"
                  class="h-10 w-10 rounded-full object-cover bg-gray-100 dark:bg-gray-700 cursor-pointer transition-transform duration-300 ease-in-out origin-center"
                  on:error={handleImageError}
                />
                <div class="absolute opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-[4] right-0 top-0 z-[9999] transition-all duration-300 ease-in-out origin-top-right">
                  <img
                    src={formData.image_url || '/placeholder-product.svg'}
                    alt="Aperçu du produit"
                    class="h-10 w-10 rounded-lg object-cover shadow-xl"
                    on:error={handleImageError}
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
              <select
                id="category"
                bind:value={selectedCategoryId}
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Sélectionner une catégorie</option>
                {#each categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
            </div>

            <div>
              <label for="sub_category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Sous-catégorie</label>
              <select
                id="sub_category"
                bind:value={formData.sub_category_id}
                required
                disabled={!selectedCategoryId}
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <option value="">Sélectionner une sous-catégorie</option>
                {#each subCategories as subCategory}
                  <option value={subCategory.id}>{subCategory.name}</option>
                {/each}
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Attributs</label>
            <div class="mt-2 space-y-2">
              {#if formData.attributes && formData.attributes.length > 0}
                {#each formData.attributes as attr, i}
                  <div class="flex items-center space-x-2">
                    <input
                      type="text"
                      bind:value={attr.name}
                      class="block w-1/3 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      bind:value={attr.value}
                      class="block w-1/3 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      on:click={() => removeAttribute(i)}
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X class="h-5 w-5" />
                    </button>
                  </div>
                {/each}
              {:else}
                <p class="text-sm text-gray-500 dark:text-gray-400 italic">Aucun attribut</p>
              {/if}

              <div class="flex items-center space-x-2 pt-4">
                <input
                  type="text"
                  bind:value={newAttribute.name}
                  placeholder="Nom"
                  class="block w-1/3 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <input
                  type="text"
                  bind:value={newAttribute.value}
                  placeholder="Valeur"
                  class="block w-1/3 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  type="button"
                  on:click={addAttribute}
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