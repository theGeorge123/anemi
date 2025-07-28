// Dutch coffee-themed nickname generator
const coffeeNicknames = [
  'Koffiekoning', 'Espressoelf', 'Cappuccinocreatief', 'Lattelover', 'Mochamagie',
  'Frappefan', 'Baristabuddy', 'Cafékampioen', 'Bruinegoudzoeker', 'Koffieklant',
  'Espressoenthusiast', 'Melkschuimmeester', 'Bonenzoekers', 'Koffiecurator', 'Cafeïnekenner',
  'Aroma-artiest', 'Filterfanaat', 'Koffieavonturier', 'Espressoexpert', 'Latte-kunstenaar',
  'Mokameesters', 'Cappuccinochef', 'Baristaprins', 'Koffieconnoiseur', 'Cafécreatief',
  'Espressoengelije', 'Melkschuimmagier', 'Bonenbaron', 'Aromadirecteur',
  'Filterfee', 'Lattelieveling', 'Mokaminnaar', 'Cappuccinocommandant', 'Baristaboss',
  'Koffiekeizer', 'Espressoenergie', 'Melkschuimmaakt', 'Bonenbewaker', 'Aromaalchemist'
];

// Legacy arrays for backwards compatibility
const adjectives = [
  'Vrolijke', 'Gezellige', 'Koffie', 'Zonnige', 'Glimlachende', 'Warme', 'Vriendelijke',
  'Enthousiaste', 'Creatieve', 'Avontuurlijke', 'Rustige', 'Energieke', 'Gastvrije',
  'Optimistische', 'Geduldige', 'Hartelijke', 'Liefdevolle', 'Spontane', 'Geweldige',
  'Fantastische', 'Prachtige', 'Wonderlijke', 'Magische', 'Bijzondere', 'Unieke'
];

const nouns = [
  'Koffieboon', 'Koffiezetter', 'Koffiebarista', 'Koffieliefhebber', 'Koffiekenner',
  'Koffieproever', 'Koffiegenieter', 'Koffieconnaisseur', 'Koffie-expert',
  'Koffie-enthousiast', 'Koffie-fan', 'Koffie-kenner', 'Koffie-specialist',
  'Koffie-master', 'Koffie-guru', 'Koffie-wizard', 'Koffie-ninja', 'Koffie-hero',
  'Koffie-champion', 'Koffie-legend', 'Koffie-king', 'Koffie-queen', 'Koffie-prince',
  'Koffie-princess', 'Koffie-knight', 'Koffie-warrior', 'Koffie-guardian',
  'Koffie-protector', 'Koffie-defender', 'Koffie-fighter', 'Koffie-victor'
];

const emojis = ['☕', '🌟', '💫', '✨', '🎉', '🎊', '🎈', '🎪', '🎭', '🎨', '🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎼'];

export function generateRandomNickname(): string {
  // Use the new coffee-themed nicknames for a cleaner, more consistent experience
  const randomIndex = Math.floor(Math.random() * coffeeNicknames.length);
  return coffeeNicknames[randomIndex] || 'Koffieliefhebber';
}

export function generateNicknameFromEmail(email: string): string {
  // Use email as seed for consistent nickname per user
  const hash = email.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Use coffee nicknames for consistency
  const nicknameIndex = Math.abs(hash) % coffeeNicknames.length;
  return coffeeNicknames[nicknameIndex] || 'Koffieliefhebber';
} 