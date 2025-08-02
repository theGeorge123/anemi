-- Test Story Insert
INSERT INTO "Story" (
  "id",
  "title",
  "content",
  "excerpt",
  "status",
  "featured",
  "viewCount",
  "likeCount",
  "images",
  "tags",
  "publishedAt",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "authorId"
) VALUES (
  gen_random_uuid(),
  'Mijn eerste Anemi coffee meeting',
  'Ik was nerveus voor mijn eerste coffee meeting via Anemi. Sarah en ik spraken af bij Coffee & Coconuts in Amsterdam. Het was een geweldige ervaring! We hebben uren gepraat over werk, reizen en onze passies. Wat ik het mooiste vond was hoe natuurlijk het voelde. Alsof we elkaar al jaren kenden.

We begonnen met een kopje koffie en eindigden met plannen voor een volgende ontmoeting. Het was geweldig om te zien hoe eenvoudig het was om via Anemi een echte connectie te maken.

Wat ik het meest waardevol vond was de authenticiteit van de ontmoeting. Geen geforceerde netwerkgesprekken, maar gewoon twee mensen die elkaar ontmoeten over een kopje koffie.',
  'Een onvergetelijke ontmoeting in Amsterdam die bewijst dat echte connecties nog steeds mogelijk zijn',
  'PUBLISHED',
  false,
  0,
  0,
  '[]',
  '["amsterdam", "coffee", "networking", "eerste-keer", "authenticiteit"]',
  NOW(),
  NOW(),
  NOW(),
  NULL,
  'eafe64b0-7c99-472d-96c8-35d7c47ce957'
); 