export const cities = ["Amsterdam", "Rotterdam"] as const;
export type City = (typeof cities)[number];

export const cityMeta: Record<City, { emoji: string; tag: string }> = {
  Amsterdam: { emoji: "🚲", tag: "Canals & culture" },
  Rotterdam: { emoji: "⚓", tag: "Modern harbours" },
}; 