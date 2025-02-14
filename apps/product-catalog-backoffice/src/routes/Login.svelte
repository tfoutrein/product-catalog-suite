<script lang="ts">
  import { navigate } from 'svelte-routing';
  import toast from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import { auth } from '../stores/auth';

  let isLoading = false;
  let scriptLoaded = false;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  onMount(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID non défini');
      toast.error('Erreur de configuration Google Sign-In');
      return;
    }

    console.log('Initialisation Google Sign-In avec client ID:', GOOGLE_CLIENT_ID);

    // Fonction d'initialisation de Google Sign-In
    const initializeGoogleSignIn = () => {
      if (!window.google) {
        console.error('Bibliothèque Google non chargée');
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        const buttonElement = document.getElementById("googleButton");
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            { 
              theme: "outline", 
              size: "large",
              width: 280,
              text: "continue_with",
              locale: "fr"
            }
          );
        } else {
          console.error('Élément bouton Google non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de Google Sign-In:', error);
        toast.error('Erreur d\'initialisation Google Sign-In');
      }
    };

    // Chargement du script Google
    if (!scriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Script Google chargé');
        scriptLoaded = true;
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        console.error('Erreur de chargement du script Google');
        toast.error('Erreur de chargement Google Sign-In');
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  });

  async function handleCredentialResponse(response: any) {
    console.log('Réponse de Google Sign-In reçue:', response);
    try {
      isLoading = true;
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur d\'authentification');
      }

      const data = await res.json();
      console.log('Réponse du serveur:', data);
      auth.login(data.token, data.user);
      
      toast.success('Connexion réussie');
      navigate('/');
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur lors de la connexion: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 colorful:bg-gradient-to-br colorful:from-pink-100 colorful:to-purple-100">
  <div class="max-w-md w-full mx-4">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white colorful:text-transparent colorful:bg-clip-text colorful:bg-gradient-to-r colorful:from-pink-500 colorful:to-purple-600">
        Backoffice Catalogue
      </h2>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 colorful:text-purple-900">
        Connectez-vous pour accéder à l'interface d'administration
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 colorful:bg-white/50 p-8 rounded-lg shadow-lg">
      <div class="space-y-6">
        {#if isLoading}
          <div class="flex justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        {:else}
          <div class="flex flex-col items-center space-y-4">
            <div id="googleButton"></div>
            {#if !GOOGLE_CLIENT_ID}
              <p class="text-red-500 text-sm">Erreur: Client ID Google non configuré</p>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div> 