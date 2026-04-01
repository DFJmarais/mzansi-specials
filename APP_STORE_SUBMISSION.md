# Mzansi Specials - App Store Submission Guide

## App Icons (CDN URLs)

### Rounded Icon (iOS App Store)
- **URL**: https://d2xsxph8kpxj0f.cloudfront.net/310519663467531875/2YpGsQ5zYUh2Xb4PxAFN6v/mzansi-app-icon-rounded_35b77762.jpg
- **Size**: 1024x1024px
- **Format**: JPEG
- **Use**: App Store Connect (iOS)

### Square Icon (Google Play Store)
- **URL**: https://d2xsxph8kpxj0f.cloudfront.net/310519663467531875/2YpGsQ5zYUh2Xb4PxAFN6v/mzansi-app-icon-square_3844d59e.jpg
- **Size**: 512x512px
- **Format**: JPEG
- **Use**: Google Play Console (Android)

## App Details

### App Name
**Mzansi Specials - Grocery Price Comparison**

### Tagline
**Save Big Today - Compare Prices Across South Africa's Top Retailers**

### Description
Mzansi Specials is your ultimate grocery shopping companion for South Africa. Compare real-time prices across 6 major retailers (Spar, Pick n Pay, Checkers, Woolworths, OK Foods, and Food Lovers Market) and find the best deals on over 1,500 products.

**Key Features:**
- 🛒 Browse 1,500+ grocery products across 9 categories
- 💰 Real-time price comparison across 6 retailers
- 📍 Find the cheapest products at stores near you
- 🔔 Price alerts - Get notified when prices drop
- 📋 Smart shopping lists with store optimization
- 🌍 Full support for all 11 official South African languages
- 📱 Works on iOS and Android

**Subscription Plans:**
- **Free**: Browse 50 products with basic search
- **Plus (R19.99/month)**: Full access to 1,500+ products, price alerts, shopping lists
- **Pro (R49.99/month)**: Everything in Plus + receipt scanning + analytics + priority support

### Keywords
grocery, price comparison, shopping, South Africa, deals, specials, Spar, Pick n Pay, Checkers, Woolworths, OK Foods, Food Lovers, save money, shopping list, price alerts

### Category
Shopping / Lifestyle

### Content Rating
4+ (All ages)

### Privacy Policy URL
https://mzansispec-2ypgsq5z.manus.space/privacy

### Support Email
support@mzansispecials.com

### Website
https://mzansispec-2ypgsq5z.manus.space

## Supported Languages
1. English
2. Afrikaans
3. isiZulu
4. isiXhosa
5. Sesotho
6. Setswana
7. isiNdebele
8. Tshivenda
9. Xitsonga
10. siSwati
11. Sepedi

## Technical Requirements

### iOS (App Store)
- **Minimum iOS Version**: iOS 14.0+
- **Device Types**: iPhone, iPad
- **Architecture**: ARM64
- **Build Tool**: Capacitor
- **Bundle ID**: com.mzansispecials.app

### Android (Google Play)
- **Minimum Android Version**: Android 8.0 (API 26)+
- **Target Android Version**: Android 14 (API 34)+
- **Architecture**: ARM64-v8a, ARMv7-a
- **Build Tool**: Capacitor
- **Package Name**: com.mzansispecials.app

## Subscription Configuration

### App Store Connect (iOS IAP)
- **Plus Subscription**: com.mzansispecials.plus (R19.99/month)
- **Pro Subscription**: com.mzansispecials.pro (R49.99/month)

### Google Play Console (Android IAP)
- **Plus Subscription**: com.mzansispecials.plus (R19.99/month)
- **Pro Subscription**: com.mzansispecials.pro (R49.99/month)

## Capacitor Configuration

```json
{
  "appId": "com.mzansispecials.app",
  "appName": "Mzansi Specials",
  "webDir": "dist",
  "plugins": {
    "InAppPurchase": {
      "ios": {
        "productIds": ["com.mzansispecials.plus", "com.mzansispecials.pro"]
      },
      "android": {
        "productIds": ["com.mzansispecials.plus", "com.mzansispecials.pro"]
      }
    }
  }
}
```

## Build Instructions

### iOS Build
```bash
npx cap add ios
npx cap build ios
# Then open in Xcode and configure signing
```

### Android Build
```bash
npx cap add android
npx cap build android
# Then open in Android Studio and configure signing
```

## Submission Checklist

### Before Submission
- [ ] All 11 languages fully translated and tested
- [ ] Language switching works correctly
- [ ] Subscription system integrated and tested
- [ ] IAP products created in both stores
- [ ] App icons uploaded (1024x1024 for iOS, 512x512 for Android)
- [ ] Screenshots captured (minimum 2-5 per platform)
- [ ] Privacy policy created and hosted
- [ ] Terms of service created and hosted
- [ ] Build signed with production certificates
- [ ] All permissions requested in manifest/Info.plist

### iOS App Store
1. Create app in App Store Connect
2. Upload build via Xcode or Transporter
3. Fill in app information (description, keywords, etc.)
4. Configure pricing and availability
5. Set up IAP products
6. Submit for review

### Google Play Store
1. Create app in Google Play Console
2. Upload signed APK/AAB
3. Fill in app information
4. Configure pricing and availability
5. Set up IAP products
6. Submit for review

## Testing

### Local Testing
```bash
# Test on iOS
npx cap run ios

# Test on Android
npx cap run android
```

### Subscription Testing
- Use App Store Sandbox (iOS) and Google Play Billing Library Test (Android)
- Test all three subscription tiers
- Verify feature gating works correctly
- Test upgrade/downgrade flows

## Performance Targets
- App startup time: < 3 seconds
- Product loading: < 2 seconds
- Language switching: < 500ms
- Concurrent users: 5,000+
- Success rate: 95%+

## Support
For questions about app store submission, contact: support@mzansispecials.com
