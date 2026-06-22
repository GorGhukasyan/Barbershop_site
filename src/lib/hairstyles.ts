export interface Hairstyle {
  id: string;
  nameHy: string;
  nameRu: string;
  nameEn: string;
  category: 'classic' | 'modern' | 'beard' | 'combo';
  previewImage: string;       // Reference image path in /public/images/styles/
  geminiPrompt: string;       // English prompt for Gemini
}

export const HAIRSTYLES: Hairstyle[] = [
  // ─── Classic ───────────────────────────────────────────
  {
    id: 'classic-fade',
    nameHy: 'Դասական Ֆեյդ',
    nameRu: 'Классический Фейд',
    nameEn: 'Classic Fade',
    category: 'classic',
    previewImage: '/images/styles/classic-fade.jpg',
    geminiPrompt: 'Transform the hairstyle to a classic skin fade haircut: very short sides fading to skin, medium length on top, neatly combed back or to the side. Clean, professional look.',
  },
  {
    id: 'pompadour',
    nameHy: 'Պոմպադուր',
    nameRu: 'Помпадур',
    nameEn: 'Pompadour',
    category: 'classic',
    previewImage: '/images/styles/pompadour.jpg',
    geminiPrompt: 'Transform the hairstyle to a pompadour: voluminous hair swept upward and backward from the forehead, high fade on the sides, shiny and well-groomed finish.',
  },
  {
    id: 'crew-cut',
    nameHy: 'Կրու Քաթ',
    nameRu: 'Crew Cut',
    nameEn: 'Crew Cut',
    category: 'classic',
    previewImage: '/images/styles/crew-cut.jpg',
    geminiPrompt: 'Transform the hairstyle to a crew cut: short uniform length on top, tapered sides and back, clean and masculine look.',
  },
  {
    id: 'slick-back',
    nameHy: 'Սլիք Բեք',
    nameRu: 'Слик Бэк',
    nameEn: 'Slick Back',
    category: 'classic',
    previewImage: '/images/styles/slick-back.jpg',
    geminiPrompt: 'Transform the hairstyle to a slick back: all hair combed straight back with pomade, shiny finish, undercut or high fade on the sides, elegant and refined look.',
  },
  // ─── Modern ────────────────────────────────────────────
  {
    id: 'textured-crop',
    nameHy: 'Տեքստուրդ Կրոպ',
    nameRu: 'Текстурный кроп',
    nameEn: 'Textured Crop',
    category: 'modern',
    previewImage: '/images/styles/textured-crop.jpg',
    geminiPrompt: 'Transform the hairstyle to a textured crop: short on the sides with a skin or low fade, short choppy textured top with a forward fringe, modern European style.',
  },
  {
    id: 'french-crop',
    nameHy: 'Ֆրանսիական Կրոպ',
    nameRu: 'Французский кроп',
    nameEn: 'French Crop',
    category: 'modern',
    previewImage: '/images/styles/french-crop.jpg',
    geminiPrompt: 'Transform the hairstyle to a French crop: short fringe across the forehead, textured top, faded sides, contemporary and clean cut.',
  },
  {
    id: 'undercut',
    nameHy: 'Անդըրքաթ',
    nameRu: 'Андеркат',
    nameEn: 'Undercut',
    category: 'modern',
    previewImage: '/images/styles/undercut.jpg',
    geminiPrompt: 'Transform the hairstyle to an undercut: longer hair on top styled to the side, dramatically disconnected short or shaved sides, bold and edgy look.',
  },
  {
    id: 'buzz-cut',
    nameHy: 'Բազ Քաթ',
    nameRu: 'Бокс',
    nameEn: 'Buzz Cut',
    category: 'modern',
    previewImage: '/images/styles/buzz-cut.jpg',
    geminiPrompt: 'Transform the hairstyle to a buzz cut: uniform very short length all over the head, clean and minimalist masculine look.',
  },
  // ─── Beard ─────────────────────────────────────────────
  {
    id: 'beard-full',
    nameHy: 'Լիք Մորուք',
    nameRu: 'Полная борода',
    nameEn: 'Full Beard',
    category: 'beard',
    previewImage: '/images/styles/beard-full.jpg',
    geminiPrompt: 'Keep the existing hairstyle but transform the facial hair to a full beard: thick, even, well-groomed beard covering cheeks, chin and upper lip, sharp neckline, masculine and distinguished.',
  },
  {
    id: 'beard-short',
    nameHy: 'Կարճ Մորուք',
    nameRu: 'Короткая борода',
    nameEn: 'Short Beard',
    category: 'beard',
    previewImage: '/images/styles/beard-short.jpg',
    geminiPrompt: 'Keep the existing hairstyle but transform the facial hair to a short neat stubble beard: 5mm length, clean lines, sharp cheek and neckline fade.',
  },
  // ─── Combo ─────────────────────────────────────────────
  {
    id: 'fade-beard',
    nameHy: 'Ֆեյդ + Մորուք',
    nameRu: 'Фейд + Борода',
    nameEn: 'Fade + Beard',
    category: 'combo',
    previewImage: '/images/styles/fade-beard.jpg',
    geminiPrompt: 'Transform to a low skin fade haircut with a well-groomed medium beard: the fade blends seamlessly into the beard line, creating a connected and modern barbershop look.',
  },
  {
    id: 'pompadour-beard',
    nameHy: 'Պոմպ + Մորուք',
    nameRu: 'Помп + Борода',
    nameEn: 'Pompadour + Beard',
    category: 'combo',
    previewImage: '/images/styles/pompadour-beard.jpg',
    geminiPrompt: 'Transform to a high pompadour with a full thick beard: voluminous quiff on top, high fade sides, full groomed beard. Classic barbershop combination, distinguished and stylish.',
  },
];

export function getHairstyleById(id: string): Hairstyle | undefined {
  return HAIRSTYLES.find(h => h.id === id);
}