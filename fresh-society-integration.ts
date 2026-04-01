/**
 * Fresh Society Loyalty Program Integration
 * Integrates Food Lovers Market Fresh Society card with price calculations
 * Includes ABSA Rewards (up to 30% cashback) and tier benefits
 */

import { getDb } from './db';

interface FreshSocietyCard {
  cardNumber: string;
  memberName: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  pointsBalance: number;
  cashbackPercentage: number;
  linkedAbsaCard?: string;
}

interface LoyaltyBenefit {
  tier: string;
  cashbackPercentage: number;
  pointsMultiplier: number;
  specialOffers: string[];
  monthlyBonus: number;
}

// Fresh Society Tier Benefits
const TIER_BENEFITS: Record<string, LoyaltyBenefit> = {
  Bronze: {
    tier: 'Bronze',
    cashbackPercentage: 1,
    pointsMultiplier: 1,
    specialOffers: ['Weekly specials', 'Birthday rewards'],
    monthlyBonus: 0,
  },
  Silver: {
    tier: 'Silver',
    cashbackPercentage: 2,
    pointsMultiplier: 1.5,
    specialOffers: ['Weekly specials', 'Birthday rewards', 'Member-only deals'],
    monthlyBonus: 50,
  },
  Gold: {
    tier: 'Gold',
    cashbackPercentage: 3,
    pointsMultiplier: 2,
    specialOffers: ['Weekly specials', 'Birthday rewards', 'Member-only deals', 'Early access to sales'],
    monthlyBonus: 100,
  },
  Platinum: {
    tier: 'Platinum',
    cashbackPercentage: 5,
    pointsMultiplier: 3,
    specialOffers: ['Weekly specials', 'Birthday rewards', 'Member-only deals', 'Early access to sales', 'VIP events'],
    monthlyBonus: 250,
  },
};

// ABSA Rewards Integration (up to 30% cashback)
const ABSA_REWARDS_TIERS = {
  standard: { cashback: 0.05, description: '0.5% cashback' },
  plus: { cashback: 0.10, description: '1% cashback' },
  premium: { cashback: 0.30, description: '3% cashback' },
};

/**
 * Calculate loyalty discount for a purchase
 */
export function calculateLoyaltyDiscount(
  purchaseAmount: number,
  freshSocietyTier: string,
  absaRewardsLevel?: string
): {
  freshSocietyCashback: number;
  absaRewardsCashback: number;
  totalCashback: number;
  totalSavings: number;
  pointsEarned: number;
} {
  const tierBenefit = TIER_BENEFITS[freshSocietyTier] || TIER_BENEFITS.Bronze;
  
  // Fresh Society cashback
  const freshSocietyCashback = purchaseAmount * (tierBenefit.cashbackPercentage / 100);
  
  // ABSA Rewards cashback (if linked)
  let absaRewardsCashback = 0;
  if (absaRewardsLevel && ABSA_REWARDS_TIERS[absaRewardsLevel as keyof typeof ABSA_REWARDS_TIERS]) {
    absaRewardsCashback = purchaseAmount * ABSA_REWARDS_TIERS[absaRewardsLevel as keyof typeof ABSA_REWARDS_TIERS].cashback;
  }
  
  // Total cashback (Fresh Society + ABSA)
  const totalCashback = freshSocietyCashback + absaRewardsCashback;
  
  // Points earned (1 point per R1 spent, multiplied by tier)
  const pointsEarned = Math.floor(purchaseAmount * tierBenefit.pointsMultiplier);
  
  return {
    freshSocietyCashback: Math.round(freshSocietyCashback * 100) / 100,
    absaRewardsCashback: Math.round(absaRewardsCashback * 100) / 100,
    totalCashback: Math.round(totalCashback * 100) / 100,
    totalSavings: Math.round(totalCashback * 100) / 100,
    pointsEarned,
  };
}

/**
 * Get tier benefits
 */
export function getTierBenefits(tier: string): LoyaltyBenefit {
  return TIER_BENEFITS[tier] || TIER_BENEFITS.Bronze;
}

/**
 * Calculate best shopping strategy considering loyalty
 */
export function calculateBestShoppingStrategy(
  products: Array<{
    name: string;
    prices: Array<{ store: string; price: number }>;
  }>,
  freshSocietyTier: string,
  absaRewardsLevel?: string
): {
  store: string;
  totalPrice: number;
  loyaltyCashback: number;
  finalPrice: number;
  pointsEarned: number;
  recommendation: string;
} {
  // Find best prices by store
  const storeTotal: Record<string, number> = {};
  
  for (const product of products) {
    for (const priceInfo of product.prices) {
      if (!storeTotal[priceInfo.store]) {
        storeTotal[priceInfo.store] = 0;
      }
      storeTotal[priceInfo.store] += priceInfo.price;
    }
  }
  
  // Find cheapest store
  let cheapestStore = 'Food Lovers Market';
  let cheapestTotal = Infinity;
  
  for (const [store, total] of Object.entries(storeTotal)) {
    if (total < cheapestTotal) {
      cheapestTotal = total;
      cheapestStore = store;
    }
  }
  
  // Calculate loyalty benefits
  const loyaltyCalc = calculateLoyaltyDiscount(cheapestTotal, freshSocietyTier, absaRewardsLevel);
  
  let recommendation = `Shop at ${cheapestStore} for best price`;
  
  // If Food Lovers Market, add loyalty benefit note
  if (cheapestStore === 'Food Lovers Market') {
    recommendation += ` + ${loyaltyCalc.freshSocietyCashback.toFixed(2)} Fresh Society cashback`;
    if (absaRewardsLevel) {
      recommendation += ` + ${loyaltyCalc.absaRewardsCashback.toFixed(2)} ABSA cashback`;
    }
  }
  
  return {
    store: cheapestStore,
    totalPrice: cheapestTotal,
    loyaltyCashback: loyaltyCalc.totalCashback,
    finalPrice: cheapestTotal - loyaltyCalc.totalCashback,
    pointsEarned: loyaltyCalc.pointsEarned,
    recommendation,
  };
}

/**
 * Get loyalty program benefits summary
 */
export function getLoyaltyProgramSummary(tier: string, absaLinked: boolean = false) {
  const tierBenefit = getTierBenefits(tier);
  
  return {
    tier,
    freshSociety: {
      cashback: `${tierBenefit.cashbackPercentage}%`,
      pointsMultiplier: `${tierBenefit.pointsMultiplier}x`,
      monthlyBonus: `${tierBenefit.monthlyBonus} points`,
      specialOffers: tierBenefit.specialOffers,
    },
    absa: absaLinked ? {
      available: true,
      maxCashback: '3%',
      description: 'Link your ABSA card for additional cashback rewards',
    } : {
      available: false,
      description: 'Link your ABSA card to unlock additional cashback rewards',
    },
    totalBenefits: {
      maxCashback: `${tierBenefit.cashbackPercentage}%${absaLinked ? ' + up to 3% ABSA' : ''}`,
      pointsPerRand: tierBenefit.pointsMultiplier,
    },
  };
}

/**
 * Estimate annual savings with loyalty program
 */
export function estimateAnnualSavings(
  monthlySpend: number,
  tier: string,
  absaRewardsLevel?: string
): {
  freshSocietyCashback: number;
  absaRewardsCashback: number;
  totalAnnualSavings: number;
  pointsPerYear: number;
} {
  const loyaltyCalc = calculateLoyaltyDiscount(monthlySpend, tier, absaRewardsLevel);
  
  return {
    freshSocietyCashback: Math.round(loyaltyCalc.freshSocietyCashback * 12 * 100) / 100,
    absaRewardsCashback: Math.round(loyaltyCalc.absaRewardsCashback * 12 * 100) / 100,
    totalAnnualSavings: Math.round(loyaltyCalc.totalCashback * 12 * 100) / 100,
    pointsPerYear: loyaltyCalc.pointsEarned * 12,
  };
}

/**
 * Get recommended tier based on annual spend
 */
export function getRecommendedTier(annualSpend: number): {
  recommendedTier: string;
  reason: string;
  estimatedBenefit: number;
} {
  const monthlySpend = annualSpend / 12;
  
  if (monthlySpend < 1000) {
    return {
      recommendedTier: 'Bronze',
      reason: 'Entry-level tier for occasional shoppers',
      estimatedBenefit: (monthlySpend * 0.01) * 12, // 1% cashback
    };
  } else if (monthlySpend < 3000) {
    return {
      recommendedTier: 'Silver',
      reason: 'Great for regular shoppers with 2% cashback',
      estimatedBenefit: (monthlySpend * 0.02) * 12, // 2% cashback
    };
  } else if (monthlySpend < 5000) {
    return {
      recommendedTier: 'Gold',
      reason: 'Excellent for frequent shoppers with 3% cashback',
      estimatedBenefit: (monthlySpend * 0.03) * 12, // 3% cashback
    };
  } else {
    return {
      recommendedTier: 'Platinum',
      reason: 'Premium tier for high-volume shoppers with 5% cashback',
      estimatedBenefit: (monthlySpend * 0.05) * 12, // 5% cashback
    };
  }
}

export { FreshSocietyCard, LoyaltyBenefit, TIER_BENEFITS, ABSA_REWARDS_TIERS };
