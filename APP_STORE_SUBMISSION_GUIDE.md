# Mzansi Specials - App Store Submission Guide

## Overview
This guide provides all necessary information for submitting Mzansi Specials to both the Apple App Store and Google Play Store.

## Subscription Pricing

Mzansi Specials offers three subscription tiers designed to be affordable for South African shoppers:

| Tier | Price | Billing Cycle | Key Features |
|------|-------|---------------|---------------|
| **Free** | R0 | Forever | Basic product browsing, limited to 100 products, basic search |
| **Plus** | R19.99 | Monthly | Unlimited products, price alerts (5 alerts), barcode scanning, shopping lists |
| **Pro** | R49.99 | Monthly | All Plus features + receipt OCR, advanced analytics, price history, priority support |

**Pricing Strategy:**
- Free tier encourages user acquisition with no barrier to entry
- Plus tier (R19.99) targets budget-conscious shoppers wanting core features
- Pro tier (R49.99) targets power users and frequent shoppers
- All prices are below 100 Rand/month, keeping the app accessible to South African market
- Prices are set via App Store Connect (iOS) and Google Play Console (Android)

---

## App Information

| Field | Value |
|-------|-------|
| **App Name** | Mzansi Specials |
| **Bundle ID (iOS)** | com.mzansispecials.app |
| **Package Name (Android)** | com.mzansispecials.app |
| **Version** | 1.0.0 |
| **Supported Languages** | 11 (English, Afrikaans, isiZulu, isiXhosa, Sesotho, Setswana, isiNdebele, Tshivenda, Xitsonga, siSwati, Sepedi) |
| **Minimum iOS Version** | 13.0 |
| **Minimum Android Version** | 7.0 (API Level 24) |
| **Category** | Shopping |
| **Content Rating** | 4+ (iOS) / Everyone (Android) |

## App Store Listing Content

### App Title
**Mzansi Specials**

### Subtitle (iOS Only)
Save Big Today - Compare Grocery Prices

### Short Description (150 characters max)
Find the best grocery deals across South African stores. Compare prices instantly.

### Full Description

**English:**
Mzansi Specials is your ultimate grocery shopping companion for South Africa. Compare prices across major retailers including Spar, Pick n Pay, Checkers, Woolworths, OK Foods, and Food Lovers Market. Save money on your weekly shopping by finding the best deals instantly.

**Features:**
- Real-time price comparison across 6+ major retailers
- Browse products by category (Dairy, Meat, Produce, Bakery, Pantry, Beverages, Frozen, Snacks, Household)
- Search for specific products and get instant price comparisons
- View price history and trends
- Create and manage shopping lists
- Get notifications for price drops on your favorite items
- Support for all 11 South African languages
- Offline access to your shopping lists
- Share lists with family and friends

**Why Choose Mzansi Specials?**
- Save up to 30% on your grocery bills
- Shop smarter with real-time price data
- Support local South African retailers
- Easy-to-use interface designed for South African shoppers
- Fast, reliable, and always up-to-date pricing

### Keywords
grocery, shopping, prices, comparison, South Africa, deals, specials, save money, retailers, Spar, Pick n Pay, Checkers

### Support URL
https://mzansispec-2ypgsq5z.manus.space/support

### Privacy Policy URL
https://mzansispec-2ypgsq5z.manus.space/privacy

### Terms of Service URL
https://mzansispec-2ypgsq5z.manus.space/terms

## App Icons

### Icon Specifications

**iOS:**
- App Icon (1024x1024 px) - Required
- Format: PNG with alpha channel
- File: `mzansi-logo-1024.png`

**Android:**
- Adaptive Icon (108x108 dp minimum)
- Legacy Icon (192x192 px)
- Format: PNG
- Files: `mzansi-logo-adaptive.png`, `mzansi-logo-192.png`

### Icon Files Location
All icon files are available in CDN:
- iOS: https://cdn.manus.space/mzansi-specials/mzansi-logo-1024.png
- Android: https://cdn.manus.space/mzansi-specials/mzansi-logo-adaptive.png

## Screenshots

### iOS Screenshots (Required: 2-5 screenshots per language)

**Screenshot 1: Home Screen**
- Shows app title "Mzansi Specials" with tagline "Save Big Today"
- Displays search bar with placeholder
- Shows featured deals section
- Bottom navigation visible

**Screenshot 2: Browse Products**
- Category filters (Dairy, Meat, Produce, Bakery, Pantry)
- Product listings with prices
- Store comparison visible
- Price badges showing discounts

**Screenshot 3: Price Comparison**
- Product details with multiple store prices
- Best price highlighted
- Savings amount displayed
- Add to cart option

**Screenshot 4: Shopping List**
- Shopping list management
- Checkboxes for items
- Price totals
- Share option

**Screenshot 5: Language Selection**
- Language switcher showing all 11 languages
- Easy language switching
- Demonstrates multilingual support

### Android Screenshots (Required: 2-8 screenshots)

Same as iOS, but with Android-specific UI elements and aspect ratios.

## App Store Submission Checklist

### Pre-Submission
- [ ] App builds successfully for iOS (Xcode)
- [ ] App builds successfully for Android (Android Studio)
- [ ] All 11 languages tested and working
- [ ] Language switching verified
- [ ] Price comparison functionality tested
- [ ] Shopping list creation tested
- [ ] Search functionality tested
- [ ] Performance tested on real devices
- [ ] Battery usage optimized
- [ ] Network requests optimized
- [ ] All links working (privacy policy, support, etc.)
- [ ] No console errors or warnings
- [ ] App icon meets specifications
- [ ] Screenshots prepared for all languages
- [ ] Privacy policy reviewed and updated
- [ ] Terms of service reviewed and updated

### iOS App Store (App Store Connect)

**Step 1: Prepare Build**
1. Update version number in `Info.plist`
2. Update build number
3. Run `pnpm build` to generate production build
4. In Xcode: Product → Archive
5. Upload to App Store Connect

**Step 2: Create App Store Listing**
1. Log in to App Store Connect
2. Navigate to "My Apps"
3. Click "+" to create new app
4. Fill in app information:
   - App Name: Mzansi Specials
   - Bundle ID: com.mzansispecials.app
   - SKU: MZANSI-SPECIALS-001
   - Platform: iOS
5. Add app icon (1024x1024 PNG)
6. Add screenshots (5 per language)
7. Add description and keywords
8. Set pricing and availability
9. Add privacy policy URL
10. Submit for review

**Step 3: Review Guidelines**
- App must not crash on startup
- All links must work
- Privacy policy must be accessible
- No misleading content
- Performance must be acceptable
- Must comply with App Store Review Guidelines

**Step 4: Submit for Review**
- Review all information
- Click "Submit for Review"
- Wait for Apple's review (typically 24-48 hours)

### Google Play Store

**Step 1: Prepare Build**
1. Update version number in `build.gradle`
2. Generate signed APK or AAB (Android App Bundle)
3. In Android Studio: Build → Generate Signed Bundle/APK

**Step 2: Create Google Play Listing**
1. Log in to Google Play Console
2. Click "Create app"
3. Fill in app details:
   - App name: Mzansi Specials
   - Default language: English
   - App or game: App
   - Category: Shopping
4. Accept declaration
5. Create app

**Step 3: Add Store Listing**
1. Navigate to "Store listing"
2. Add app icon (512x512 PNG)
3. Add feature graphic (1024x500 PNG)
4. Add screenshots (5-8 per language)
5. Add short description (80 characters)
6. Add full description
7. Add category and content rating
8. Add privacy policy URL
9. Add support email

**Step 4: Content Rating**
1. Fill out content rating questionnaire
2. Submit for rating
3. Receive content rating

**Step 5: Pricing and Distribution**
1. Set pricing (free or paid)
2. Select countries for distribution
3. Set content rating (if not auto-rated)

**Step 6: Submit for Review**
1. Review all information
2. Click "Send for review"
3. Wait for Google's review (typically 2-3 hours)

## Build Instructions

### iOS Build

```bash
# Install dependencies
pnpm install

# Build web assets
pnpm build

# Update Capacitor
npx cap sync ios

# Open in Xcode
open ios/App/App.xcworkspace

# In Xcode:
# 1. Select "Mzansi Specials" scheme
# 2. Select "Generic iOS Device"
# 3. Product → Archive
# 4. Upload to App Store Connect
```

### Android Build

```bash
# Install dependencies
pnpm install

# Build web assets
pnpm build

# Update Capacitor
npx cap sync android

# Build signed APK/AAB
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## Testing Checklist

### Functional Testing
- [ ] App launches without crashing
- [ ] Home page loads correctly
- [ ] Search functionality works
- [ ] Browse page displays products
- [ ] Price comparison works
- [ ] Shopping list creation works
- [ ] Language switching works for all 11 languages
- [ ] All navigation links work
- [ ] All external links work (privacy, support, etc.)

### Performance Testing
- [ ] App loads in < 3 seconds
- [ ] Search results appear in < 1 second
- [ ] Price comparison loads in < 2 seconds
- [ ] No memory leaks
- [ ] Battery usage is acceptable
- [ ] Network requests are optimized

### Compatibility Testing
- [ ] iOS 13.0 and above
- [ ] Android 7.0 and above
- [ ] Various screen sizes (iPhone SE to iPhone 14 Pro Max)
- [ ] Various screen sizes (Android phones and tablets)
- [ ] Landscape and portrait orientations

### Localization Testing
- [ ] All 11 languages display correctly
- [ ] Language switching works smoothly
- [ ] Text doesn't overflow in any language
- [ ] RTL languages display correctly (if applicable)
- [ ] Date/time formats are localized

## Submission Timeline

| Task | Duration | Notes |
|------|----------|-------|
| App development | Complete | Ready for submission |
| Build preparation | 1-2 hours | Generate signed builds |
| iOS submission | 24-48 hours | Apple review time |
| Android submission | 2-3 hours | Google review time |
| Total time to launch | 3-4 days | From submission to live |

## Post-Launch

### Monitoring
- Monitor crash reports and user feedback
- Track user acquisition and retention
- Monitor app ratings and reviews
- Track performance metrics

### Updates
- Plan regular updates with new features
- Fix bugs reported by users
- Improve performance based on feedback
- Add new retailers and products

### Marketing
- Promote on social media
- Get press coverage
- Encourage user reviews
- Run promotional campaigns

## Support Contacts

**Apple App Store Support:**
- https://developer.apple.com/support/

**Google Play Store Support:**
- https://support.google.com/googleplay/

**Mzansi Specials Support:**
- Email: support@mzansispecials.com
- Website: https://mzansispec-2ypgsq5z.manus.space

## Additional Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Store Policies](https://play.google.com/about/developer-content-policy/)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-01 | Initial release |

---

**Last Updated:** April 1, 2026
**Status:** Ready for App Store Submission
