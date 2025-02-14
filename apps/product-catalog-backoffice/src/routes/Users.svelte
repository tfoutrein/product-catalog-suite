<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import toast from 'svelte-french-toast';
  import { Search } from 'lucide-svelte';
  import DataTable from '../components/DataTable.svelte';

  interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
    createdAt: string;
    updatedAt: string;
  }

  let users: User[] = [];
  let filteredUsers: User[] = [];
  let loading = true;
  let searchQuery = '';
  let page = 1;
  let totalPages = 1;

  const columns = [
    { key: 'picture', label: 'Avatar', type: 'image' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Date d\'inscription' }
  ];

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      const response = await axios.get('/api/users');
      users = response.data.map((user: User) => ({
        ...user,
        createdAt: new Date(user.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      filteredUsers = [...users];
      updatePagination();
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      loading = false;
    }
  }

  function updatePagination() {
    totalPages = Math.ceil(filteredUsers.length / 10);
    page = 1;
  }

  // Recherche en temps réel
  $: {
    if (users.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        filteredUsers = users.filter(user => 
          user.name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query)
        );
      } else {
        filteredUsers = [...users];
      }
      updatePagination();
    }
  }
</script>

<div>
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1>Utilisateurs Connectés</h1>
      <p class="mt-2 text-sm text-gray-700 dark:text-gray-300 colorful:text-purple-900">
        Liste des utilisateurs qui se sont connectés à l'application
      </p>
    </div>
  </div>

  <div class="mt-6">
    <div class="flex gap-4 mb-4">
      <div class="relative flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Rechercher par nom ou email..."
          class="h-10 w-full pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search class="h-4 w-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>

    <DataTable
      {columns}
      data={filteredUsers}
      {loading}
      {page}
      {totalPages}
      onPageChange={(newPage) => page = newPage}
    />
  </div>
</div> 