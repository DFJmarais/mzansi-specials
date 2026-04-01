# Android Google Play Store Submission - Step-by-Step Guide

## Prerequisites
- Google Play Developer Account ($25 one-time fee)
- Android build ready (see Build Instructions below)
- App icons (512x512 PNG and adaptive icons)
- Screenshots (5-8 per language)
- Privacy policy URL
- Support URL
- Signed APK or AAB (Android App Bundle)

## Step 1: Prepare Your Build

### 1.1 Update Version Information
```bash
cd /home/ubuntu/mzansi-specials

# Build the app
pnpm build

# Sync with Capacitor
npx cap sync android
```

### 1.2 Configure Android Project

1. Open Android Studio:
   ```bash
   open android
   ```

2. Update `android/app/build.gradle`:
   ```gradle
   android {
     compileSdk 34
     
     defaultConfig {
       applicationId "com.mzansispecials.app"
       minSdk 24
       targetSdk 34
       versionCode 1
       versionName "1.0.0"
     }
   }
   ```

3. Update `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application
     android:label="@string/app_name"
     android:icon="@mipmap/ic_launcher"
     android:roundIcon="@mipmap/ic_launcher_round">
   ```

### 1.3 Add App Icon

1. In Android Studio: right-click `res` folder
2. Select "New" → "Image Asset"
3. Configure:
   - **Asset Type**: Launcher Icons
   - **Image File**: Select your 512x512 PNG
   - **Foreground**: Your logo
   - **Background**: White or transparent
4. Click "Next" → "Finish"

### 1.4 Create Keystore for Signing

```bash
cd /home/ubuntu/mzansi-specials/android

# Generate keystore (one-time only)
keytool -genkey -v -keystore mzansi-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mzansi-release

# Enter password when prompted (save this!)
# Fill in your information when prompted
```

### 1.5 Configure Gradle Signing

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

## Step 2: Build Signed APK/AAB

### 2.1 Build Android App Bundle (Recommended)

```bash
cd /home/ubuntu/mzansi-specials/android

# Build release bundle
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

### 2.2 Build Signed APK (Alternative)

```bash
cd /home/ubuntu/mzansi-specials/android

# Build release APK
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

### 2.3 Verify Build

```bash
# Check APK/AAB was created
ls -lh android/app/build/outputs/bundle/release/app-release.aab
# or
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

## Step 3: Create Google Play Listing

### 3.1 Log in to Google Play Console

1. Go to https://play.google.com/console
2. Sign in with Google account
3. Accept terms if first time

### 3.2 Create New App

1. Click "Create app"
2. Fill in:
   - **App name**: Mzansi Specials
   - **Default language**: English
   - **App or game**: App
   - **Category**: Shopping
3. Accept declarations
4. Click "Create app"

### 3.3 Fill in Store Listing

**App Icon**
1. Go to "Store listing"
2. Upload 512x512 PNG icon
3. Format: PNG, RGB, no transparency

**Feature Graphic**
1. Upload 1024x500 PNG banner
2. This appears at top of store listing

**Screenshots**
1. Go to "Screenshots" section
2. Upload 5-8 screenshots (1080x1920 pixels):
   - Screenshot 1: Home screen
   - Screenshot 2: Browse products
   - Screenshot 3: Price comparison
   - Screenshot 4: Shopping list
   - Screenshot 5: Language selection
   - Screenshot 6: Subscription tiers
   - Screenshot 7: Price alerts
   - Screenshot 8: Barcode scanner

**Short Description** (80 characters max)
```
Find the best grocery deals across South African stores. Compare prices instantly.
```

**Full Description**
- See APP_STORE_SUBMISSION_GUIDE.md for full text

**Category**
- Select: Shopping

**Contact Details**
- Email: support@mzansispecials.com
- Website: https://mzansispec-2ypgsq5z.manus.space

**Privacy Policy**
- URL: https://mzansispec-2ypgsq5z.manus.space/privacy

**Support URL**
- https://mzansispec-2ypgsq5z.manus.space/support

### 3.4 Content Rating

1. Go to "Content rating"
2. Click "Set up your content rating questionnaire"
3. Select category: Apps
4. Answer questions about:
   - Violence
   - Sexual content
   - Profanity
   - Alcohol/tobacco
   - Gambling
   - Data collection
5. Submit questionnaire
6. Google assigns content rating

### 3.5 Pricing and Distribution

1. Go to "Pricing and distribution"
2. Select "Free" or "Paid"
3. For in-app purchases:
   - Free tier: R0
   - Plus tier: R19.99/month
   - Pro tier: R49.99/month
4. Select countries (recommend "Worldwide")
5. Accept content guidelines
6. Click "Save"

### 3.6 Create In-App Products

1. Go to "Products" → "Subscriptions"
2. Click "Create subscription"
3. Fill in:
   - **Product ID**: com.mzansispecials.plus
   - **Title**: Plus Subscription
   - **Description**: Unlimited products, price alerts, barcode scanning
   - **Billing Period**: Monthly
   - **Price**: R19.99
4. Click "Save"
5. Repeat for Pro tier (com.mzansispecials.pro, R49.99)

### 3.7 Target Audience

1. Go to "Target audience"
2. Select:
   - **Age**: 3+
   - **Intended users**: Families, Adults
   - **Content guidelines**: Accept all
3. Click "Save"

## Step 4: Upload Build

### 4.1 Go to Release Section

1. Go to "Release" → "Production"
2. Click "Create new release"

### 4.2 Upload APK/AAB

1. Click "Browse files"
2. Select your signed APK or AAB:
   - `android/app/build/outputs/bundle/release/app-release.aab` (recommended)
   - OR `android/app/build/outputs/apk/release/app-release.apk`
3. Wait for upload to complete

### 4.3 Add Release Notes

1. Enter release notes:
   ```
   Version 1.0.0 - Initial Release
   
   Features:
   - Compare prices across 6+ major retailers
   - Browse products by category
   - Create and manage shopping lists
   - Price alerts and notifications
   - Support for 11 South African languages
   - Offline access to shopping lists
   ```
2. Click "Save"

### 4.4 Review Before Publishing

1. Check all information is correct
2. Verify screenshots and descriptions
3. Confirm pricing and in-app products
4. Review content rating

## Step 5: Submit for Review

1. Click "Review release"
2. Check for any warnings or errors
3. Click "Start rollout to Production"
4. Select rollout percentage (start with 5-10%, then increase)
5. Confirm submission
6. Wait for Google's review (typically 2-3 hours)

## Step 6: Monitor Review Status

1. Log in to Google Play Console
2. Go to "Release" → "Production"
3. Check status:
   - **In review**: Being reviewed
   - **Approved**: Ready to publish
   - **Rejected**: Fix issues and resubmit

## Common Rejection Reasons

| Issue | Solution |
|-------|----------|
| Crashes on launch | Test thoroughly on real device |
| Broken links | Verify all URLs work |
| Missing privacy policy | Add privacy policy URL |
| Misleading content | Ensure accurate descriptions |
| Permissions not justified | Remove unnecessary permissions |
| Sensitive permissions | Add clear explanation in app |
| Subscription issues | Test in-app purchases thoroughly |
| Malware detected | Run security scan, check dependencies |

## After Approval

1. App appears on Google Play Store
2. Monitor downloads and reviews
3. Respond to user feedback
4. Plan updates and improvements
5. Submit new versions as needed

## Rollout Strategy

**Recommended Phased Rollout:**
1. **Day 1**: 5% rollout (test with small audience)
2. **Day 2**: 25% rollout (if no major issues)
3. **Day 3**: 50% rollout (expand reach)
4. **Day 4**: 100% rollout (full release)

This allows you to catch issues before full release.

## Important Notes

- **Testing**: Always test on real Android device before submission
- **Permissions**: Only request necessary permissions
- **Privacy**: Ensure privacy policy is accurate and accessible
- **Performance**: App must be responsive and crash-free
- **Compliance**: Follow Google Play policies
- **Support**: Provide working support URL and contact info
- **Keystore**: Keep your keystore file safe - you need it for future updates

## Useful Links

- [Google Play Console](https://play.google.com/console)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)
- [Capacitor Android Deployment](https://capacitorjs.com/docs/android)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)

---

**Status**: Ready for submission
**Last Updated**: April 1, 2026
