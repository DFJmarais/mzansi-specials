# Mzansi Specials - Local Build Instructions

## Overview
This guide provides step-by-step instructions to build signed iOS and Android apps on your local machine.

---

## Prerequisites

### For iOS Build
- Mac with macOS 12.0 or later
- Xcode 14.0 or later (download from App Store)
- Apple Developer account ($99/year)
- CocoaPods (install: `sudo gem install cocoapods`)

### For Android Build
- Java 17 or later (download from Oracle or use OpenJDK)
- Android Studio (download from https://developer.android.com/studio)
- Android SDK (installed via Android Studio)
- Google Play Developer account ($25 one-time)

---

## Step 1: Clone or Download Project

```bash
# If you have git access
git clone <your-repo-url> mzansi-specials
cd mzansi-specials

# OR download the project files
cd /path/to/mzansi-specials
```

---

## Step 2: Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# Or if using npm
npm install
```

---

## Step 3: Build Web Assets

```bash
# Build production web assets
pnpm build

# This creates optimized web files in dist/public
```

---

## Step 4: Sync Capacitor

```bash
# Sync web assets to native platforms
npx cap sync

# This copies web files to ios/App/App/public and android/app/src/main/assets
```

---

## iOS Build (Mac Only)

### Step 1: Open Xcode Project

```bash
# Open the Xcode workspace (NOT the .xcodeproj)
open ios/App/App.xcworkspace
```

### Step 2: Configure Signing

1. **Select Project:**
   - In Xcode, click "App" in the left navigator
   - Select "Mzansi Specials" target

2. **Configure Signing:**
   - Go to "Signing & Capabilities" tab
   - Select your Apple Developer Team from dropdown
   - Xcode will automatically create signing certificates

3. **Update Version:**
   - Go to "General" tab
   - Set Version: `1.0.0`
   - Set Build: `1`

### Step 3: Create Archive

1. **Select Device:**
   - In top toolbar, select "Any iOS Device (arm64)" or "Generic iOS Device"

2. **Create Archive:**
   - Product → Archive
   - Wait for build to complete (5-10 minutes)
   - Organizer window opens automatically

3. **Validate Archive:**
   - Click "Validate App"
   - Select your Apple Developer Team
   - Click "Validate"
   - Fix any errors if present

### Step 4: Upload to App Store Connect

1. **Distribute App:**
   - In Organizer, click "Distribute App"
   - Select "App Store Connect"
   - Select "Upload"
   - Select your Apple Developer Team
   - Click "Next"

2. **Review Signing:**
   - Verify signing certificate
   - Click "Next"

3. **Upload:**
   - Click "Upload"
   - Wait for upload to complete (5-10 minutes)
   - Build will appear in App Store Connect

### Step 5: Submit in App Store Connect

1. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com
   - Click "My Apps" → "Mzansi Specials"

2. **Add Build:**
   - Go to "TestFlight" → "iOS Builds"
   - Your build should appear automatically
   - Wait a few minutes if not visible

3. **Submit for Review:**
   - Go to "App Information" → "Pricing and Availability"
   - Ensure all information is complete
   - Click "Submit for Review"
   - Fill in review information
   - Click "Submit"

4. **Monitor Status:**
   - Status will show "Waiting for Review"
   - Apple typically reviews within 24-48 hours
   - You'll receive email when approved or rejected

---

## Android Build

### Step 1: Set Up Java 17

```bash
# Check Java version
java -version

# If not Java 17, install it:

# macOS (using Homebrew)
brew install openjdk@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Linux (Ubuntu/Debian)
sudo apt-get install openjdk-17-jdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Windows
# Download from https://www.oracle.com/java/technologies/downloads/#java17
# Set JAVA_HOME environment variable to installation path
```

### Step 2: Create Signing Keystore

```bash
cd /path/to/mzansi-specials/android

# Generate keystore (one-time only!)
keytool -genkey -v -keystore mzansi-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mzansi-release

# When prompted, enter:
# - Keystore password: mzansi123 (or your choice - SAVE THIS!)
# - Key password: mzansi123 (or your choice - SAVE THIS!)
# - Your name: Mzansi Specials
# - Organization: Mzansi
# - City: Johannesburg
# - State: Gauteng
# - Country: ZA

# IMPORTANT: Save the keystore file and passwords securely!
# You need them for all future app updates
```

### Step 3: Configure Gradle Signing

The signing configuration has already been added to `android/app/build.gradle`:

```gradle
signingConfigs {
    release {
        storeFile file('mzansi-release.keystore')
        storePassword 'mzansi123'
        keyAlias 'mzansi-release'
        keyPassword 'mzansi123'
    }
}
```

If you used different passwords, update the values above.

### Step 4: Build Signed APK

```bash
cd /path/to/mzansi-specials/android

# Clean previous builds
./gradlew clean

# Build signed release APK
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

**Build time:** 5-15 minutes (first build is slower)

### Step 5: Build App Bundle (Recommended)

```bash
cd /path/to/mzansi-specials/android

# Build signed App Bundle (AAB)
./gradlew bundleRelease

# Output: app/build/outputs/bundle/release/app-release.aab
```

**Note:** Google Play Store prefers App Bundles (AAB) over APKs. Use this for store submission.

### Step 6: Upload to Google Play Console

1. **Go to Google Play Console:**
   - https://play.google.com/console
   - Click "Mzansi Specials"

2. **Create Release:**
   - Go to "Release" → "Production"
   - Click "Create new release"

3. **Upload Build:**
   - Click "Upload" under "App bundles"
   - Select `app/build/outputs/bundle/release/app-release.aab`
   - Wait for upload to complete

4. **Add Release Notes:**
   - Fill in release notes: "Initial release - Grocery price comparison app"
   - Click "Save"

5. **Review Release:**
   - Click "Review release"
   - Verify all information is correct
   - Click "Start rollout to Production"

6. **Monitor Status:**
   - Status will show "Pending publication"
   - Google typically reviews within 2-3 hours
   - App will go live automatically after approval

---

## Troubleshooting

### iOS Issues

| Error | Solution |
|-------|----------|
| "No provisioning profile found" | Go to Xcode Preferences → Accounts → Select Team |
| "Certificate not trusted" | Regenerate certificate in Apple Developer portal |
| "Build failed: Signing error" | Check team selection and provisioning profile |
| "Archive failed" | Check for TypeScript errors: `pnpm build` |
| "Upload failed" | Check internet connection and Apple Developer account status |

### Android Issues

| Error | Solution |
|-------|----------|
| "Java 17 required" | Install Java 17 and set JAVA_HOME environment variable |
| "Build failed" | Run `./gradlew clean` then retry |
| "Signing error" | Verify keystore file path and passwords in build.gradle |
| "APK not installing" | Check Android version compatibility (min API 24) |
| "Upload failed" | Verify Google Play Developer account and payment method |

---

## Build Output Locations

### iOS
- **Archive:** `~/Library/Developer/Xcode/Archives/`
- **Uploaded to:** App Store Connect (automatic)

### Android
- **APK:** `android/app/build/outputs/apk/release/app-release.apk`
- **AAB:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## Important Notes

### Keystore File (Android)
```
⚠️ CRITICAL: Keep your keystore file safe!
- Location: android/mzansi-release.keystore
- Password: mzansi123 (or your custom password)
- You MUST use the same keystore for all future updates
- If lost, you cannot update your app - must create new app
```

### Signing Certificates (iOS)
```
⚠️ IMPORTANT: Keep your certificates current
- Certificates expire after 1 year
- Renew before expiration
- Store securely
```

---

## Next Steps After Build

1. **Monitor App Review:**
   - iOS: Check App Store Connect daily for review status
   - Android: Check Google Play Console for approval

2. **Prepare Marketing:**
   - Write app description
   - Create app store screenshots
   - Plan launch announcement

3. **Test on Real Devices:**
   - Download app from store when available
   - Test all features
   - Verify subscriptions work

4. **Gather User Feedback:**
   - Monitor app ratings and reviews
   - Fix bugs reported by users
   - Plan feature updates

---

## Support Resources

- [Xcode Documentation](https://developer.apple.com/xcode/)
- [Android Studio Documentation](https://developer.android.com/studio/intro)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

---

**Status:** Ready for local build
**Last Updated:** April 1, 2026
