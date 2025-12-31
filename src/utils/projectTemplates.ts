/**
 * Project Templates
 * 
 * Pre-configured templates for common crochet projects
 */

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  defaultCounters: { name: string; type: 'row' | 'stitch' | 'repeat' | 'custom'; target?: number }[];
  materials: string[];
  yarnWeight: string;
  hookSize: string;
  gauge: string;
  dimensions?: string;
  notes: string;
  milestones: string[];
  tags: string[];
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'baby-blanket',
    name: 'Baby Blanket',
    category: 'blanket',
    description: 'Classic granny square baby blanket, perfect for gifts',
    difficulty: 2,
    estimatedTime: '2-3 weeks',
    defaultCounters: [
      {
        name: 'Squares Completed',
        type: 'repeat',
        target: 48,

      },
      {
        name: 'Rows Joined',
        type: 'row',
        target: 6,

      },
    ],
    materials: [
      '6 skeins worsted weight yarn',
      'H/8 (5mm) crochet hook',
      'Yarn needle for weaving',
      'Scissors',
    ],
    yarnWeight: 'Worsted',
    hookSize: 'H/8 (5mm)',
    gauge: '4 sts = 1 inch',
    dimensions: '36" x 36"',
    notes: 'Make 48 granny squares (6x8 grid). Join as you go or seam together at the end. Add a simple border for a polished look.',
    milestones: ['Complete first square', '25% done (12 squares)', 'Half done (24 squares)', '75% done (36 squares)', 'All squares complete', 'Joined together', 'Border added'],
    tags: ['baby', 'gift', 'beginner-friendly', 'modular'],
  },
  {
    id: 'infinity-scarf',
    name: 'Infinity Scarf',
    category: 'scarf',
    description: 'Cozy infinity scarf with textured stitch pattern',
    difficulty: 2,
    estimatedTime: '1 week',
    defaultCounters: [
      {
        name: 'Rows',
        type: 'row',
        target: 80,

      },
    ],
    materials: [
      '2-3 skeins bulky weight yarn',
      'K/10.5 (6.5mm) crochet hook',
      'Yarn needle',
      'Scissors',
    ],
    yarnWeight: 'Bulky',
    hookSize: 'K/10.5 (6.5mm)',
    gauge: '3 sts = 1 inch',
    dimensions: '60" circumference x 12" wide',
    notes: 'Work in rows, then seam ends together to create infinity loop. Moss stitch creates nice texture.',
    milestones: ['Foundation row complete', '25% done (20 rows)', 'Half done (40 rows)', '75% done (60 rows)', 'All rows complete', 'Seamed into loop'],
    tags: ['accessories', 'quick-project', 'cold-weather'],
  },
  {
    id: 'beanie-hat',
    name: 'Classic Beanie',
    category: 'hat',
    description: 'Simple beanie hat worked in the round',
    difficulty: 2,
    estimatedTime: '3-4 days',
    defaultCounters: [
      {
        name: 'Rounds',
        type: 'row',
        target: 18,

      },
    ],
    materials: [
      '1 skein worsted weight yarn',
      'I/9 (5.5mm) crochet hook',
      'Stitch marker',
      'Yarn needle',
    ],
    yarnWeight: 'Worsted',
    hookSize: 'I/9 (5.5mm)',
    gauge: '4 sts = 1 inch',
    dimensions: '20" circumference',
    notes: 'Start with magic ring, work in continuous rounds. Decrease for crown shaping in last 4-5 rounds.',
    milestones: ['Magic ring started', 'Base rounds complete', 'Body complete', 'Crown decreases done', 'Weaving in ends'],
    tags: ['accessories', 'quick-project', 'in-the-round'],
  },
  {
    id: 'amigurumi-bear',
    name: 'Amigurumi Teddy Bear',
    category: 'amigurumi',
    description: 'Adorable stuffed bear, great for beginners',
    difficulty: 3,
    estimatedTime: '1-2 weeks',
    defaultCounters: [
      {
        name: 'Body Parts',
        type: 'repeat',
        target: 8,

      },
    ],
    materials: [
      '2 skeins sport weight yarn (brown)',
      '1 skein sport weight yarn (cream for belly)',
      'F/5 (3.75mm) crochet hook',
      'Polyester stuffing',
      'Safety eyes (12mm)',
      'Embroidery floss for nose',
      'Yarn needle',
    ],
    yarnWeight: 'Sport',
    hookSize: 'F/5 (3.75mm)',
    gauge: '5 sts = 1 inch',
    notes: 'Work all pieces separately: head, body, 2 arms, 2 legs, 2 ears. Stuff firmly as you go. Attach safety eyes before closing head.',
    milestones: ['Head complete', 'Body complete', 'Arms complete', 'Legs complete', 'Ears complete', 'All pieces assembled', 'Face embroidered'],
    tags: ['toys', 'cute', 'gift', 'stuffed'],
  },
  {
    id: 'market-bag',
    name: 'Market Tote Bag',
    category: 'bag',
    description: 'Reusable mesh market bag',
    difficulty: 2,
    estimatedTime: '1 week',
    defaultCounters: [
      {
        name: 'Rounds',
        type: 'row',
        target: 30,

      },
    ],
    materials: [
      '2 skeins cotton worsted yarn',
      'H/8 (5mm) crochet hook',
      'Stitch marker',
      'Yarn needle',
    ],
    yarnWeight: 'Worsted Cotton',
    hookSize: 'H/8 (5mm)',
    gauge: '4 sts = 1 inch',
    dimensions: '12" wide x 14" tall',
    notes: 'Work in continuous rounds from bottom up. Mesh stitch pattern stretches to hold groceries. Add handles last.',
    milestones: ['Base complete', 'Body halfway', 'Body complete', 'Handles attached'],
    tags: ['eco-friendly', 'practical', 'cotton'],
  },
  {
    id: 'granny-square-afghan',
    name: 'Granny Square Afghan',
    category: 'blanket',
    description: 'Classic rainbow granny square throw blanket',
    difficulty: 3,
    estimatedTime: '4-6 weeks',
    defaultCounters: [
      {
        name: 'Squares',
        type: 'repeat',
        target: 63,

      },
      {
        name: 'Rows Joined',
        type: 'row',
        target: 9,

      },
    ],
    materials: [
      '10-12 skeins worsted weight yarn (various colors)',
      'H/8 (5mm) crochet hook',
      'Yarn needle',
    ],
    yarnWeight: 'Worsted',
    hookSize: 'H/8 (5mm)',
    gauge: '4 sts = 1 inch',
    dimensions: '45" x 63"',
    notes: 'Make 63 granny squares (7x9 grid) in rainbow colors. Join with slip stitch or whip stitch. Add 3-round border.',
    milestones: ['First 10 squares', '25% (16 squares)', 'Half done (32 squares)', '75% (47 squares)', 'All squares done', 'Joined', 'Border complete'],
    tags: ['colorful', 'classic', 'modular', 'cozy'],
  },
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  return projectTemplates.filter(t => t.category === category);
}

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(difficulty: number): ProjectTemplate[] {
  return projectTemplates.filter(t => t.difficulty === difficulty);
}

/**
 * Search templates
 */
export function searchTemplates(query: string): ProjectTemplate[] {
  const lowerQuery = query.toLowerCase();
  return projectTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
