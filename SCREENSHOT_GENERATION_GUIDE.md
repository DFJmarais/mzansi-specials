# App Store Screenshot Generation Guide

## Overview
This guide provides detailed instructions for creating professional app store screenshots for both iOS App Store and Google Play Store.

---

## Screenshot Specifications

### iOS Screenshots

| Aspect | Specification |
|--------|---------------|
| **Resolution** | 1284x2778 pixels (iPhone 14 Pro Max) |
| **Aspect Ratio** | 9:19.5 |
| **Format** | PNG or JPG |
| **Color Space** | RGB |
| **Quantity** | 5-8 per language |
| **Text** | Optional overlays recommended |

**Alternative Resolutions:**
- iPhone 6.1-inch: 1170x2532 pixels
- iPhone 5.5-inch: 1242x2208 pixels

### Android Screenshots

| Aspect | Specification |
|--------|---------------|
| **Resolution** | 1080x1920 pixels |
| **Aspect Ratio** | 9:16 |
| **Format** | PNG or JPG |
| **Color Space** | RGB |
| **Quantity** | 5-8 per language |
| **Text** | Optional overlays recommended |

---

## Screenshot Content Strategy

### Screenshot 1: Home Screen - "Find Best Deals"

**Purpose:** Introduce app and main value proposition

**Content to Show:**
- App title: "Mzansi Specials"
- Tagline: "Save Big Today"
- Search bar with placeholder text
- Featured deals section
- Language switcher visible
- Bottom navigation

**Text Overlay (Optional):**
- "Find the Best Grocery Deals"
- "Compare prices across major retailers"

**Design Tips:**
- Use bright, eye-catching colors
- Show South African flag colors
- Highlight search functionality
- Make language switcher visible

### Screenshot 2: Browse Products - "Compare Prices"

**Purpose:** Show product browsing and filtering

**Content to Show:**
- Category filters (Dairy, Meat, Produce, etc.)
- Product listings with images
- Price badges showing discounts
- Store names visible
- Filter/sort options

**Text Overlay (Optional):**
- "Browse by Category"
- "Find products from 6+ retailers"

**Design Tips:**
- Show variety of products
- Highlight discount badges
- Display multiple store options
- Show filter options clearly

### Screenshot 3: Price Comparison - "Save Money"

**Purpose:** Demonstrate core feature - price comparison

**Content to Show:**
- Product details
- Prices from multiple stores
- Best price highlighted in green
- Savings amount displayed
- Store logos
- Add to cart option

**Text Overlay (Optional):**
- "Compare prices instantly"
- "Save up to 30% on groceries"

**Design Tips:**
- Highlight best price prominently
- Show savings clearly
- Display multiple stores
- Use color to emphasize savings

### Screenshot 4: Shopping List - "Plan Your Shop"

**Purpose:** Show shopping list management

**Content to Show:**
- Shopping list with items
- Checkboxes for tracking
- Item prices displayed
- Total cost calculated
- Share option visible
- Add item functionality

**Text Overlay (Optional):**
- "Create & manage shopping lists"
- "Share with family and friends"

**Design Tips:**
- Show completed and pending items
- Display price total prominently
- Show share functionality
- Make list management clear

### Screenshot 5: Language Selection - "11 Languages"

**Purpose:** Highlight multilingual support

**Content to Show:**
- Language switcher open
- All 11 languages visible:
  - English
  - Afrikaans
  - isiZulu
  - isiXhosa
  - Sesotho
  - Setswana
  - isiNdebele
  - Tshivenda
  - Xitsonga
  - siSwati
  - Sepedi
- Language names in their native script

**Text Overlay (Optional):**
- "Support for all 11 South African languages"
- "Shop in your preferred language"

**Design Tips:**
- Show language names clearly
- Display native script
- Highlight language diversity
- Show ease of switching

### Screenshot 6: Subscription Tiers - "Choose Your Plan" (Optional)

**Purpose:** Show subscription options

**Content to Show:**
- Free tier (R0)
- Plus tier (R19.99/month)
- Pro tier (R49.99/month)
- Features for each tier
- Call-to-action buttons

**Text Overlay (Optional):**
- "Affordable plans for every shopper"
- "Free tier available"

**Design Tips:**
- Highlight Plus tier (most popular)
- Show clear pricing
- Display key features
- Make upgrade path clear

### Screenshot 7: Price Alerts - "Never Miss a Deal" (Optional)

**Purpose:** Show price alert feature

**Content to Show:**
- Price alert notifications
- Alert settings screen
- Product with price drop
- Notification history
- Alert management

**Text Overlay (Optional):**
- "Get notified of price drops"
- "Never miss a deal again"

**Design Tips:**
- Show notification clearly
- Display price reduction
- Show alert settings
- Make feature benefit clear

### Screenshot 8: Barcode Scanner - "Scan & Compare" (Optional)

**Purpose:** Show barcode scanning feature

**Content to Show:**
- Barcode scanner interface
- Scanned product details
- Price comparison results
- Store options
- Product information

**Text Overlay (Optional):**
- "Scan barcodes to compare prices"
- "Instant price comparison"

**Design Tips:**
- Show scanner in action
- Display scan results clearly
- Show price comparison
- Make feature intuitive

---

## Screenshot Creation Methods

### Method 1: Manual Screenshots (Recommended for Quality)

**iOS:**

1. **Run app on device or simulator:**
   ```bash
   # Open Xcode
   open ios/App/App.xcworkspace
   
   # Select iPhone 14 Pro Max simulator
   # Build and run app
   ```

2. **Navigate to each screen:**
   - Home screen
   - Browse products
   - Price comparison
   - Shopping list
   - Language selection

3. **Take screenshots:**
   - Press Cmd+S (Xcode simulator)
   - Or use device: Press Power + Volume Up simultaneously
   - Screenshots saved to desktop

4. **Edit screenshots:**
   - Crop to 1284x2778 pixels
   - Add text overlays using Preview or Photoshop
   - Optimize file size

**Android:**

1. **Run app on device or emulator:**
   ```bash
   # Open Android Studio
   open android
   
   # Select Pixel 6 Pro emulator
   # Build and run app
   ```

2. **Navigate to each screen:**
   - Home screen
   - Browse products
   - Price comparison
   - Shopping list
   - Language selection

3. **Take screenshots:**
   - Press Power + Volume Down
   - Or use Android Studio: Tools → Device Manager → Screenshot
   - Screenshots saved to device

4. **Edit screenshots:**
   - Crop to 1080x1920 pixels
   - Add text overlays
   - Optimize file size

### Method 2: Automated Screenshots (Using Fastlane)

**Setup Fastlane:**

```bash
# Install fastlane
sudo gem install fastlane

# Initialize fastlane in project
cd /home/ubuntu/mzansi-specials
fastlane init
```

**Create screenshot script:**

```bash
# Create Fastfile
fastlane/Fastfile

# iOS screenshots
fastlane ios screenshots

# Android screenshots
fastlane android screenshots
```

---

## Text Overlay Guidelines

### Font Selection
- **Font**: San Francisco (iOS), Roboto (Android)
- **Size**: 48-72 pixels
- **Weight**: Bold or Semi-bold
- **Color**: White or dark color with shadow

### Text Placement
- **Top**: 10-15% from top
- **Bottom**: 10-15% from bottom
- **Left/Right**: 5-10% margin
- **Avoid**: Covering important UI elements

### Text Examples

**Screenshot 1 (Home):**
```
"Find the Best Grocery Deals"
"Compare prices across major retailers"
```

**Screenshot 2 (Browse):**
```
"Browse by Category"
"Find products from 6+ retailers"
```

**Screenshot 3 (Compare):**
```
"Compare prices instantly"
"Save up to 30% on groceries"
```

**Screenshot 4 (List):**
```
"Create & manage shopping lists"
"Share with family and friends"
```

**Screenshot 5 (Languages):**
```
"Support for all 11 South African languages"
"Shop in your preferred language"
```

---

## Design Best Practices

### Color Usage
- Use South African flag colors (green, gold, red, blue, black, white)
- Maintain brand consistency
- Ensure good contrast for readability
- Use accent colors for emphasis

### Visual Hierarchy
- Highlight key features
- Use size to emphasize importance
- Guide user's eye with layout
- Make call-to-action clear

### Text Readability
- Use high contrast
- Add shadow or outline for clarity
- Keep text concise
- Use native language for each screenshot

### Localization
- Create screenshots for each language
- Use native text in overlays
- Ensure text fits in space
- Maintain consistent styling

---

## File Organization

### Directory Structure
```
/home/ubuntu/mzansi-specials/
├── screenshots/
│   ├── ios/
│   │   ├── en/
│   │   │   ├── 1-home.png
│   │   │   ├── 2-browse.png
│   │   │   ├── 3-compare.png
│   │   │   ├── 4-list.png
│   │   │   └── 5-languages.png
│   │   ├── zu/
│   │   ├── af/
│   │   └── ...
│   └── android/
│       ├── en/
│       ├── zu/
│       └── ...
```

### Naming Convention
- `1-home.png` - Home screen
- `2-browse.png` - Browse products
- `3-compare.png` - Price comparison
- `4-list.png` - Shopping list
- `5-languages.png` - Language selection

---

## Uploading to App Stores

### iOS (App Store Connect)

1. Go to "Screenshots" section
2. Select device type (iPhone 6.7-inch)
3. Click "+" to add screenshot
4. Drag and drop or select file
5. Add optional caption
6. Repeat for other screenshots
7. Repeat for other device sizes

### Android (Google Play Console)

1. Go to "Screenshots" section
2. Click "Add screenshots"
3. Drag and drop or select files
4. Add optional description
5. Arrange in desired order
6. Save

---

## Optimization Tips

### File Size
- Compress PNG/JPG files
- Target 500-800 KB per image
- Use online tools: TinyPNG, ImageOptim

### Quality
- Use high-resolution source
- Maintain sharpness after compression
- Test on actual devices
- Verify text readability

### Consistency
- Use same fonts across all screenshots
- Maintain consistent color scheme
- Keep layout style consistent
- Use same device for all screenshots

---

## Tools Recommended

| Tool | Purpose | Cost |
|------|---------|------|
| **Preview (Mac)** | Screenshot editing | Free |
| **Photoshop** | Advanced editing | $20.99/month |
| **Figma** | Design mockups | Free/Paid |
| **TinyPNG** | Image compression | Free/Paid |
| **Fastlane** | Automated screenshots | Free |
| **Sketch** | Design tool | $99/year |

---

## Checklist

- [ ] 5-8 screenshots created per platform
- [ ] Screenshots at correct resolution
- [ ] Text overlays added and readable
- [ ] Screenshots localized for key languages
- [ ] File names organized properly
- [ ] Files compressed for upload
- [ ] Screenshots tested on actual devices
- [ ] Screenshots follow brand guidelines
- [ ] All key features demonstrated
- [ ] Screenshots ready for upload

---

**Status**: Ready for screenshot generation
**Last Updated**: April 1, 2026
