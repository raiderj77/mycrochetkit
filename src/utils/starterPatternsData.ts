/**
 * Starter Patterns Data
 * 
 * Curated patterns provided for new users to get started instantly.
 */

import type { Pattern } from '@/types/models';

export const starterPatterns: Omit<Pattern, 'dateAdded' | 'lastAccessed'>[] = [
  {
    id: 'starter-cozy-beanie',
    title: 'Instant Cozy Beanie',
    author: 'My Crochet Kit',
    designer: 'MCK Team',
    source: 'manual',
    category: 'accessory',
    skillLevel: 'beginner',
    techniques: ['Magic Ring', 'Double Crochet', 'Working in the Round'],
    hookSize: 'H/8 (5.0mm)',
    yarnWeight: 'Worsted',
    notes: 'A simple, stylish beanie that works up in just a few hours. Perfect for your first project with the app!',
    tags: ['beginner', 'quick', 'gift', 'winter'],
    isFavorite: false,
    parsedSections: [
      {
        id: 'section-hat-body',
        name: 'Hat Body',
        isCompleted: false,
        notes: [],
        instructions: [
          {
            id: 'instr-1',
            text: 'Round 1: 12 DC into Magic Ring. Join with Sl ST to first DC. (12 sts)',
            sizeVariants: {},
            abbreviations: ['DC', 'Sl ST'],
            rowNumber: 1,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-2',
            text: 'Round 2: CH 2, 2 DC in each stitch around. Join. (24 sts)',
            sizeVariants: {},
            abbreviations: ['CH', 'DC'],
            rowNumber: 2,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-3',
            text: 'Round 3: CH 2, *2 DC in first st, 1 DC in next* repeat around. Join. (36 sts)',
            sizeVariants: {},
            abbreviations: ['CH', 'DC'],
            rowNumber: 3,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-4',
            text: 'Rounds 4-12: CH 2, DC in each stitch around. Join. (36 sts)',
            sizeVariants: {},
            abbreviations: ['CH', 'DC'],
            rowNumber: 4,
            isCompleted: false,
            notes: [],
          }
        ]
      }
    ],
    sizes: [{ id: 'size-onesize', name: 'One Size Adult' }],
    abbreviationsUsed: [
      { abbr: 'DC', full: 'Double Crochet' },
      { abbr: 'CH', full: 'Chain' },
      { abbr: 'Sl ST', full: 'Slip Stitch' }
    ],
    materials: [
      { name: 'Worsted Weight Yarn', quantity: '1 skein' },
      { name: 'Stitch Marker' }
    ],
  },
  {
    id: 'starter-cotton-dishcloth',
    title: 'Textured Cotton Dishcloth',
    author: 'My Crochet Kit',
    designer: 'MCK Team',
    source: 'manual',
    category: 'home',
    skillLevel: 'beginner',
    techniques: ['Single Crochet', 'Waffle Stitch'],
    hookSize: 'G/6 (4.0mm)',
    yarnWeight: 'Worsted Cotton',
    notes: 'A great way to practice tension and learn basic textures. Cotton is recommended for durability.',
    tags: ['kitchen', 'cotton', 'beginner', 'practice'],
    isFavorite: false,
    parsedSections: [
      {
        id: 'section-main',
        name: 'Main Body',
        isCompleted: false,
        notes: [],
        instructions: [
          {
            id: 'instr-1',
            text: 'Chain 31.',
            sizeVariants: {},
            abbreviations: ['CH'],
            rowNumber: 1,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-2',
            text: 'Row 1: SC in second ch from hook and each ch across. (30 sts)',
            sizeVariants: {},
            abbreviations: ['SC'],
            rowNumber: 2,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-3',
            text: 'Rows 2-25: CH 1, turn. SC in each stitch across.',
            sizeVariants: {},
            abbreviations: ['CH', 'SC'],
            rowNumber: 3,
            isCompleted: false,
            notes: [],
          }
        ]
      }
    ],
    sizes: [{ id: 'size-small', name: '8" x 8"' }],
    abbreviationsUsed: [
      { abbr: 'SC', full: 'Single Crochet' },
      { abbr: 'CH', full: 'Chain' }
    ],
    materials: [
      { name: 'Cotton Yarn', quantity: '50g' }
    ],
  },
  {
    id: 'starter-basic-amigurumi-heart',
    title: 'Basic 3D Heart',
    author: 'My Crochet Kit',
    designer: 'MCK Team',
    source: 'manual',
    category: 'amigurumi',
    skillLevel: 'easy',
    techniques: ['Magic Ring', 'Continuous Rounds', 'Decreasing', 'Stuffing'],
    hookSize: 'E/4 (3.5mm)',
    yarnWeight: 'Worsted',
    notes: 'Learn the fundamentals of amigurumi. This heart consists of two bumps joined together.',
    tags: ['amigurumi', 'gift', 'toy', 'easy'],
    isFavorite: false,
    parsedSections: [
      {
        id: 'section-bumps',
        name: 'Heart Bumps (Make 2)',
        isCompleted: false,
        notes: [],
        instructions: [
          {
            id: 'instr-1',
            text: 'R1: 6 SC in Magic Ring. (6)',
            sizeVariants: {},
            abbreviations: ['SC'],
            rowNumber: 1,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-2',
            text: 'R2: 2 SC in each st around. (12)',
            sizeVariants: {},
            abbreviations: ['SC'],
            rowNumber: 2,
            isCompleted: false,
            notes: [],
          },
          {
            id: 'instr-3',
            text: 'R3: *SC in next st, 2 SC in next* repeat. (18)',
            sizeVariants: {},
            abbreviations: ['SC'],
            rowNumber: 3,
            isCompleted: false,
            notes: [],
          }
        ]
      }
    ],
    sizes: [{ id: 'size-onesize', name: 'Small' }],
    abbreviationsUsed: [
      { abbr: 'SC', full: 'Single Crochet' }
    ],
    materials: [
      { name: 'Red/Pink Yarn', quantity: 'Small amount' },
      { name: 'Stuffing' }
    ],
  }
];
