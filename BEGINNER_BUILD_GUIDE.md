# Mzansi Specials - Beginner's Build Guide
## Your First Time Building an App - Step by Step

---

## What You're About to Do

You're going to build a professional app and upload it to Apple App Store and Google Play Store. Don't worry - I'll guide you through every single step. This is your first time, so I'm making it as simple as possible.

**Total Time:** About 3-4 hours (mostly waiting for builds)

---

## Part 1: Download and Set Up (15 minutes)

### Step 1: Download the Project Files

1. **Download the ZIP file** that contains all your app files
   - You should have received a link or the file is ready to download
   - File name: `mzansi-specials.zip` (about 500MB)

2. **Extract the ZIP file**
   - On Mac: Double-click the ZIP file (it extracts automatically)
   - On Windows: Right-click → "Extract All" → Choose a folder
   - On Linux: `unzip mzansi-specials.zip`

3. **Open the folder**
   - You should see a folder called `mzansi-specials`
   - This contains all your app code

### Step 2: Install Required Software

**Choose ONE based on what you want to build:**

#### For iOS (Mac Only - Required for App Store)

1. **Install Xcode** (Apple's development tool)
   - Open App Store on your Mac
   - Search for "Xcode"
   - Click "Get" then "Install"
   - Wait 30-45 minutes (it's large)
   - When done, you'll see "Open" button

2. **Install CocoaPods** (dependency manager)
   - Open Terminal (search "Terminal" in Spotlight)
   - Copy and paste this command:
     ```
     sudo gem install cocoapods
     ```
   - Press Enter
   - Enter your Mac password when asked
   - Wait for it to finish

#### For Android (Windows/Mac/Linux - Required for Google Play)

1. **Install Java 17**
   - Go to: https://www.oracle.com/java/technologies/downloads/#java17
   - Click the download button for your operating system
   - Run the installer
   - Follow the installation wizard
   - Click "Next" until done

2. **Install Android Studio**
   - Go to: https://developer.android.com/studio
   - Click "Download Android Studio"
   - Run the installer
   - Follow the setup wizard
   - When asked about SDK components, just click "Next" for defaults
   - Wait for installation to complete

---

## Part 2: Build for iOS (Mac Only)

### Step 1: Open Terminal

1. Open Terminal (search "Terminal" in Spotlight)
2. Copy and paste this command to go to your project folder:
   ```
   cd ~/Downloads/mzansi-specials
   ```
   (If you extracted to a different location, replace `Downloads` with that location)
3. Press Enter

### Step 2: Install Dependencies

1. Copy and paste this command:
   ```
   pnpm install
   ```
2. Press Enter
3. Wait for it to finish (5-10 minutes)
4. You'll see lots of text - that's normal

### Step 3: Build Web Assets

1. Copy and paste this command:
   ```
   pnpm build
   ```
2. Press Enter
3. Wait for it to finish (2-3 minutes)
4. You should see "✓ built in X.XXs" at the end

### Step 4: Sync to iOS

1. Copy and paste this command:
   ```
   npx cap sync ios
   ```
2. Press Enter
3. Wait for it to finish (1-2 minutes)

### Step 5: Open Xcode

1. Copy and paste this command:
   ```
   open ios/App/App.xcworkspace
   ```
2. Press Enter
3. Xcode will open automatically
4. Wait for it to load (30 seconds to 1 minute)

### Step 6: Configure Signing in Xcode

**This is important - follow carefully:**

1. **In Xcode window:**
   - On the left side, click "App" (under the folder icon)
   - In the middle, click "Mzansi Specials" (the target)
   - At the top, click "General"

2. **Find "Signing & Capabilities"**
   - Look for a tab that says "Signing & Capabilities"
   - Click it

3. **Select Your Team**
   - Find the dropdown that says "Team"
   - Click it
   - Select your Apple Developer Team
   - If you don't have one, you need to create an Apple Developer account first ($99/year)

4. **Update Version**
   - Find "Version" field
   - Change it to `1.0.0`
   - Find "Build" field
   - Change it to `1`

### Step 7: Create the Archive

1. **In Xcode menu:**
   - Click "Product" at the top
   - Click "Archive"

2. **Wait for build to complete**
   - You'll see progress at the top
   - This takes 5-10 minutes
   - When done, "Organizer" window opens automatically

3. **Validate the Archive**
   - Click "Validate App"
   - Select your Team
   - Click "Validate"
   - Wait for validation (1-2 minutes)
   - If you see errors, read them carefully and fix them

### Step 8: Upload to App Store Connect

1. **In Organizer window:**
   - Click "Distribute App"
   - Select "App Store Connect"
   - Select "Upload"
   - Select your Team
   - Click "Next"

2. **Review Signing**
   - Click "Next"

3. **Upload**
   - Click "Upload"
   - Wait for upload (5-10 minutes)
   - When done, you'll see "Upload Successful"

### Step 9: Submit in App Store Connect

1. **Go to App Store Connect:**
   - Open browser
   - Go to: https://appstoreconnect.apple.com
   - Sign in with your Apple ID

2. **Find Your App**
   - Click "My Apps"
   - Click "Mzansi Specials"

3. **Add Build**
   - Click "TestFlight"
   - Click "iOS Builds"
   - Wait a few minutes
   - Your build should appear in the list

4. **Submit for Review**
   - Go back to "App Information"
   - Make sure all information is filled in
   - Click "Submit for Review"
   - Fill in the form:
     - Notes for Reviewer: "Grocery price comparison app for South Africa"
     - Contact Information: Your email
   - Click "Submit"

5. **Monitor Status**
   - Your app is now "Waiting for Review"
   - Apple typically reviews within 24-48 hours
   - You'll get an email when approved

---

## Part 3: Build for Android (Windows/Mac/Linux)

### Step 1: Open Terminal/Command Prompt

**Mac/Linux:**
- Open Terminal (search "Terminal")

**Windows:**
- Press Windows key + R
- Type `cmd`
- Press Enter

### Step 2: Go to Project Folder

1. Copy and paste this command:
   ```
   cd ~/Downloads/mzansi-specials
   ```
   (On Windows: `cd C:\Users\YourUsername\Downloads\mzansi-specials`)

2. Press Enter

### Step 3: Install Dependencies

1. Copy and paste:
   ```
   pnpm install
   ```
2. Press Enter
3. Wait 5-10 minutes

### Step 4: Build Web Assets

1. Copy and paste:
   ```
   pnpm build
   ```
2. Press Enter
3. Wait 2-3 minutes

### Step 5: Sync to Android

1. Copy and paste:
   ```
   npx cap sync android
   ```
2. Press Enter
3. Wait 1-2 minutes

### Step 6: Build Signed APK

1. Go to Android folder:
   ```
   cd android
   ```
2. Press Enter

3. Build the APK:
   ```
   ./gradlew assembleRelease
   ```
   (On Windows: `gradlew.bat assembleRelease`)

4. Press Enter
5. **WAIT 10-15 minutes** - this is the longest step
6. When done, you'll see "BUILD SUCCESSFUL"

### Step 7: Find Your APK

1. The APK file is located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

2. On your computer:
   - Open File Explorer / Finder
   - Navigate to the `android` folder
   - Go to `app` → `build` → `outputs` → `apk` → `release`
   - You'll see `app-release.apk` file

3. **Copy this file to a safe location** (like your Desktop)

### Step 8: Upload to Google Play Console

1. **Go to Google Play Console:**
   - Open browser
   - Go to: https://play.google.com/console
   - Sign in with your Google account

2. **Find Your App**
   - Click "Mzansi Specials"

3. **Create Release**
   - Click "Release" → "Production"
   - Click "Create new release"

4. **Upload APK**
   - Click "Upload"
   - Select the `app-release.apk` file from your Desktop
   - Wait for upload (2-3 minutes)

5. **Add Release Notes**
   - Write: "Initial release - Grocery price comparison app"
   - Click "Save"

6. **Review Release**
   - Click "Review release"
   - Click "Start rollout to Production"

7. **Monitor Status**
   - Your app is now "Pending publication"
   - Google typically reviews within 2-3 hours
   - Your app will go live automatically

---

## Part 4: Add App Store Listings (30 minutes)

### iOS App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Click "My Apps" → "Mzansi Specials"
3. Click "App Information"
4. Fill in:
   - **Subtitle:** "Save Big Today - Compare Grocery Prices"
   - **Description:** "Find the best grocery deals across South African stores. Compare prices instantly from Spar, Pick n Pay, Checkers, OK Foods and more. Supports all 11 South African languages."
   - **Keywords:** "grocery, prices, comparison, deals, shopping"
   - **Category:** Shopping
   - **Content Rating:** 4+

5. Go to "Screenshots"
6. Upload 5-8 screenshots (I'll provide specifications)

### Google Play Console

1. Go to: https://play.google.com/console
2. Click "Mzansi Specials"
3. Click "Store listing"
4. Fill in:
   - **Short description:** "Find the best grocery deals across South African stores"
   - **Full description:** Same as iOS
   - **Category:** Shopping
   - **Content rating:** Everyone

5. Upload 5-8 screenshots

---

## Part 5: Configure In-App Subscriptions (15 minutes)

### iOS (App Store Connect)

1. Go to "In-App Purchases"
2. Click "+"
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

## Troubleshooting

### "Command not found: pnpm"
**Solution:** Install pnpm first
```
npm install -g pnpm
```

### "Xcode not found" (Mac)
**Solution:** Install Xcode from App Store

### "Java 17 required" (Android)
**Solution:** Install Java 17 from oracle.com/java

### "Build failed"
**Solution:** 
1. Delete `node_modules` folder
2. Run `pnpm install` again
3. Run `pnpm build` again

### "APK not installing"
**Solution:** Check Android version on your phone (minimum Android 7.0)

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Download & Setup | 15 min | Quick |
| iOS Build | 30 min | Medium |
| Android Build | 30 min | Medium |
| Upload to Stores | 20 min | Quick |
| App Store Listings | 30 min | Quick |
| Subscriptions | 15 min | Quick |
| **Total** | **2.5 hours** | **Done!** |

**Then wait:**
- iOS: 24-48 hours for review
- Android: 2-3 hours for publication

---

## Success Checklist

- [ ] Downloaded and extracted project files
- [ ] Installed Xcode (Mac) or Android Studio (Windows/Mac/Linux)
- [ ] Installed Java 17 (Android only)
- [ ] Ran `pnpm install`
- [ ] Ran `pnpm build`
- [ ] Created iOS archive (Mac only)
- [ ] Uploaded to App Store Connect (Mac only)
- [ ] Built Android APK
- [ ] Uploaded to Google Play Console
- [ ] Added app store listings
- [ ] Configured subscriptions
- [ ] Submitted for review
- [ ] Received approval email
- [ ] App is live on stores!

---

## You Did It! 🎉

Congratulations! You've successfully built and submitted your first app to both major app stores. 

**Next Steps:**
1. Monitor your app reviews and ratings
2. Fix any bugs users report
3. Plan feature updates
4. Promote your app on social media

---

**Questions?** Refer to the detailed guides:
- `LOCAL_BUILD_INSTRUCTIONS.md` - Technical details
- `QUICK_START_UPLOAD.md` - Upload procedures
- `KEYSTORE_SECURITY.md` - Protect your keystore

**Good luck! Your app is going to be amazing!** 🚀
