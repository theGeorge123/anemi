// Dutch nickname generator
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
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  return `${adjective} ${noun} ${emoji}`;
}

export function generateNicknameFromEmail(email: string): string {
  // Use email as seed for consistent nickname per user
  const hash = email.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const adjective = adjectives[Math.abs(hash) % adjectives.length];
  const noun = nouns[Math.abs(hash >> 8) % nouns.length];
  const emoji = emojis[Math.abs(hash >> 16) % emojis.length];
  
  return `${adjective} ${noun} ${emoji}`;
} 