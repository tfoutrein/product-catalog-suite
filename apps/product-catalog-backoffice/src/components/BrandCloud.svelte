<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';

  interface Product {
    id: string;
    name: string;
    brand?: string;
  }

  interface BrandCount {
    brand: string;
    count: number;
  }

  let brands: BrandCount[] = [];
  let container: HTMLDivElement;
  let logos: HTMLDivElement[] = [];
  let animationFrameId: number;

  // Configuration de l'animation
  const config = {
    maxSpeed: 0.5,
    minSpeed: 0.2,
    maxSize: 100,
    minSize: 40,
    maxOpacity: 0.9,
    minOpacity: 0.5
  };

  interface Logo {
    element: HTMLDivElement;
    x: number;
    y: number;
    speedX: number;
    speedY: number;
    size: number;
    opacity: number;
  }

  let logoObjects: Logo[] = [];

  async function fetchBrands() {
    try {
      const response = await axios.get<Product[]>('/api/products');
      const products = response.data;
      
      // Compter le nombre de produits par marque
      const brandCounts = new Map<string, number>();
      products.forEach(product => {
        if (product.brand && product.brand.trim() !== '') {
          brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
        }
      });

      // Convertir en tableau et trier par nombre de produits décroissant
      brands = Array.from(brandCounts.entries())
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Limiter à 20 marques
    } catch (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      brands = [];
    }
  }

  function initializeLogos() {
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    logoObjects = [];

    // Calculer une grille virtuelle pour répartir les logos
    const numLogos = logos.length;
    const numCols = Math.ceil(Math.sqrt(numLogos));
    const numRows = Math.ceil(numLogos / numCols);
    const cellWidth = width / numCols;
    const cellHeight = height / numRows;

    // Trouver le nombre maximum de produits pour la normalisation
    const maxCount = Math.max(...brands.map(b => b.count));

    logos.forEach((logo, index) => {
      // Calculer la taille en fonction du nombre de produits
      const count = brands[index].count;
      const sizeRatio = count / maxCount;
      const size = config.minSize + (config.maxSize - config.minSize) * sizeRatio;
      
      // L'opacité est aussi influencée par le nombre de produits
      const opacity = config.minOpacity + (config.maxOpacity - config.minOpacity) * sizeRatio;
      
      // Calculer la position dans la grille
      const col = index % numCols;
      const row = Math.floor(index / numCols);
      
      // Ajouter un décalage aléatoire dans la cellule pour plus de naturel
      const offsetX = (Math.random() - 0.5) * (cellWidth * 0.3);
      const offsetY = (Math.random() - 0.5) * (cellHeight * 0.3);
      
      // Calculer la position finale
      const x = (col * cellWidth) + (cellWidth - size) / 2 + offsetX;
      const y = (row * cellHeight) + (cellHeight - size) / 2 + offsetY;

      // Appliquer immédiatement la position et la taille
      logo.style.transform = `translate(${x}px, ${y}px)`;
      logo.style.width = `${size}px`;
      logo.style.height = `${size}px`;
      logo.style.opacity = opacity.toString();
      
      logoObjects.push({
        element: logo,
        x: Math.max(0, Math.min(width - size, x)),
        y: Math.max(0, Math.min(height - size, y)),
        speedX: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed) * (Math.random() > 0.5 ? 1 : -1),
        size,
        opacity
      });
    });
  }

  function animate() {
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    logoObjects.forEach(logo => {
      // Mise à jour des positions
      logo.x += logo.speedX;
      logo.y += logo.speedY;

      // Rebond sur les bords
      if (logo.x <= 0 || logo.x >= width - logo.size) {
        logo.speedX *= -1;
      }
      if (logo.y <= 0 || logo.y >= height - logo.size) {
        logo.speedY *= -1;
      }

      // Application des nouvelles positions
      logo.element.style.transform = `translate(${logo.x}px, ${logo.y}px)`;
      logo.element.style.width = `${logo.size}px`;
      logo.element.style.height = `${logo.size}px`;
      logo.element.style.opacity = logo.opacity.toString();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  onMount(() => {
    fetchBrands().then(() => {
      initializeLogos();
      animate();
    });

    const resizeObserver = new ResizeObserver(() => {
      initializeLogos();
    });

    resizeObserver.observe(container);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
    };
  });

  function handleLogoError(e: Event) {
    const target = e.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
</script>

<div 
  bind:this={container}
  class="relative w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 colorful:from-pink-100/50 colorful:via-purple-100/50 colorful:to-pink-100/50 rounded-lg overflow-hidden"
  style="
    box-shadow: 
      inset calc(var(--depth-value) * 20px) calc(var(--depth-value) * 20px) calc(var(--depth-value) * 40px) rgba(0, 0, 0, calc(var(--depth-value) * 0.2)),
      inset calc(var(--depth-value) * -5px) calc(var(--depth-value) * -5px) calc(var(--depth-value) * 20px) rgba(255, 255, 255, calc(var(--depth-value) * 0.1));
    transform: translateZ(calc(var(--depth-value) * -1px));
  "
>
  {#if brands.length > 0}
    {#each brands as {brand, count}}
      <div
        bind:this={logos[brands.findIndex(b => b.brand === brand)]}
        class="absolute"
        title="{brand} ({count} produit{count > 1 ? 's' : ''})"
      >
        <img
          src={`https://logo.clearbit.com/${brand.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`}
          alt={`Logo ${brand}`}
          class="w-full h-full object-contain colorful:bg-transparent bg-transparent p-2 hover:scale-110 transition-transform duration-300"
          on:error={handleLogoError}
        />
      </div>
    {/each}
  {:else}
    <div class="flex items-center justify-center h-full">
      <p class="text-gray-500 dark:text-gray-400 colorful:text-purple-900 text-center">
        Aucune marque disponible
      </p>
    </div>
  {/if}
</div> 