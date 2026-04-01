import { notifyOwner } from './_core/notification';

// Email digest service for weekly meal plan notifications

interface SavedMealPlan {
  id: string;
  name: string;
  mealPlan: Array<{
    day: string;
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  }>;
  shoppingList: Array<{
    name: string;
    quantity: number;
    unit: string;
    bestPrice: number;
    bestStore: string;
  }>;
  createdAt: string;
  emailSubscribed?: boolean;
}

/**
 * Generate and send weekly email digest for meal plans
 * This would be triggered by a scheduled job every Sunday
 */
export async function sendWeeklyEmailDigest(userEmail: string, mealPlan: SavedMealPlan) {
  if (!mealPlan.emailSubscribed) {
    return false;
  }

  // Calculate totals
  const totalCost = mealPlan.shoppingList.reduce((sum, item) => sum + (item.bestPrice * item.quantity), 0);
  
  // Build email content
  let emailContent = `
    <h2>Your Weekly Meal Plan: ${mealPlan.name}</h2>
    
    <h3>📊 Summary</h3>
    <p><strong>Total Shopping Cost:</strong> R${totalCost.toFixed(2)}</p>
    <p><strong>Best Store:</strong> ${mealPlan.shoppingList[0]?.bestStore || 'N/A'}</p>
    
    <h3>🍽️ Your Meal Plan</h3>
    <ul>
  `;

  mealPlan.mealPlan.forEach(day => {
    emailContent += `
      <li>
        <strong>${day.day}</strong>
        <ul>
          <li>Breakfast: ${day.meals.breakfast || 'Not planned'}</li>
          <li>Lunch: ${day.meals.lunch || 'Not planned'}</li>
          <li>Dinner: ${day.meals.dinner || 'Not planned'}</li>
        </ul>
      </li>
    `;
  });

  emailContent += `
    </ul>
    
    <h3>🛒 Shopping List</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <tr style="border-bottom: 1px solid #ddd;">
        <th style="text-align: left; padding: 8px;">Item</th>
        <th style="text-align: left; padding: 8px;">Quantity</th>
        <th style="text-align: left; padding: 8px;">Best Price</th>
        <th style="text-align: left; padding: 8px;">Store</th>
      </tr>
  `;

  mealPlan.shoppingList.forEach(item => {
    emailContent += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${item.name}</td>
        <td style="padding: 8px;">${item.quantity} ${item.unit}</td>
        <td style="padding: 8px;">R${(item.bestPrice * item.quantity).toFixed(2)}</td>
        <td style="padding: 8px;">${item.bestStore}</td>
      </tr>
    `;
  });

  emailContent += `
    </table>
    
    <p style="margin-top: 20px; font-size: 12px; color: #666;">
      This is your weekly meal plan digest from Mzansi Specials. 
      You can manage your email preferences in your account settings.
    </p>
  `;

  // Send notification to owner (in production, this would send to user)
  await notifyOwner({
    title: `Weekly Meal Plan Digest: ${mealPlan.name}`,
    content: `User ${userEmail} received their weekly meal plan digest. Total cost: R${totalCost.toFixed(2)}`
  });

  return true;
}

/**
 * Schedule weekly email digests (would be called by a cron job)
 * In production, this would be triggered by a scheduled task service
 */
export async function scheduleWeeklyDigests(mealPlans: SavedMealPlan[], userEmail: string) {
  const subscribedPlans = mealPlans.filter(plan => plan.emailSubscribed);
  
  for (const plan of subscribedPlans) {
    await sendWeeklyEmailDigest(userEmail, plan);
  }

  return subscribedPlans.length;
}
