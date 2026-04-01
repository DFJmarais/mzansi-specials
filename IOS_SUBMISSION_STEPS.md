# iOS App Store Submission - Step-by-Step Guide

## Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- iOS build ready (see Build Instructions below)
- App icons (1024x1024 PNG)
- Screenshots (5 per language)
- Privacy policy URL
- Support URL

## Step 1: Prepare Your Build

### 1.1 Update Version Information
```bash
cd /home/ubuntu/mzansi-specials

# Update version in package.json
# Current version: 1.0.0

# Build the app
pnpm build

# Sync with Capacitor
npx cap sync ios
```

### 1.2 Configure Xcode Project
1. Open Xcode:
   ```bash
   open ios/App/App.xcworkspace
   ```

2. Select the project in the navigator
3. Select "Mzansi Specials" target
4. Go to "General" tab
5. Update:
   - **Display Name**: Mzansi Specials
   - **Bundle Identifier**: com.mzansispecials.app
   - **Version**: 1.0
   - **Build**: 1
   - **Minimum Deployments**: iOS 13.0

### 1.3 Add App Icon
1. In Xcode, select "Assets"
2. Select "AppIcon"
3. Drag and drop the 1024x1024 PNG icon
4. Xcode will automatically generate all required sizes

### 1.4 Configure Signing
1. Select the project in navigator
2. Select "Signing & Capabilities"
3. Select your team from dropdown
4. Xcode will automatically create provisioning profile

## Step 2: Create Archive

### 2.1 Archive the App
1. In Xcode: Product → Archive
2. Wait for build to complete
3. Organizer window opens automatically
4. Select your archive
5. Click "Validate App"
6. Fix any validation errors

### 2.2 Upload to App Store
1. In Organizer, select archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Select "Upload"
5. Select signing certificate
6. Click "Upload"
7. Wait for upload to complete (5-10 minutes)

## Step 3: Create App Store Listing

### 3.1 Log in to App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Sign in with Apple ID
3. Click "My Apps"

### 3.2 Create New App
1. Click "+"
2. Select "New App"
3. Fill in:
   - **Platform**: iOS
   - **App Name**: Mzansi Specials
   - **Primary Language**: English
   - **Bundle ID**: com.mzansispecials.app
   - **SKU**: MZANSI-SPECIALS-001
   - **User Access**: Full Access

### 3.3 Fill in App Information

**App Icon**
- Upload 1024x1024 PNG
- Format: PNG, RGB, no transparency

**Screenshots**
1. Go to "Screenshots" section
2. Select "iPhone 6.7-inch" (or latest size)
3. Upload 5 screenshots (1284x2778 pixels):
   - Screenshot 1: Home screen
   - Screenshot 2: Browse products
   - Screenshot 3: Price comparison
   - Screenshot 4: Shopping list
   - Screenshot 5: Language selection
4. Add caption for each screenshot
5. Repeat for other iPhone sizes (6.1-inch, 5.5-inch)

**Description**
- **App Name**: Mzansi Specials
- **Subtitle**: Save Big Today - Compare Grocery Prices
- **Description**: (See APP_STORE_SUBMISSION_GUIDE.md for full text)
- **Keywords**: grocery, shopping, prices, comparison, South Africa, deals, specials, save money
- **Support URL**: https://mzansispec-2ypgsq5z.manus.space/support
- **Privacy Policy URL**: https://mzansispec-2ypgsq5z.manus.space/privacy

### 3.4 Set Pricing and Availability

**Pricing**
1. Go to "Pricing and Availability"
2. Select "Free" or "Paid"
3. If paid, select price tier
4. For in-app purchases:
   - Free tier: R0
   - Plus tier: R19.99/month
   - Pro tier: R49.99/month

**Availability**
1. Select countries/regions
2. Select "Worldwide" for maximum reach
3. Set release date (can be automatic)

### 3.5 In-App Purchases (If Applicable)

1. Go to "In-App Purchases"
2. Click "+"
3. Create subscription:
   - **Product ID**: com.mzansispecials.plus
   - **Reference Name**: Plus Subscription
   - **Subscription Duration**: Monthly
   - **Price**: R19.99
4. Repeat for Pro tier

### 3.6 Content Rating

1. Go to "App Privacy"
2. Answer questionnaire about:
   - Data collection practices
   - Data usage
   - Data sharing
   - Health & fitness data
   - Sensitive information
3. Submit questionnaire
4. Apple assigns content rating

### 3.7 Review Information

1. Go to "Review Information"
2. Fill in:
   - **Contact Information**: Your email
   - **Demo Account**: (if needed)
   - **Notes for Reviewer**: Explain app functionality
   - **Screenshots**: Upload if needed for review
   - **Attachments**: Add any supporting docs

### 3.8 Version Release

1. Go to "Version Release"
2. Select "Manually Release After Review"
3. Click "Save"

## Step 4: Submit for Review

1. Go to "Version Information"
2. Review all sections (should show green checkmarks)
3. Click "Submit for Review"
4. Confirm submission
5. Wait for Apple's review (typically 24-48 hours)

## Step 5: Monitor Review Status

1. Log in to App Store Connect
2. Check "My Apps" → "Mzansi Specials"
3. View "Activity" tab for status updates
4. Possible statuses:
   - **Waiting for Review**: In queue
   - **In Review**: Being reviewed
   - **Ready for Sale**: Approved!
   - **Rejected**: Fix issues and resubmit

## Common Rejection Reasons

| Issue | Solution |
|-------|----------|
| Crashes on launch | Test thoroughly, fix bugs |
| Broken links | Verify all URLs work |
| Missing privacy policy | Add privacy policy URL |
| Misleading content | Ensure accurate descriptions |
| Poor performance | Optimize app speed |
| Unclear functionality | Improve screenshots/description |
| Subscription issues | Test in-app purchases |

## After Approval

1. App appears on App Store
2. Monitor downloads and reviews
3. Respond to user feedback
4. Plan updates and improvements
5. Submit new versions as needed

## Important Notes

- **Testing**: Always test on real device before submission
- **Privacy**: Ensure privacy policy is accurate and accessible
- **Performance**: App must be responsive and crash-free
- **Content**: No misleading information or false claims
- **Compliance**: Follow Apple's App Store Review Guidelines
- **Support**: Provide working support URL and contact info

## Useful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Account](https://developer.apple.com/account/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Capacitor iOS Deployment](https://capacitorjs.com/docs/ios)

---

**Status**: Ready for submission
**Last Updated**: April 1, 2026
