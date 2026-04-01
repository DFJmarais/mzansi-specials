/**
 * Referral Rewards Service
 * Manages referral codes, tracking, and bonus star distribution
 */

export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: Date;
  expiresAt?: Date;
  usedCount: number;
  maxUses?: number;
  bonusStars: number;
}

export interface ReferralReward {
  referrerId: string;
  referredUserId: string;
  starsAwarded: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Generate unique referral code
 */
export function generateReferralCode(userId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${userId.substring(0, 3)}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Create referral code for user
 */
export function createReferralCode(
  userId: string,
  bonusStars: number = 10,
  maxUses?: number
): ReferralCode {
  return {
    code: generateReferralCode(userId),
    userId,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    usedCount: 0,
    maxUses,
    bonusStars,
  };
}

/**
 * Validate referral code
 */
export function validateReferralCode(code: ReferralCode): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (code.expiresAt && code.expiresAt < new Date()) {
    errors.push('Referral code has expired');
  }

  if (code.maxUses && code.usedCount >= code.maxUses) {
    errors.push('Referral code usage limit reached');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Process referral reward
 */
export function processReferralReward(
  referrerId: string,
  referredUserId: string,
  baseStars: number = 10
): ReferralReward {
  return {
    referrerId,
    referredUserId,
    starsAwarded: baseStars,
    timestamp: new Date(),
    status: 'completed',
  };
}

/**
 * Calculate bonus stars for referral
 */
export function calculateReferralBonus(
  referralCount: number,
  baseBonus: number = 10
): number {
  // Tiered bonus system
  if (referralCount >= 50) return baseBonus * 2; // 2x bonus at 50 referrals
  if (referralCount >= 25) return Math.round(baseBonus * 1.5); // 1.5x bonus at 25 referrals
  if (referralCount >= 10) return Math.round(baseBonus * 1.25); // 1.25x bonus at 10 referrals
  return baseBonus;
}

/**
 * Get referral stats for user
 */
export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalStarsEarned: number;
  referralCode: string;
}

export function getReferralStats(
  referralCode: ReferralCode,
  rewards: ReferralReward[]
): ReferralStats {
  const userRewards = rewards.filter((r) => r.referrerId === referralCode.userId);
  const completedRewards = userRewards.filter((r) => r.status === 'completed');

  return {
    totalReferrals: referralCode.usedCount,
    activeReferrals: completedRewards.length,
    totalStarsEarned: completedRewards.reduce((sum, r) => sum + r.starsAwarded, 0),
    referralCode: referralCode.code,
  };
}

/**
 * Generate referral share message
 */
export function generateReferralMessage(
  userName: string,
  referralCode: string,
  bonusStars: number
): string {
  return `Join me on Mzansi Specials! 🔥 Use my referral code ${referralCode} and get ${bonusStars} ⭐ bonus stars. Start scanning prices and saving on groceries! 💰`;
}

/**
 * Generate referral share URL
 */
export function generateReferralShareUrl(
  baseUrl: string,
  referralCode: string
): string {
  return `${baseUrl}?ref=${referralCode}`;
}

/**
 * Validate referred user eligibility
 */
export function validateReferredUser(
  referredUserId: string,
  existingReferrals: ReferralReward[]
): {
  isEligible: boolean;
  reason?: string;
} {
  // Check if user already has a referral
  const existingReferral = existingReferrals.find((r) => r.referredUserId === referredUserId);

  if (existingReferral) {
    return {
      isEligible: false,
      reason: 'User has already been referred',
    };
  }

  return {
    isEligible: true,
  };
}

/**
 * Reward referrer and referee
 */
export function createBidirectionalReward(
  referrerId: string,
  referredUserId: string,
  referrerBonus: number = 10,
  refereeBonus: number = 5
): ReferralReward[] {
  return [
    {
      referrerId,
      referredUserId,
      starsAwarded: referrerBonus,
      timestamp: new Date(),
      status: 'completed',
    },
    {
      referrerId: referredUserId,
      referredUserId: referrerId,
      starsAwarded: refereeBonus,
      timestamp: new Date(),
      status: 'completed',
    },
  ];
}
