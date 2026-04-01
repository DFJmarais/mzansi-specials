# Developer Account Setup & Submission Guide

## Overview
This guide walks you through setting up Apple Developer and Google Play Developer accounts, and submitting Mzansi Specials to both app stores.

---

## Part 1: Apple Developer Account Setup

### 1.1 Create Apple Developer Account

**Step 1: Visit Apple Developer**
- Go to https://developer.apple.com
- Click "Account" in top right
- Click "Sign in"

**Step 2: Sign in or Create Apple ID**
- Use existing Apple ID or create new one
- Verify email address
- Set up two-factor authentication

**Step 3: Enroll in Apple Developer Program**
- Go to https://developer.apple.com/programs/
- Click "Enroll"
- Select "Individual" or "Organization"
- Pay $99 USD annual fee
- Accept terms and conditions
- Complete enrollment (takes 24-48 hours)

### 1.2 Set Up App Store Connect

**Step 1: Access App Store Connect**
- Go to https://appstoreconnect.apple.com
- Sign in with Apple ID
- Accept latest agreements

**Step 2: Create App**
- Click "My Apps"
- Click "+"
- Select "New App"
- Fill in app information:
  - **Platform**: iOS
  - **App Name**: Mzansi Specials
  - **Bundle ID**: com.mzansispecials.app
  - **SKU**: MZANSI-SPECIALS-001
  - **User Access**: Full Access

**Step 3: Configure App Information**
- Go to "App Information"
- Set:
  - **Category**: Shopping
  - **Content Rating**: 4+
  - **Privacy Policy URL**: https://mzansispec-2ypgsq5z.manus.space/privacy

### 1.3 Set Up Certificates & Provisioning Profiles

**In Xcode:**
1. Open Xcode preferences: Xcode → Preferences
2. Go to "Accounts"
3. Add your Apple ID
4. Select your team
5. Click "Manage Certificates"
6. Create signing certificate if needed

**In App Store Connect:**
1. Go to "Certificates, Identifiers & Profiles"
2. Create App ID (if not auto-created)
3. Create provisioning profile
4. Download and install in Xcode

### 1.4 Configure In-App Purchases

**For Subscription Tiers:**
1. In App Store Connect, go to "In-App Purchases"
2. Click "+"
3. Create subscription:

**Plus Subscription:**
- Product ID: `com.mzansispecials.plus`
- Reference Name: Plus Subscription
- Subscription Duration: Monthly
- Price: R19.99
- Localization: Add for all languages

**Pro Subscription:**
- Product ID: `com.mzansispecials.pro`
- Reference Name: Pro Subscription
- Subscription Duration: Monthly
- Price: R49.99
- Localization: Add for all languages

---

## Part 2: Google Play Developer Account Setup

### 2.1 Create Google Play Developer Account

**Step 1: Visit Google Play Console**
- Go to https://play.google.com/console
- Sign in with Google account (create if needed)

**Step 2: Pay Registration Fee**
- Pay $25 USD one-time fee
- Complete payment verification

**Step 3: Accept Developer Agreement**
- Accept Google Play Developer Program Policies
- Accept Developer Distribution Agreement
- Complete registration

### 2.2 Create App in Google Play

**Step 1: Create New App**
- Click "Create app"
- Fill in:
  - **App name**: Mzansi Specials
  - **Default language**: English
  - **App or game**: App
  - **Category**: Shopping
  - **Free or paid**: Free (with in-app purchases)

**Step 2: Accept Declarations**
- Accept all required declarations
- Click "Create app"

### 2.3 Set Up Google Play Billing

**Step 1: Configure Merchant Account**
- Go to "Payments profile"
- Add payment information
- Set up merchant account

**Step 2: Create In-App Products**

**Plus Subscription:**
1. Go to "Products" → "Subscriptions"
2. Click "Create subscription"
3. Fill in:
   - Product ID: `com.mzansispecials.plus`
   - Title: Plus Subscription
   - Description: Unlimited products, price alerts, barcode scanning
   - Billing Period: Monthly
   - Price: R19.99

**Pro Subscription:**
1. Create another subscription
2. Fill in:
   - Product ID: `com.mzansispecials.pro`
   - Title: Pro Subscription
   - Description: All Plus features + receipt OCR, advanced analytics
   - Billing Period: Monthly
   - Price: R49.99

---

## Part 3: Generating Signed Builds

### 3.1 iOS Build (Xcode)

**Prerequisites:**
- Xcode installed
- Apple Developer account with valid certificates
- App provisioning profile

**Build Steps:**

```bash
# 1. Navigate to project
cd /home/ubuntu/mzansi-specials

# 2. Build web assets
pnpm build

# 3. Sync Capacitor
npx cap sync ios

# 4. Open Xcode
open ios/App/App.xcworkspace
```

**In Xcode:**

1. Select project in navigator
2. Select "Mzansi Specials" target
3. Go to "General" tab
4. Update version (e.g., 1.0.0)
5. Update build number (e.g., 1)
6. Select "Signing & Capabilities"
7. Select your team from dropdown
8. Product → Archive
9. Wait for build to complete
10. Click "Validate App" (fix any errors)
11. Click "Distribute App" → "App Store Connect" → "Upload"

**Output:** Archive ready in Organizer

### 3.2 Android Build (Gradle)

**Prerequisites:**
- Java/JDK installed
- Keystore file created (see below)
- Android SDK configured

**Create Keystore (One-time):**

```bash
cd /home/ubuntu/mzansi-specials/android

# Generate keystore
keytool -genkey -v -keystore mzansi-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mzansi-release

# When prompted, enter:
# - Keystore password: (save this securely!)
# - Key password: (save this securely!)
# - Your name, organization, city, state, country
```

**Configure Gradle Signing:**

Edit `android/app/build.gradle`:

```gradle
android {
  signingConfigs {
    release {
      storeFile file('mzansi-release.keystore')
      storePassword 'YOUR_KEYSTORE_PASSWORD'
      keyAlias 'mzansi-release'
      keyPassword 'YOUR_KEY_PASSWORD'
    }
  }
  
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

**Build AAB (Recommended):**

```bash
cd /home/ubuntu/mzansi-specials/android

# Build release bundle
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

**Build APK (Alternative):**

```bash
cd /home/ubuntu/mzansi-specials/android

# Build release APK
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

---

## Part 4: Creating App Store Screenshots

### 4.1 Screenshot Specifications

**iOS Screenshots:**
- Resolution: 1284x2778 pixels (iPhone 14 Pro Max)
- Format: PNG or JPG
- Quantity: 5-8 per language
- Text overlay: Optional (use for marketing)

**Android Screenshots:**
- Resolution: 1080x1920 pixels
- Format: PNG or JPG
- Quantity: 5-8 per language
- Text overlay: Optional

### 4.2 Screenshot Content

**Screenshot 1: Home Screen**
- Show app title and tagline
- Display featured deals
- Show search bar
- Include language switcher

**Screenshot 2: Browse Products**
- Show category filters
- Display product listings
- Show price comparisons
- Highlight best deals

**Screenshot 3: Price Comparison**
- Show product details
- Display prices from multiple stores
- Highlight best price
- Show savings amount

**Screenshot 4: Shopping List**
- Show shopping list creation
- Display items with prices
- Show total cost
- Show share option

**Screenshot 5: Language Selection**
- Show language switcher
- Display all 11 languages
- Demonstrate multilingual support

**Screenshot 6: Subscription Tiers** (Optional)
- Show Free, Plus, Pro tiers
- Display pricing
- Show features included

**Screenshot 7: Price Alerts** (Optional)
- Show price alert notifications
- Display alert settings
- Show notification history

**Screenshot 8: Barcode Scanner** (Optional)
- Show barcode scanning feature
- Display scanned product
- Show price comparison

### 4.3 Creating Screenshots

**Option 1: Manual Screenshots**
1. Run app on device/emulator
2. Navigate to each screen
3. Take screenshot (Cmd+S on iOS, Power+Volume Down on Android)
4. Crop to required resolution
5. Add text overlays if desired

**Option 2: Automated Screenshots**
```bash
# For iOS (using Xcode)
xcodebuild test -scheme MzansiSpecials -derivedDataPath build \
  -destination 'platform=iOS Simulator,name=iPhone 14 Pro Max' \
  -testingOptions screenshots

# For Android (using Android Studio)
./gradlew connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.mzansispecials.ScreenshotTest
```

### 4.4 Uploading Screenshots

**iOS (App Store Connect):**
1. Go to "Screenshots" section
2. Select device type (iPhone 6.7-inch, etc.)
3. Drag and drop screenshots in order
4. Add optional caption for each
5. Repeat for other device sizes

**Android (Google Play Console):**
1. Go to "Screenshots" section
2. Drag and drop screenshots in order
3. Add optional description
4. Save

---

## Part 5: Submission Checklist

### Pre-Submission
- [ ] App builds successfully for iOS
- [ ] App builds successfully for Android
- [ ] All 11 languages tested
- [ ] Language switching works
- [ ] Subscription system tested
- [ ] All links working (privacy, support, etc.)
- [ ] No crashes or errors
- [ ] Performance optimized
- [ ] Battery usage acceptable
- [ ] Screenshots prepared (5-8 per platform)
- [ ] App icon meets specifications
- [ ] Privacy policy updated and accessible
- [ ] Support URL configured
- [ ] In-app purchases configured
- [ ] Content rating completed

### iOS Submission
- [ ] Xcode archive created
- [ ] Archive validated
- [ ] App Store listing completed
- [ ] Screenshots uploaded
- [ ] Pricing configured
- [ ] In-app purchases set up
- [ ] Content rating submitted
- [ ] Review information filled
- [ ] Submitted for review
- [ ] Monitor review status

### Android Submission
- [ ] Signed APK/AAB created
- [ ] Google Play listing completed
- [ ] Screenshots uploaded
- [ ] Pricing configured
- [ ] In-app products set up
- [ ] Content rating completed
- [ ] Target audience set
- [ ] Submitted for review
- [ ] Monitor review status

---

## Part 6: Submission Timeline

| Task | Duration | Notes |
|------|----------|-------|
| Create Apple Developer account | 24-48 hours | Enrollment takes time |
| Create Google Play account | Instant | $25 fee required |
| Prepare iOS build | 1-2 hours | Xcode archive + upload |
| Prepare Android build | 2-3 hours | Gradle build + signing |
| Create screenshots | 1-2 hours | 5-8 per platform |
| iOS submission | 24-48 hours | Apple review time |
| Android submission | 2-3 hours | Google review time |
| **Total time to launch** | **3-5 days** | From account creation to live |

---

## Part 7: Post-Launch

### Monitoring
- Track app ratings and reviews
- Monitor crash reports
- Check user feedback
- Track downloads and retention
- Monitor subscription conversion

### Updates
- Plan regular feature updates
- Fix bugs reported by users
- Improve performance
- Add new retailers/products
- Update translations

### Marketing
- Promote on social media
- Get press coverage
- Encourage user reviews
- Run promotional campaigns
- Partner with retailers

---

## Important Security Notes

### Keystore File
- **KEEP SAFE**: Your keystore file is required for all future Android updates
- **BACKUP**: Store in secure location
- **PASSWORD**: Save keystore and key passwords securely
- **LOSS**: If lost, you cannot update your app - you must create new app

### API Keys
- Never commit API keys to git
- Use environment variables
- Rotate keys regularly
- Monitor key usage

### Certificates
- Keep Apple certificates current
- Renew before expiration
- Store securely
- Backup provisioning profiles

---

## Troubleshooting

### iOS Issues

| Problem | Solution |
|---------|----------|
| "No provisioning profile found" | Create provisioning profile in Apple Developer portal |
| "Certificate not trusted" | Regenerate certificate and provisioning profile |
| "App rejected for crashes" | Test thoroughly on real device, fix bugs |
| "Missing privacy policy" | Add privacy policy URL in App Store Connect |

### Android Issues

| Problem | Solution |
|---------|----------|
| "Build fails" | Check Java/JDK version, update gradle |
| "Signing error" | Verify keystore file path and passwords |
| "App not installing" | Check Android version compatibility |
| "Rejected for malware" | Run security scan, check dependencies |

---

## Support Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Google Play Developer Help](https://support.google.com/googleplay/android-developer)
- [Capacitor iOS Deployment](https://capacitorjs.com/docs/ios)
- [Capacitor Android Deployment](https://capacitorjs.com/docs/android)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

**Status**: Ready for developer account setup and submission
**Last Updated**: April 1, 2026
