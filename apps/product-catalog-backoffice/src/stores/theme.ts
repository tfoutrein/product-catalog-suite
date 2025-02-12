import { writable } from 'svelte/store';

type ThemeMode = 'light' | 'dark' | 'colorful';

// Récupérer le thème depuis le localStorage ou utiliser la valeur par défaut
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as ThemeMode : 'light';
const defaultTheme: ThemeMode = storedTheme || 'light';

// Store pour la profondeur (depth)
const storedDepth = typeof window !== 'undefined' ? Number(localStorage.getItem('depth')) || 50 : 50;
export const depth = writable<number>(storedDepth);

export const theme = writable<ThemeMode>(defaultTheme);

// Mettre à jour la classe du document et sauvegarder dans le localStorage
theme.subscribe(value => {
  if (typeof window !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark', 'colorful');
    document.documentElement.classList.add(value);
    localStorage.setItem('theme', value);
  }
});

// Sauvegarder la profondeur dans le localStorage
depth.subscribe(value => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('depth', value.toString());
    // Mettre à jour la variable CSS personnalisée
    document.documentElement.style.setProperty('--depth-value', (value / 100).toString());
  }
}); 