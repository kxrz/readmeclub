/**
 * Collection de gradients élégants basés sur la palette de couleurs fournie
 * Palette: olive-leaf (#606c38), black-forest (#283618), cornsilk (#fefae0), 
 * sunlit-clay (#dda15e), copperwood (#bc6c25)
 */
export const gradientPalettes = [
  // Palette 1: Olive Leaf → Black Forest
  {
    from: '#606c38', // olive-leaf
    to: '#283618',   // black-forest
    text: '#fefae0', // cornsilk
  },
  // Palette 2: Cornsilk → Sunlit Clay
  {
    from: '#fefae0', // cornsilk
    to: '#dda15e',   // sunlit-clay
    text: '#283618', // black-forest
  },
  // Palette 3: Sunlit Clay → Copperwood
  {
    from: '#dda15e', // sunlit-clay
    to: '#bc6c25',   // copperwood
    text: '#fefae0', // cornsilk
  },
  // Palette 4: Black Forest → Olive Leaf
  {
    from: '#283618', // black-forest
    to: '#606c38',   // olive-leaf
    text: '#fefae0', // cornsilk
  },
  // Palette 5: Copperwood → Sunlit Clay
  {
    from: '#bc6c25', // copperwood
    to: '#dda15e',   // sunlit-clay
    text: '#fefae0', // cornsilk
  },
  // Palette 6: Olive Leaf → Sunlit Clay
  {
    from: '#606c38', // olive-leaf
    to: '#dda15e',   // sunlit-clay
    text: '#283618', // black-forest
  },
  // Palette 7: Black Forest → Copperwood
  {
    from: '#283618', // black-forest
    to: '#bc6c25',   // copperwood
    text: '#fefae0', // cornsilk
  },
  // Palette 8: Cornsilk → Olive Leaf
  {
    from: '#fefae0', // cornsilk
    to: '#606c38',   // olive-leaf
    text: '#283618', // black-forest
  },
  // Palette 9: Sunlit Clay → Black Forest
  {
    from: '#dda15e', // sunlit-clay
    to: '#283618',   // black-forest
    text: '#fefae0', // cornsilk
  },
  // Palette 10: Copperwood → Olive Leaf
  {
    from: '#bc6c25', // copperwood
    to: '#606c38',   // olive-leaf
    text: '#fefae0', // cornsilk
  },
] as const;

/**
 * Génère un gradient basé sur un ID (hash simple)
 * Garantit que le même ID produit toujours le même gradient
 */
export function getGradientForId(id: string): typeof gradientPalettes[number] {
  // Hash simple de l'ID pour obtenir un index stable
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % gradientPalettes.length;
  return gradientPalettes[index];
}

/**
 * Génère une classe Tailwind CSS pour un gradient
 */
export function getGradientClasses(id: string): {
  bg: string;
  text: string;
} {
  const palette = getGradientForId(id);
  return {
    bg: `linear-gradient(135deg, ${palette.from} 0%, ${palette.to} 100%)`,
    text: palette.text,
  };
}
