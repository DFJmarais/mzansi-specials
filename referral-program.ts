/**
 * Referral Rewards Program
 * Users earn bonus stars for inviting friends who scan prices
 */

interface ReferralCode {
  code: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  usedCount: number;
  maxUses: number;
  starsPerReferral: number;
}

interface ReferralReward {
  referrerId: string;
  referredUserId: string;
  starsEarned: number;
  earnedAt: Date;
  type: 'signup' | 'first_scan' | 'first_receipt' | 'tier_reached';
}

// Store referral codes in memory (in production, use database)
const referralCodes = new Map<string, ReferralCode>();
const referralRewards: ReferralReward[] = [];

/**
 * Generate unique referral code
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create referral code for user
 */
export function createReferralCode(userId: string): ReferralCode {
  const code = generateReferralCode();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

  const referralCode: ReferralCode = {
    code,
    userId,
    createdAt: new Date(),
    expiresAt,
    usedCount: 0,
    maxUses: 100,
    starsPerReferral: 50, // 50 bonus stars per successful referral
  };

  referralCodes.set(code, referralCode);
  console.log(`[Referral] Created code ${code} for user ${userId}`);
  return referralCode;
}

/**
 * Get user's referral code
 */
export function getUserReferralCode(userId: string): ReferralCode | null {
  for (const code of Array.from(referralCodes.values())) {
    if (code.userId === userId) {
      return code;
    }
  }
  return null;
}

/**
 * Validate and use referral code
 */
export function validateReferralCode(code: string): { valid: boolean; message: string } {
  const referralCode = referralCodes.get(code.toUpperCase());

  if (!referralCode) {
    return { valid: false, message: 'Invalid referral code' };
  }

  if (new Date() > referralCode.expiresAt) {
    return { valid: false, message: 'Referral code has expired' };
  }

  if (referralCode.usedCount >= referralCode.maxUses) {
    return { valid: false, message: 'Referral code has reached maximum uses' };
  }

  return { valid: true, message: 'Valid referral code' };
}

/**
 * Claim referral reward
 */
export function claimReferralReward(
  referralCode: string,
  referredUserId: string,
  type: 'signup' | 'first_scan' | 'first_receipt' | 'tier_reached' = 'signup'
): { success: boolean; starsEarned: number; message: string } {
  const code = referralCodes.get(referralCode.toUpperCase());

  if (!code) {
    return { success: false, starsEarned: 0, message: 'Invalid referral code' };
  }

  // Increment usage
  code.usedCount++;

  // Calculate bonus stars based on type
  let bonusStars = code.starsPerReferral;
  if (type === 'first_scan') bonusStars += 25;
  if (type === 'first_receipt') bonusStars += 50;
  if (type === 'tier_reached') bonusStars += 100;

  // Record reward
  const reward: ReferralReward = {
    referrerId: code.userId,
    referredUserId,
    starsEarned: bonusStars,
    earnedAt: new Date(),
    type,
  };

  referralRewards.push(reward);
  console.log(
    `[Referral] Reward claimed: ${code.userId} earned ${bonusStars} stars from ${referredUserId} (${type})`
  );

  return {
    success: true,
    starsEarned: bonusStars,
    message: `You earned ${bonusStars} bonus stars! 🌟`,
  };
}

/**
 * Get referral stats for user
 */
export function getReferralStats(userId: string): {
  totalReferrals: number;
  totalStarsEarned: number;
  referrals: ReferralReward[];
} {
  const userRewards = referralRewards.filter((r) => r.referrerId === userId);
  const totalStarsEarned = userRewards.reduce((sum, r) => sum + r.starsEarned, 0);

  return {
    totalReferrals: userRewards.length,
    totalStarsEarned,
    referrals: userRewards,
  };
}

/**
 * Get referral leaderboard
 */
export function getReferralLeaderboard(limit: number = 10): Array<{
  userId: string;
  totalReferrals: number;
  totalStarsEarned: number;
}> {
  const stats = new Map<string, { totalReferrals: number; totalStarsEarned: number }>();

  for (const reward of referralRewards) {
    if (!stats.has(reward.referrerId)) {
      stats.set(reward.referrerId, { totalReferrals: 0, totalStarsEarned: 0 });
    }

    const stat = stats.get(reward.referrerId)!;
    stat.totalReferrals++;
    stat.totalStarsEarned += reward.starsEarned;
  }

  return Array.from(stats.entries())
    .map(([userId, stat]) => ({ userId, ...stat }))
    .sort((a, b) => b.totalStarsEarned - a.totalStarsEarned)
    .slice(0, limit);
}

/**
 * Get referral rewards tiers
 */
export function getReferralTiers(): Array<{
  tier: string;
  referralsNeeded: number;
  starsBonus: number;
  benefits: string[];
}> {
  return [
    {
      tier: 'Rookie Referrer',
      referralsNeeded: 1,
      starsBonus: 50,
      benefits: ['Earn 50 stars per referral', 'Share your code with friends'],
    },
    {
      tier: 'Chief Recruiter',
      referralsNeeded: 5,
      starsBonus: 75,
      benefits: ['Earn 75 stars per referral', 'Exclusive referral badge', 'Early access to deals'],
    },
    {
      tier: 'Captain of Savings',
      referralsNeeded: 10,
      starsBonus: 100,
      benefits: [
        'Earn 100 stars per referral',
        'VIP referral badge',
        'Priority customer support',
        'Monthly bonus stars',
      ],
    },
    {
      tier: 'President of Groceries',
      referralsNeeded: 25,
      starsBonus: 150,
      benefits: [
        'Earn 150 stars per referral',
        'Legendary status',
        'Free premium features',
        'Exclusive merchandise',
        'Featured on leaderboard',
      ],
    },
  ];
}

/**
 * Generate referral share message
 */
export function generateShareMessage(userName: string, referralCode: string): {
  whatsapp: string;
  sms: string;
  email: string;
} {
  return {
    whatsapp: `🔥 Hey! I'm saving BIG on groceries with Mzansi Specials! 💰\n\nUse my referral code: ${referralCode}\n\nEarn 50 bonus ⭐ stars just for signing up!\n\nDownload now and start saving: https://mzansispec.app`,
    sms: `Mzansi Specials: Save on groceries! Use code ${referralCode} to earn 50 bonus stars. Download: https://mzansispec.app`,
    email: `Join me on Mzansi Specials!\n\nHi there!\n\n${userName} is saving big on groceries with Mzansi Specials and wants you to join too!\n\nUse referral code: ${referralCode}\n\nYou'll earn 50 bonus stars just for signing up!\n\nStart saving today: https://mzansispec.app`,
  };
}

/**
 * Get referral bonus breakdown
 */
export function getReferralBonusBreakdown(): {
  action: string;
  starsEarned: number;
  description: string;
}[] {
  return [
    {
      action: 'Friend signs up',
      starsEarned: 50,
      description: 'Your friend joins using your code',
    },
    {
      action: 'Friend scans first product',
      starsEarned: 25,
      description: 'Your friend scans their first barcode',
    },
    {
      action: 'Friend uploads first receipt',
      starsEarned: 50,
      description: 'Your friend uploads their first receipt',
    },
    {
      action: 'Friend reaches Chief tier',
      starsEarned: 100,
      description: 'Your friend reaches Chief tier (2 stars)',
    },
    {
      action: 'Friend reaches Captain tier',
      starsEarned: 150,
      description: 'Your friend reaches Captain tier (3 stars)',
    },
    {
      action: 'Friend reaches President tier',
      starsEarned: 200,
      description: 'Your friend reaches President tier (4 stars)',
    },
  ];
}
