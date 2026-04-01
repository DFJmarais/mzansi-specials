/**
 * SMS/WhatsApp Notification Service
 * Sends price alerts and deal notifications to users
 */

import axios from 'axios';

interface NotificationPreferences {
  userId: string;
  phoneNumber: string;
  notificationType: 'sms' | 'whatsapp' | 'both';
  priceDropThreshold: number; // Alert if price drops by this percentage
  dealNotifications: boolean;
  weeklyDigest: boolean;
  enabled: boolean;
}

interface PriceAlert {
  productId: string;
  productName: string;
  previousPrice: number;
  currentPrice: number;
  discount: number;
  retailer: string;
  timestamp: Date;
}

/**
 * Send SMS notification using Twilio
 */
async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    // In production, use Twilio API
    // const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json', {
    //   From: process.env.TWILIO_PHONE_NUMBER,
    //   To: phoneNumber,
    //   Body: message,
    // }, {
    //   auth: {
    //     username: process.env.TWILIO_ACCOUNT_SID,
    //     password: process.env.TWILIO_AUTH_TOKEN,
    //   }
    // });

    console.log(`[SMS] Sending to ${phoneNumber}: ${message}`);
    return true;
  } catch (error) {
    console.error('[SMS] Error sending message:', error);
    return false;
  }
}

/**
 * Send WhatsApp notification using Twilio
 */
async function sendWhatsApp(phoneNumber: string, message: string): Promise<boolean> {
  try {
    // In production, use Twilio WhatsApp API
    // const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json', {
    //   From: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   To: `whatsapp:${phoneNumber}`,
    //   Body: message,
    // }, {
    //   auth: {
    //     username: process.env.TWILIO_ACCOUNT_SID,
    //     password: process.env.TWILIO_AUTH_TOKEN,
    //   }
    // });

    console.log(`[WhatsApp] Sending to ${phoneNumber}: ${message}`);
    return true;
  } catch (error) {
    console.error('[WhatsApp] Error sending message:', error);
    return false;
  }
}

/**
 * Send price drop alert
 */
export async function sendPriceAlert(
  preferences: NotificationPreferences,
  alert: PriceAlert
): Promise<boolean> {
  if (!preferences.enabled) {
    console.log(`[Notifications] Alerts disabled for user ${preferences.userId}`);
    return false;
  }

  const discountPercentage = ((alert.previousPrice - alert.currentPrice) / alert.previousPrice) * 100;

  if (discountPercentage < preferences.priceDropThreshold) {
    console.log(`[Notifications] Discount ${discountPercentage}% below threshold ${preferences.priceDropThreshold}%`);
    return false;
  }

  const message = `🔥 Price Drop Alert!\n\n${alert.productName}\n${alert.retailer}\n\nWas: R${alert.previousPrice.toFixed(2)}\nNow: R${alert.currentPrice.toFixed(2)}\nSave: R${(alert.previousPrice - alert.currentPrice).toFixed(2)} (${discountPercentage.toFixed(0)}% off)\n\nShop now on Mzansi Specials!`;

  let sent = false;

  if (preferences.notificationType === 'sms' || preferences.notificationType === 'both') {
    sent = await sendSMS(preferences.phoneNumber, message);
  }

  if (preferences.notificationType === 'whatsapp' || preferences.notificationType === 'both') {
    sent = await sendWhatsApp(preferences.phoneNumber, message);
  }

  return sent;
}

/**
 * Send deal notification
 */
export async function sendDealNotification(
  preferences: NotificationPreferences,
  productName: string,
  retailer: string,
  price: number,
  discount: number
): Promise<boolean> {
  if (!preferences.enabled || !preferences.dealNotifications) {
    return false;
  }

  const message = `🛍️ Hot Deal Alert!\n\n${productName}\n${retailer}\n\nPrice: R${price.toFixed(2)}\nDiscount: ${discount}% off\n\nAdd to your list on Mzansi Specials!`;

  let sent = false;

  if (preferences.notificationType === 'sms' || preferences.notificationType === 'both') {
    sent = await sendSMS(preferences.phoneNumber, message);
  }

  if (preferences.notificationType === 'whatsapp' || preferences.notificationType === 'both') {
    sent = await sendWhatsApp(preferences.phoneNumber, message);
  }

  return sent;
}

/**
 * Send weekly digest
 */
export async function sendWeeklyDigest(
  preferences: NotificationPreferences,
  deals: Array<{ productName: string; retailer: string; price: number; discount: number }>
): Promise<boolean> {
  if (!preferences.enabled || !preferences.weeklyDigest) {
    return false;
  }

  const dealsText = deals
    .slice(0, 5)
    .map((d) => `• ${d.productName} @ ${d.retailer} - R${d.price.toFixed(2)} (${d.discount}% off)`)
    .join('\n');

  const message = `📬 Your Weekly Mzansi Specials Digest\n\nTop Deals This Week:\n\n${dealsText}\n\nView more on Mzansi Specials!`;

  let sent = false;

  if (preferences.notificationType === 'sms' || preferences.notificationType === 'both') {
    sent = await sendSMS(preferences.phoneNumber, message);
  }

  if (preferences.notificationType === 'whatsapp' || preferences.notificationType === 'both') {
    sent = await sendWhatsApp(preferences.phoneNumber, message);
  }

  return sent;
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // South African phone number format: +27XXXXXXXXX or 0XXXXXXXXX
  const saPhoneRegex = /^(\+27|0)[0-9]{9}$/;
  return saPhoneRegex.test(phoneNumber);
}

/**
 * Format phone number to international format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith('0')) {
    return '+27' + phoneNumber.slice(1);
  }
  return phoneNumber;
}

/**
 * Initialize notification service
 */
export async function initializeNotificationService(): Promise<{
  status: string;
  message: string;
}> {
  console.log('[Notification Service] Initializing...');

  // Check Twilio credentials
  const hasTwilioConfig =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER;

  if (!hasTwilioConfig) {
    console.warn('[Notification Service] Twilio not configured - notifications disabled');
    return {
      status: 'warning',
      message: 'SMS/WhatsApp notifications not configured',
    };
  }

  console.log('[Notification Service] Initialized successfully');
  return {
    status: 'success',
    message: 'Notification service ready',
  };
}
