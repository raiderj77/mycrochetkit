/**
 * Yarn Calculation Utilities
 * 
 * Calculate yardage, costs, and project requirements
 */

export interface YarnCalculation {
  totalYardage: number;
  totalSkeins: number;
  estimatedCost: number;
  warning?: string;
}

export interface ProjectDimensions {
  width: number; // in inches
  length: number; // in inches
  gauge: number; // stitches per inch
}

/**
 * Calculate yarn needed for rectangular projects (blankets, scarves, etc.)
 */
export function calculateRectangularYardage(
  dimensions: ProjectDimensions,
  yardsPerSkein: number = 364 // Default: worsted weight skein
): YarnCalculation {
  const { width, length, gauge } = dimensions;
  
  // Calculate total stitches
  const stitchesWide = width * gauge;
  const rowsLong = length * gauge;
  const totalStitches = stitchesWide * rowsLong;
  
  // Approximate yards per stitch (varies by weight, but this is a safe estimate)
  const yardsPerStitch = 0.05; // Conservative estimate
  
  const totalYardage = Math.ceil(totalStitches * yardsPerStitch);
  const totalSkeins = Math.ceil(totalYardage / yardsPerSkein);
  
  return {
    totalYardage,
    totalSkeins,
    estimatedCost: 0, // Will be calculated separately
  };
}

/**
 * Calculate yarn needed for circular/round projects (hats, amigurumi, etc.)
 */
export function calculateCircularYardage(
  diameter: number, // in inches
  height: number, // in inches
  gauge: number, // stitches per inch
  yardsPerSkein: number = 364
): YarnCalculation {
  // Calculate surface area (simplified for cylinder/cone)
  const radius = diameter / 2;
  const circumference = 2 * Math.PI * radius;
  const surfaceArea = circumference * height;
  
  // Convert to stitches
  const totalStitches = surfaceArea * (gauge * gauge);
  const yardsPerStitch = 0.05;
  
  const totalYardage = Math.ceil(totalStitches * yardsPerStitch);
  const totalSkeins = Math.ceil(totalYardage / yardsPerSkein);
  
  return {
    totalYardage,
    totalSkeins,
    estimatedCost: 0,
  };
}

/**
 * Calculate cost for a project
 */
export function calculateProjectCost(
  yardageNeeded: number,
  yardsPerSkein: number,
  pricePerSkein: number,
  additionalSupplies: number = 0
): number {
  const skeinsNeeded = Math.ceil(yardageNeeded / yardsPerSkein);
  const yarnCost = skeinsNeeded * pricePerSkein;
  return yarnCost + additionalSupplies;
}

/**
 * Check if user has enough yarn in stash
 */
export function checkYarnSufficiency(
  yardageNeeded: number,
  yardageAvailable: number
): {
  hasEnough: boolean;
  shortage?: number;
  excess?: number;
} {
  if (yardageAvailable >= yardageNeeded) {
    return {
      hasEnough: true,
      excess: yardageAvailable - yardageNeeded,
    };
  } else {
    return {
      hasEnough: false,
      shortage: yardageNeeded - yardageAvailable,
    };
  }
}

/**
 * Get yarn weight recommendations based on project
 */
export function getYarnWeightRecommendations(projectType: string): {
  recommended: string[];
  gauge: number;
  hookSize: string;
} {
  const recommendations: Record<string, { recommended: string[]; gauge: number; hookSize: string }> = {
    blanket: {
      recommended: ['worsted', 'aran', 'bulky'],
      gauge: 4,
      hookSize: 'I/9 (5.5mm) - K/10.5 (6.5mm)',
    },
    scarf: {
      recommended: ['dk', 'worsted', 'aran'],
      gauge: 4.5,
      hookSize: 'G/6 (4mm) - I/9 (5.5mm)',
    },
    hat: {
      recommended: ['worsted', 'aran'],
      gauge: 4,
      hookSize: 'H/8 (5mm) - I/9 (5.5mm)',
    },
    amigurumi: {
      recommended: ['sport', 'dk', 'worsted'],
      gauge: 5,
      hookSize: 'E/4 (3.5mm) - G/6 (4mm)',
    },
    shawl: {
      recommended: ['fingering', 'sport', 'dk'],
      gauge: 5.5,
      hookSize: 'D/3 (3.25mm) - F/5 (3.75mm)',
    },
    garment: {
      recommended: ['dk', 'worsted', 'aran'],
      gauge: 4,
      hookSize: 'G/6 (4mm) - I/9 (5.5mm)',
    },
  };
  
  return recommendations[projectType.toLowerCase()] || {
    recommended: ['worsted'],
    gauge: 4,
    hookSize: 'H/8 (5mm)',
  };
}

/**
 * Estimate project time based on dimensions and skill level
 */
export function estimateProjectTime(
  totalStitches: number,
  stitchesPerHour: number = 500 // Average for intermediate crocheter
): {
  hours: number;
  days: number; // Assuming 2 hours per day
  weeks: number;
} {
  const hours = Math.round(totalStitches / stitchesPerHour);
  const days = Math.ceil(hours / 2);
  const weeks = Math.ceil(days / 7);
  
  return { hours, days, weeks };
}

/**
 * Calculate gauge swatch requirements
 */
export function calculateGaugeSwatch(): {
  width: number;
  height: number;
  instructions: string;
} {
  return {
    width: 4,
    height: 4,
    instructions: 'Crochet a 4"x4" square, measure stitches and rows in the center 2" area. This gives the most accurate gauge.',
  };
}
