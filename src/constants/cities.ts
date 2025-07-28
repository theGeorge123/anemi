export const cities = ["Amsterdam", "Rotterdam", "Utrecht", "Den Haag", "Rhoon"] as const;
export type City = (typeof cities)[number];

export const cityMeta: Record<City, { emoji: string; tag: string }> = {
  Amsterdam: { emoji: "🚲", tag: "Canals & culture" },
  Rotterdam: { emoji: "⚓", tag: "Modern harbours" },
  Utrecht: { emoji: "🏛️", tag: "Historic center" },
  "Den Haag": { emoji: "🏛️", tag: "Government & peace" },
  Rhoon: { emoji: "🏘️", tag: "Village charm" },
}; 