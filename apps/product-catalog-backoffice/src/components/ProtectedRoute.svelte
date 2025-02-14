<script lang="ts">
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { auth } from '../stores/auth';

  export let path: string;

  onMount(() => {
    const unsubscribe = auth.subscribe(({ isAuthenticated }) => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<slot></slot> 