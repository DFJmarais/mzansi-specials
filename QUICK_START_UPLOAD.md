# Mzansi Specials - Quick Start Upload Guide

## Overview
This is a simplified guide to upload your app to App Store and Google Play Store in the fastest way possible.

---

## Step 1: Create Developer Accounts (5 minutes each)

### Apple Developer Account
1. Go to https://developer.apple.com
2. Click "Account" → "Sign in"
3. Use Apple ID (create if needed)
4. Pay $99 USD annual fee
5. Wait 24-48 hours for approval

### Google Play Developer Account
1. Go to https://play.google.com/console
2. Sign in with Google account
3. Pay $25 USD one-time fee
4. Instant approval

---

## Step 2: Generate Signed Builds (30 minutes)

### iOS Build

**Open Xcode and build:**
```bash
cd /home/ubuntu/mzansi-specials
pnpm build
npx cap sync ios
open ios/App/App.xcworkspace
```

**In Xcode:**
1. Select "Mzansi Specials" target
2. Go to "General" → Update version to "1.0.0"
3. Go to "Signing & Capabilities" → Select your team
4. Product → Archive
5. Wait for build to complete
6. Click "Validate App"
7. Click "Distribute App" → "App Store Connect" → "Upload"

**Output:** Build uploaded to App Store Connect

### Android Build

**Generate signed APK:**
```bash
cd /home/ubuntu/mzansi-specials/android

# Create keystore (one-time only)
keytool -genkey -v -keystore mzansi-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mzansi-release

# When prompted:
# - Keystore password: (save this!)
# - Key password: (save this!)
# - Your name, org, city, state, country

# Build signed APK
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

---

## Step 3: Upload to App Stores (15 minutes)

### iOS App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Click "My Apps" → "Mzansi Specials"
3. Go to "TestFlight" → "iOS Builds"
4. Your build should appear automatically
5. Click "Submit for Review"
6. Fill in review information:
   - Notes for Reviewer: "Grocery price comparison app for South Africa"
   - Contact Information: Your email
   - Demo Account: Not required
7. Click "Submit"
8. **Status:** Under Review (24-48 hours)

### Google Play Console

1. Go to https://play.google.com/console
2. Click "Mzansi Specials"
3. Go to "Release" → "Production"
4. Click "Create new release"
5. Upload APK: `app/build/outputs/apk/release/app-release.apk`
6. Fill in release notes: "Initial release - Grocery price comparison"
7. Click "Review release"
8. Click "Start rollout to Production"
9. **Status:** Live (2-3 hours)

---

## Step 4: Add App Store Listings (20 minutes)

### iOS App Store Connect

1. Go to "App Information"
2. Fill in:
   - **Subtitle:** "Save Big Today - Compare Grocery Prices"
   - **Description:** "Find the best grocery deals across South African stores. Compare prices instantly from Spar, Pick n Pay, Checkers, OK Foods and more. Supports all 11 South African languages."
   - **Keywords:** "grocery, prices, comparison, deals, shopping, South Africa"
   - **Category:** Shopping
   - **Content Rating:** 4+

3. Go to "Screenshots"
4. Upload 5-8 screenshots (1284x2778 pixels)
5. Go to "Pricing and Availability"
6. Set to "Worldwide"

### Google Play Console

1. Go to "Store listing"
2. Fill in:
   - **Short description:** "Find the best grocery deals across South African stores"
   - **Full description:** "Find the best grocery deals across South African stores. Compare prices instantly from Spar, Pick n Pay, Checkers, OK Foods and more. Supports all 11 South African languages."
   - **Category:** Shopping
   - **Content rating:** Everyone

3. Go to "Screenshots"
4. Upload 5-8 screenshots (1080x1920 pixels)
5. Go to "Pricing and distribution"
6. Set to "Free with in-app purchases"

---

## Step 5: Configure In-App Purchases (10 minutes)

### iOS (App Store Connect)

1. Go to "In-App Purchases"
2. Click "+" → "Subscription"
3. Create "Plus Subscription":
   - Product ID: `com.mzansispecials.plus`
   - Reference Name: Plus Subscription
   - Subscription Duration: Monthly
   - Price: R19.99
4. Create "Pro Subscription":
   - Product ID: `com.mzansispecials.pro`
   - Reference Name: Pro Subscription
   - Subscription Duration: Monthly
   - Price: R49.99

### Android (Google Play Console)

1. Go to "Products" → "Subscriptions"
2. Click "Create subscription"
3. Create "Plus Subscription":
   - Product ID: `com.mzansispecials.plus`
   - Title: Plus Subscription
   - Billing Period: Monthly
   - Price: R19.99
4. Create "Pro Subscription":
   - Product ID: `com.mzansispecials.pro`
   - Title: Pro Subscription
   - Billing Period: Monthly
   - Price: R49.99

---

## Step 6: Add Screenshots (20 minutes)

### Screenshot Specifications

**iOS:**
- Resolution: 1284x2778 pixels
- Format: PNG or JPG
- Quantity: 5-8

**Android:**
- Resolution: 1080x1920 pixels
- Format: PNG or JPG
- Quantity: 5-8

### Quick Screenshots to Take

1. **Home Screen** - Show featured deals and search
2. **Browse Products** - Show category filters and products
3. **Price Comparison** - Show prices from multiple stores
4. **Shopping List** - Show list creation and total cost
5. **Language Selection** - Show all 11 languages

### How to Take Screenshots

**iOS:**
```bash
# Run app on simulator
open ios/App/App.xcworkspace

# In Xcode: Product → Run on Simulator
# Press Cmd+S to take screenshot
```

**Android:**
```bash
# Run app on emulator
open android

# In Android Studio: Build → Build Bundle(s) / APK(s)
# Run on emulator
# Press Power + Volume Down to take screenshot
```

---

## Step 7: Monitor Review Status

### iOS
- **Status:** Under Review (24-48 hours typically)
- **Check:** App Store Connect → "My Apps" → "Mzansi Specials" → "General"
- **Approval:** App will appear on App Store automatically

### Android
- **Status:** Live (2-3 hours typically)
- **Check:** Google Play Console → "Mzansi Specials" → "Release overview"
- **Live:** App will appear on Google Play Store automatically

---

## Troubleshooting

### iOS Build Issues
| Problem | Solution |
|---------|----------|
| "No provisioning profile" | Xcode → Preferences → Accounts → Select team |
| "Certificate not trusted" | Regenerate certificate in Apple Developer portal |
| "Archive failed" | Check build errors in Xcode, fix TypeScript errors |

### Android Build Issues
| Problem | Solution |
|---------|----------|
| "Build failed" | Run `./gradlew clean` then retry |
| "Signing error" | Verify keystore file path and passwords |
| "APK not installing" | Check Android version compatibility |

### Upload Issues
| Problem | Solution |
|---------|----------|
| "Build not appearing" | Wait 5-10 minutes for processing |
| "Upload rejected" | Check file format and size requirements |
| "Screenshots rejected" | Verify resolution and format |

---

## Timeline

| Step | Duration | Total Time |
|------|----------|-----------|
| Create accounts | 10 min | 10 min |
| Generate builds | 30 min | 40 min |
| Upload to stores | 15 min | 55 min |
| Add listings | 20 min | 75 min |
| Configure purchases | 10 min | 85 min |
| Add screenshots | 20 min | 105 min |
| **Total** | - | **~2 hours** |

**Time to Live:**
- iOS: 24-48 hours after submission
- Android: 2-3 hours after upload

---

## Important Notes

### Keystore File (Android)
- **SAVE THIS FILE!** You need it for all future updates
- Store in secure location with password
- If lost, you cannot update your app

### App Store Connect (iOS)
- Keep Apple Developer account active ($99/year)
- Renew certificates before expiration
- Monitor app reviews and ratings

### Google Play Console (Android)
- One-time $25 fee
- Monitor app reviews and ratings
- Update app regularly with new features

---

## Success Criteria

✅ App appears on App Store within 24-48 hours
✅ App appears on Google Play Store within 2-3 hours
✅ Subscription tiers available for purchase
✅ All 11 languages working
✅ Price comparison feature working
✅ Shopping list feature working

---

**Status:** Ready for upload
**Last Updated:** April 1, 2026
