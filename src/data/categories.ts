export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'icons', name: 'Icons', icon: '✨' },
  { id: 'pools', name: 'Amazing pools', icon: '🏊' },
  { id: 'beachfront', name: 'Beachfront', icon: '🏖️' },
  { id: 'cabins', name: 'Cabins', icon: '🏡' },
  { id: 'mansions', name: 'Mansions', icon: '🏰' },
  { id: 'omg', name: 'OMG!', icon: '🛸' },
  { id: 'countryside', name: 'Countryside', icon: '🌄' },
  { id: 'lakefront', name: 'Lakefront', icon: '🏞️' },
  { id: 'islands', name: 'Islands', icon: '🏝️' },
  { id: 'boats', name: 'Boats', icon: '⛵' },
  { id: 'camping', name: 'Camping', icon: '🏕️' },
  { id: 'tropical', name: 'Tropical', icon: '🌴' },
  { id: 'treehouses', name: 'Treehouses', icon: '🌲' },
  { id: 'vineyards', name: 'Vineyards', icon: '🍷' },
  { id: 'historical', name: 'Historical homes', icon: '🏛️' },
];
