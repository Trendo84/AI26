export type Breed = {
  id: string;
  name: string;
  emoji: string;
  origin: string;
  categories: string[];
  traits: {
    affection: number;
    energy: number;
    grooming: number;
    intelligence: number;
    vocalization: number;
  };
  description: string;
  care: string;
  temperament: string[];
  lifespan: string;
  weight: string;
};

export const breeds: Breed[] = [
  {
    id: 'british-shorthair',
    name: 'British Shorthair',
    emoji: '🐱',
    origin: 'United Kingdom',
    categories: ['popular', 'shorthair'],
    traits: { affection: 4, energy: 2, grooming: 2, intelligence: 4, vocalization: 2 },
    description: 'The British Shorthair is known for its sturdy body, dense coat, and easy-going personality. Often called the "teddy bear" of cats, they have a round face with full cheeks and large, round eyes. British Shorthairs are calm, dignified cats that make excellent companions.',
    care: 'British Shorthairs require minimal grooming despite their thick coat. Weekly brushing is sufficient, increasing to daily during shedding season. They can be prone to obesity, so monitor food intake and encourage play. Generally healthy, but watch for heart conditions like HCM.',
    temperament: ['Calm', 'Affectionate', 'Independent', 'Dignified'],
    lifespan: '12-20 years',
    weight: '9-18 lbs',
  },
  {
    id: 'maine-coon',
    name: 'Maine Coon',
    emoji: '🦁',
    origin: 'United States',
    categories: ['popular', 'longhair', 'large'],
    traits: { affection: 5, energy: 3, grooming: 4, intelligence: 5, vocalization: 3 },
    description: 'One of the largest domesticated cat breeds, Maine Coons are gentle giants known for their dog-like personalities. They have long, shaggy coats, tufted ears, and bushy tails. Extremely social and playful, they often follow their owners around the house.',
    care: 'Their long coat requires daily brushing to prevent matting. Maine Coons are generally healthy but can be prone to hip dysplasia and heart disease. They need plenty of space to roam and climb. Regular play sessions help maintain a healthy weight.',
    temperament: ['Gentle', 'Playful', 'Social', 'Intelligent'],
    lifespan: '12-15 years',
    weight: '13-25 lbs',
  },
  {
    id: 'siamese',
    name: 'Siamese',
    emoji: '😺',
    origin: 'Thailand',
    categories: ['popular', 'shorthair', 'vocal'],
    traits: { affection: 5, energy: 5, grooming: 1, intelligence: 5, vocalization: 5 },
    description: 'Siamese cats are famous for their distinctive color points, blue almond-shaped eyes, and vocal nature. One of the oldest and most recognizable breeds, they are extremely social, intelligent, and form strong bonds with their families.',
    care: 'Low grooming needs with their short coat - weekly brushing suffices. Siamese cats need extensive mental and physical stimulation. Puzzle toys and interactive play are essential. They can suffer from separation anxiety if left alone too long.',
    temperament: ['Vocal', 'Social', 'Demanding', 'Loyal'],
    lifespan: '15-20 years',
    weight: '6-14 lbs',
  },
  {
    id: 'persian',
    name: 'Persian',
    emoji: '😸',
    origin: 'Iran (Persia)',
    categories: ['popular', 'longhair'],
    traits: { affection: 4, energy: 1, grooming: 5, intelligence: 3, vocalization: 1 },
    description: 'Persians are known for their luxurious long coats, flat faces, and calm personalities. They are gentle, quiet cats that prefer a serene environment. With their sweet expressions and laid-back nature, they make ideal indoor companions.',
    care: 'Requires daily grooming to prevent severe matting and hairballs. Their flat faces need regular cleaning around eyes and nose. Prone to dental and respiratory issues. Keep strictly indoors. Regular vet checkups essential.',
    temperament: ['Calm', 'Sweet', 'Quiet', 'Gentle'],
    lifespan: '12-17 years',
    weight: '7-12 lbs',
  },
  {
    id: 'bengal',
    name: 'Bengal',
    emoji: '🐆',
    origin: 'United States',
    categories: ['popular', 'shorthair', 'active'],
    traits: { affection: 4, energy: 5, grooming: 2, intelligence: 5, vocalization: 4 },
    description: 'Bengals have wild leopard-like markings and incredibly athletic builds. Developed by crossing domestic cats with Asian Leopard Cats, they retain some wild instincts. Highly energetic, curious, and playful.',
    care: 'Minimal grooming needed. Bengals require extensive exercise and mental stimulation - cat trees, puzzle toys, and interactive play are must-haves. Can be destructive if bored. Need secure spaces as they\'re excellent escape artists.',
    temperament: ['Active', 'Playful', 'Curious', 'Athletic'],
    lifespan: '12-16 years',
    weight: '8-15 lbs',
  },
  {
    id: 'ragdoll',
    name: 'Ragdoll',
    emoji: '🤍',
    origin: 'United States',
    categories: ['popular', 'longhair', 'large'],
    traits: { affection: 5, energy: 2, grooming: 3, intelligence: 4, vocalization: 2 },
    description: 'Named for their tendency to go limp when picked up, Ragdolls are large, docile cats with striking blue eyes and semi-long coats. They are extremely affectionate, following owners from room to room.',
    care: 'Their silky coat is less prone to matting but weekly brushing recommended. Ragdolls are trusting - keep them indoors only. They can be prone to heart disease (HCM) and bladder stones. Regular play helps prevent obesity.',
    temperament: ['Docile', 'Affectionate', 'Trusting', 'Gentle'],
    lifespan: '13-18 years',
    weight: '10-20 lbs',
  },
  {
    id: 'scottish-fold',
    name: 'Scottish Fold',
    emoji: '🥺',
    origin: 'Scotland',
    categories: ['popular', 'shorthair'],
    traits: { affection: 5, energy: 3, grooming: 2, intelligence: 4, vocalization: 2 },
    description: 'Instantly recognizable by their folded ears, Scottish Folds have round faces and owl-like expressions. They are sweet-natured, adaptable cats that bond closely with their families.',
    care: 'Weekly brushing for shorthair variety. Ear structure requires regular cleaning. The gene causing folded ears can also cause joint issues. Ethical breeding and regular vet checkups are crucial.',
    temperament: ['Sweet', 'Adaptable', 'Friendly', 'Playful'],
    lifespan: '11-15 years',
    weight: '6-13 lbs',
  },
  {
    id: 'sphynx',
    name: 'Sphynx',
    emoji: '👽',
    origin: 'Canada',
    categories: ['rare', 'shorthair'],
    traits: { affection: 5, energy: 4, grooming: 4, intelligence: 5, vocalization: 3 },
    description: 'Hairless and wrinkled, the Sphynx is warm to the touch and extremely affectionate. Despite their alien appearance, they are friendly, energetic, and love attention. Known for mischievous, dog-like personalities.',
    care: 'Requires weekly baths to remove oil buildup. They get cold easily - provide warm spaces. Need sun protection. Ears produce more wax. High energy - need lots of interactive play. Monitor for heart conditions.',
    temperament: ['Affectionate', 'Energetic', 'Mischievous', 'Social'],
    lifespan: '13-15 years',
    weight: '6-12 lbs',
  },
  {
    id: 'russian-blue',
    name: 'Russian Blue',
    emoji: '💙',
    origin: 'Russia',
    categories: ['popular', 'shorthair'],
    traits: { affection: 3, energy: 3, grooming: 2, intelligence: 5, vocalization: 2 },
    description: 'Known for their silvery-blue coat and emerald green eyes, Russian Blues are elegant and reserved. They can be shy with strangers but are devoted to their families. Intelligent and playful.',
    care: 'Dense double coat needs weekly brushing. Generally very healthy. Can be sensitive to changes in routine. Moderate exercise needs - enjoy interactive toys and puzzle feeders. Keep environment calm.',
    temperament: ['Reserved', 'Intelligent', 'Loyal', 'Sensitive'],
    lifespan: '15-20 years',
    weight: '7-12 lbs',
  },
  {
    id: 'abyssinian',
    name: 'Abyssinian',
    emoji: '🦊',
    origin: 'Ethiopia',
    categories: ['popular', 'shorthair', 'active'],
    traits: { affection: 4, energy: 5, grooming: 1, intelligence: 5, vocalization: 3 },
    description: 'Abyssinians have ticked coats that give them a wild appearance. They are extremely active, curious, and intelligent cats that love to explore high places. Often called the "athletes" of the cat world.',
    care: 'Minimal grooming needed. Abyssinians need extensive playtime and climbing opportunities. Cat trees, puzzle toys, and interactive play are essential. Can be prone to dental disease and kidney issues.',
    temperament: ['Active', 'Curious', 'Athletic', 'Intelligent'],
    lifespan: '12-15 years',
    weight: '6-10 lbs',
  },
  {
    id: 'norwegian-forest',
    name: 'Norwegian Forest',
    emoji: '🌲',
    origin: 'Norway',
    categories: ['longhair', 'popular', 'large'],
    traits: { affection: 4, energy: 3, grooming: 3, intelligence: 4, vocalization: 2 },
    description: 'Large, powerful cats with long, water-resistant coats built for Scandinavian winters. Norwegian Forest Cats are gentle, patient, and form strong family bonds. Despite their wild appearance, they are friendly.',
    care: 'Weekly brushing usually sufficient, but daily during spring shedding. Generally robust and healthy. Need space to climb - tall cat trees essential. Watch for hip dysplasia and heart disease as they age.',
    temperament: ['Gentle', 'Patient', 'Friendly', 'Independent'],
    lifespan: '14-16 years',
    weight: '12-20 lbs',
  },
  {
    id: 'birman',
    name: 'Birman',
    emoji: '⚪',
    origin: 'Myanmar (Burma)',
    categories: ['longhair', 'popular'],
    traits: { affection: 5, energy: 2, grooming: 3, intelligence: 4, vocalization: 2 },
    description: 'Also called the "Sacred Cat of Burma," Birmans have striking blue eyes, color points, and distinctive white "gloves" on their paws. They are gentle, affectionate cats that enjoy companionship.',
    care: 'Silky coat doesn\'t mat as easily but weekly brushing recommended. Birmans are social and don\'t do well alone - consider getting two. Generally healthy but can be prone to heart disease.',
    temperament: ['Gentle', 'Affectionate', 'Social', 'Calm'],
    lifespan: '12-16 years',
    weight: '10-15 lbs',
  },
  {
    id: 'sphinx',
    name: 'Exotic Shorthair',
    emoji: '🧸',
    origin: 'United States',
    categories: ['popular', 'shorthair'],
    traits: { affection: 5, energy: 2, grooming: 2, intelligence: 3, vocalization: 1 },
    description: 'Often called the "lazy man\'s Persian," Exotic Shorthairs have the Persian\'s sweet face but with short, plush coats. They are gentle, affectionate, and more playful than Persians.',
    care: 'Easy grooming - weekly brushing. Their flat faces need regular cleaning. Can have same respiratory issues as Persians but less severe. Keep indoors. Regular vet checkups for eye and dental health.',
    temperament: ['Gentle', 'Playful', 'Affectionate', 'Quiet'],
    lifespan: '12-15 years',
    weight: '10-15 lbs',
  },
  {
    id: 'oriental',
    name: 'Oriental Shorthair',
    emoji: '🎭',
    origin: 'United States',
    categories: ['shorthair', 'vocal'],
    traits: { affection: 5, energy: 5, grooming: 1, intelligence: 5, vocalization: 5 },
    description: 'Related to Siamese but with varied colors and patterns. Oriental Shorthairs are sleek, elegant cats with large ears. They are extremely vocal, social, and demand attention.',
    care: 'Minimal grooming needed. Orientals need constant interaction and mental stimulation. They can suffer from separation anxiety. Best suited to homes where someone is usually present.',
    temperament: ['Vocal', 'Social', 'Energetic', 'Demanding'],
    lifespan: '12-15 years',
    weight: '8-12 lbs',
  },
  {
    id: 'tonkinese',
    name: 'Tonkinese',
    emoji: '🎨',
    origin: 'Canada',
    categories: ['shorthair', 'popular'],
    traits: { affection: 5, energy: 4, grooming: 1, intelligence: 4, vocalization: 3 },
    description: 'A cross between Siamese and Burmese, Tonkinese cats have aqua-colored eyes and come in various coat patterns. They are playful, affectionate, and enjoy being involved in family activities.',
    care: 'Low grooming needs. Tonkinese cats are active and need regular play. They enjoy learning tricks and playing fetch. Generally healthy breed with few genetic issues.',
    temperament: ['Playful', 'Affectionate', 'Active', 'Social'],
    lifespan: '13-16 years',
    weight: '6-12 lbs',
  },
];

export const getBreedsByCategory = (category: string): Breed[] => {
  if (category === 'all') return breeds;
  return breeds.filter(breed => breed.categories.includes(category));
};

export const searchBreeds = (query: string): Breed[] => {
  const lowerQuery = query.toLowerCase();
  return breeds.filter(
    breed =>
      breed.name.toLowerCase().includes(lowerQuery) ||
      breed.origin.toLowerCase().includes(lowerQuery) ||
      breed.temperament.some(t => t.toLowerCase().includes(lowerQuery))
  );
};
