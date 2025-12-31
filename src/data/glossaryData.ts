/**
 * Comprehensive Crochet Abbreviation Glossary
 * Includes US and UK terminology
 */

export interface GlossaryTerm {
  abbreviation: string;
  name: string;
  category: 'Basic Stitches' | 'Increases/Decreases' | 'Special Techniques' | 'Common Terms' | 'UK Terms';
  definition: string;
  usEquivalent?: string; // For UK terms
}

export const glossaryData: GlossaryTerm[] = [
  // Basic Stitches
  {
    abbreviation: 'ch',
    name: 'Chain',
    category: 'Basic Stitches',
    definition: 'The foundation of most crochet work. Yarn over and pull through loop on hook.'
  },
  {
    abbreviation: 'sl st',
    name: 'Slip Stitch',
    category: 'Basic Stitches',
    definition: 'Insert hook, yarn over, pull through both loops on hook. Used for joining or moving across stitches.'
  },
  {
    abbreviation: 'sc',
    name: 'Single Crochet',
    category: 'Basic Stitches',
    definition: 'Insert hook, yarn over and pull through, yarn over and pull through both loops.'
  },
  {
    abbreviation: 'hdc',
    name: 'Half Double Crochet',
    category: 'Basic Stitches',
    definition: 'Yarn over, insert hook, yarn over and pull through, yarn over and pull through all 3 loops.'
  },
  {
    abbreviation: 'dc',
    name: 'Double Crochet',
    category: 'Basic Stitches',
    definition: 'Yarn over, insert hook, yarn over and pull through, [yarn over, pull through 2 loops] twice.'
  },
  {
    abbreviation: 'tr',
    name: 'Treble Crochet',
    category: 'Basic Stitches',
    definition: 'Yarn over twice, insert hook, yarn over and pull through, [yarn over, pull through 2 loops] three times.'
  },
  {
    abbreviation: 'dtr',
    name: 'Double Treble Crochet',
    category: 'Basic Stitches',
    definition: 'Yarn over 3 times, insert hook, then work off loops 2 at a time.'
  },

  // Increases/Decreases
  {
    abbreviation: 'inc',
    name: 'Increase',
    category: 'Increases/Decreases',
    definition: 'Work 2 stitches in the same stitch to increase stitch count.'
  },
  {
    abbreviation: 'dec',
    name: 'Decrease',
    category: 'Increases/Decreases',
    definition: 'Work 2 stitches together to reduce stitch count.'
  },
  {
    abbreviation: 'sc2tog',
    name: 'Single Crochet 2 Together',
    category: 'Increases/Decreases',
    definition: 'Decrease by working 2 single crochet stitches together.'
  },
  {
    abbreviation: 'dc2tog',
    name: 'Double Crochet 2 Together',
    category: 'Increases/Decreases',
    definition: 'Decrease by working 2 double crochet stitches together.'
  },

  // Special Techniques
  {
    abbreviation: 'BLO',
    name: 'Back Loop Only',
    category: 'Special Techniques',
    definition: 'Work into the back loop only of the stitch, leaving the front loop unworked.'
  },
  {
    abbreviation: 'FLO',
    name: 'Front Loop Only',
    category: 'Special Techniques',
    definition: 'Work into the front loop only of the stitch, leaving the back loop unworked.'
  },
  {
    abbreviation: 'FP',
    name: 'Front Post',
    category: 'Special Techniques',
    definition: 'Work around the post of the stitch from the front.'
  },
  {
    abbreviation: 'BP',
    name: 'Back Post',
    category: 'Special Techniques',
    definition: 'Work around the post of the stitch from the back.'
  },
  {
    abbreviation: 'FPDC',
    name: 'Front Post Double Crochet',
    category: 'Special Techniques',
    definition: 'Double crochet worked around the post from the front, creating texture.'
  },
  {
    abbreviation: 'BPDC',
    name: 'Back Post Double Crochet',
    category: 'Special Techniques',
    definition: 'Double crochet worked around the post from the back, creating texture.'
  },
  {
    abbreviation: 'magic ring',
    name: 'Magic Ring',
    category: 'Special Techniques',
    definition: 'Adjustable starting loop for working in the round, also called magic circle.'
  },

  // Common Terms
  {
    abbreviation: 'RS',
    name: 'Right Side',
    category: 'Common Terms',
    definition: 'The side of the work that faces outward when worn or displayed.'
  },
  {
    abbreviation: 'WS',
    name: 'Wrong Side',
    category: 'Common Terms',
    definition: 'The side of the work that faces inward.'
  },
  {
    abbreviation: 'rep',
    name: 'Repeat',
    category: 'Common Terms',
    definition: 'Repeat the instructions following or between ** or [].'
  },
  {
    abbreviation: 'sk',
    name: 'Skip',
    category: 'Common Terms',
    definition: 'Skip the next stitch or space.'
  },
  {
    abbreviation: 'sp',
    name: 'Space',
    category: 'Common Terms',
    definition: 'Space or gap between stitches.'
  },
  {
    abbreviation: 'st(s)',
    name: 'Stitch(es)',
    category: 'Common Terms',
    definition: 'A single loop or multiple loops on the hook or in the fabric.'
  },
  {
    abbreviation: 'yo',
    name: 'Yarn Over',
    category: 'Common Terms',
    definition: 'Wrap yarn over the hook from back to front.'
  },
  {
    abbreviation: 'rnd',
    name: 'Round',
    category: 'Common Terms',
    definition: 'A complete circle when working in the round.'
  },
  {
    abbreviation: 'tog',
    name: 'Together',
    category: 'Common Terms',
    definition: 'Work stitches together to decrease.'
  },

  // UK Terms (different from US)
  {
    abbreviation: 'dc (UK)',
    name: 'Double Crochet (UK)',
    category: 'UK Terms',
    definition: 'UK term for single crochet.',
    usEquivalent: 'sc (US)'
  },
  {
    abbreviation: 'tr (UK)',
    name: 'Treble Crochet (UK)',
    category: 'UK Terms',
    definition: 'UK term for double crochet.',
    usEquivalent: 'dc (US)'
  },
  {
    abbreviation: 'dtr (UK)',
    name: 'Double Treble (UK)',
    category: 'UK Terms',
    definition: 'UK term for treble crochet.',
    usEquivalent: 'tr (US)'
  },
  {
    abbreviation: 'htr (UK)',
    name: 'Half Treble (UK)',
    category: 'UK Terms',
    definition: 'UK term for half double crochet.',
    usEquivalent: 'hdc (US)'
  }
];

export const categories = [
  'Basic Stitches',
  'Increases/Decreases',
  'Special Techniques',
  'Common Terms',
  'UK Terms'
] as const;
