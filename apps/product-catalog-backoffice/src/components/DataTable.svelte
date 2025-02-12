<script lang="ts">
  import { Circle2 } from 'svelte-loading-spinners';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  export let columns: { key: string; label: string; type?: string }[] = [];
  export let data: any[] = [];
  export let loading = false;
  export let page = 1;
  export let totalPages = 1;
  export let onPageChange: (page: number) => void;
  export let onEdit: (item: any) => void;
  export let onDelete: (item: any) => void;

  $: startIndex = (page - 1) * 10;
  $: endIndex = Math.min(startIndex + 10, data.length);

  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    if (target) {
      target.src = '/placeholder-product.svg';
    }
  };

  const getBrandLogo = (brandName: string) => {
    if (!brandName) return '';
    return `https://logo.clearbit.com/${brandName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`;
  };

  const handleBrandLogoError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  };
</script>

<div class="table w-full">
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <Circle2 
        size="60" 
        unit="px"
        colorOuter="#0ea5e9"
        colorCenter="#0ea5e9"
        colorInner="#0ea5e9"
      />
    </div>
  {:else}
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="table-header">
        <tr>
          {#each columns as column}
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 [html.colorful_&]:text-white">
              {column.label}
            </th>
          {/each}
          <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300 [html.colorful_&]:text-white">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700 [html.colorful_&]:divide-white/10">
        {#each data.slice(startIndex, endIndex) as item}
          <tr class="table-row">
            {#each columns as column}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 [html.colorful_&]:text-white">
                {#if column.type === 'image'}
                  <div class="flex items-center">
                    <div class="relative group">
                      <img
                        src={item[column.key] || '/placeholder-product.svg'}
                        alt={item.name}
                        class="h-10 w-10 rounded-full object-cover bg-gray-100 dark:bg-gray-700 cursor-pointer transition-transform duration-300 ease-in-out origin-center"
                        on:error={handleImageError}
                      />
                      <div class="absolute opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-[4] left-0 top-0 z-[9999] transition-all duration-300 ease-in-out origin-top-left">
                        <img
                          src={item[column.key] || '/placeholder-product.svg'}
                          alt={item.name}
                          class="h-10 w-10 rounded-lg object-cover shadow-xl"
                          on:error={handleImageError}
                        />
                      </div>
                    </div>
                  </div>
                {:else if column.key === 'brand'}
                  <div class="flex items-center space-x-2">
                    {#if item[column.key]}
                      <div class="relative group">
                        <img
                          src={getBrandLogo(item[column.key])}
                          alt="Logo {item[column.key]}"
                          class="h-5 w-5 object-contain bg-white rounded-sm cursor-pointer transition-transform duration-300 ease-in-out origin-center"
                          on:error={handleBrandLogoError}
                        />
                        <div class="absolute opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-[4] left-0 top-0 z-[9999] transition-all duration-300 ease-in-out origin-top-left">
                          <img
                            src={getBrandLogo(item[column.key])}
                            alt="Logo {item[column.key]}"
                            class="h-5 w-5 object-contain bg-white rounded-sm shadow-xl"
                            on:error={handleBrandLogoError}
                          />
                        </div>
                      </div>
                    {/if}
                    <span>{item[column.key]}</span>
                  </div>
                {:else}
                  {item[column.key]}
                {/if}
              </td>
            {/each}
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                on:click={() => onEdit(item)}
                class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 [html.colorful_&]:text-white [html.colorful_&]:hover:text-white/80 mr-3"
              >
                Modifier
              </button>
              {#if onDelete}
                <button
                  on:click={() => onDelete(item)}
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 [html.colorful_&]:text-white [html.colorful_&]:hover:text-white/80"
                >
                  Supprimer
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="bg-white dark:bg-gray-800 colorful:bg-transparent px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          on:click={() => onPageChange(page - 1)}
          disabled={page === 1}
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 colorful:text-white bg-white dark:bg-gray-700 colorful:bg-white/10 hover:bg-gray-50 dark:hover:bg-gray-600 colorful:hover:bg-white/20 disabled:opacity-50"
        >
          Précédent
        </button>
        <button
          on:click={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 colorful:text-white bg-white dark:bg-gray-700 colorful:bg-white/10 hover:bg-gray-50 dark:hover:bg-gray-600 colorful:hover:bg-white/20 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300 colorful:text-white">
            Affichage de <span class="font-medium">{startIndex + 1}</span> à{" "}
            <span class="font-medium">{endIndex}</span> sur{" "}
            <span class="font-medium">{data.length}</span> résultats
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              on:click={() => onPageChange(page - 1)}
              disabled={page === 1}
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 colorful:bg-white/10 text-sm font-medium text-gray-500 dark:text-gray-300 colorful:text-white hover:bg-gray-50 dark:hover:bg-gray-600 colorful:hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <button
              on:click={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 colorful:bg-white/10 text-sm font-medium text-gray-500 dark:text-gray-300 colorful:text-white hover:bg-gray-50 dark:hover:bg-gray-600 colorful:hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  {/if}
</div> 