# Testing the Auto-Currency Pricing System

## How It Works

The pricing system automatically detects your location and displays prices in the appropriate currency:
- **Pakistan** → Rs. PKR (Pakistani Rupees)
- **India** → ₹ INR (Indian Rupees)
- **Rest of World** → $ USD (US Dollars)

## Detection Method

The system uses **browser timezone** to determine location:
1. Checks `Intl.DateTimeFormat().resolvedOptions().timeZone`
2. Detects timezone patterns:
   - `Asia/Karachi` → PKR
   - `Asia/Kolkata`, `Asia/Calcutta` → INR
   - Everything else → USD
3. Falls back to browser language if timezone is ambiguous

## How to Test Different Currencies

### Method 1: Change Browser Timezone (Recommended)

#### Google Chrome/Edge:
1. Open DevTools (F12)
2. Click the **3 dots menu** (⋮) in DevTools
3. Go to **More tools** → **Sensors**
4. Find **Location** section
5. In the **Timezone** dropdown, select:
   - `Karachi` for Pakistani Rupees (PKR)
   - `Kolkata` for Indian Rupees (INR)
   - `New York` or `London` for US Dollars (USD)
6. Refresh the page

#### Firefox:
1. Open DevTools (F12)
2. Go to **Settings** (⚙️ icon)
3. Scroll to **Advanced settings**
4. Enable **Custom formatters**
5. Use browser extension like "Timezone Override" to change timezone
6. Refresh the page

### Method 2: Manual Testing via Console

Open browser console (F12) and run:

```javascript
// Test Pakistani pricing (PKR)
localStorage.setItem('preferred_currency', 'PKR');
location.reload();

// Test Indian pricing (INR)
localStorage.setItem('preferred_currency', 'INR');
location.reload();

// Test US pricing (USD)
localStorage.setItem('preferred_currency', 'USD');
location.reload();

// Clear preference (auto-detect again)
localStorage.removeItem('preferred_currency');
location.reload();
```

### Method 3: VPN Testing (Most Accurate)

1. Use a VPN service (NordVPN, ExpressVPN, etc.)
2. Connect to servers in:
   - **Pakistan** → Should show Rs. PKR
   - **India** → Should show ₹ INR
   - **USA/UK/Europe** → Should show $ USD
3. Open the website in incognito/private mode
4. Verify pricing displays correctly

### Method 4: Browser Language Override

1. Go to browser settings
2. Change preferred language:
   - Add `Urdu (Pakistan)` for PKR
   - Add `Hindi (India)` for INR
   - Add `English (US)` for USD
3. Restart browser
4. Visit the website

## What to Verify

### ✅ Home Page (`/`)
- Navigate to pricing section
- Verify prices show in correct currency
- Check all three plans (SOLO, SQUAD, STUDIO)
- Ensure original prices (strikethrough) also convert

### ✅ Product Detail Page (`/products/desksweep`)
- Open DeskSweep product page
- Verify all pricing cards show correct currency
- Check savings percentage updates
- Confirm "Buy Now" buttons visible

### ✅ Price Formatting
**USD Format:**
- SOLO: $9
- SQUAD: $29 (was $45)
- STUDIO: $79

**INR Format:**
- SOLO: ₹299
- SQUAD: ₹999 (was ₹1,500)
- STUDIO: ₹2,999

**PKR Format:**
- SOLO: Rs. 2,500
- SQUAD: Rs. 8,000 (was Rs. 12,500)
- STUDIO: Rs. 22,000

## Testing Checklist

- [ ] Default detection works (shows correct currency for my location)
- [ ] Timezone override in DevTools changes currency
- [ ] Console localStorage method works
- [ ] Currency persists on page reload
- [ ] All pricing cards update simultaneously
- [ ] Original prices (strikethrough) convert correctly
- [ ] Number formatting is correct (commas, decimals)
- [ ] Currency symbols display properly (₹, $, Rs.)
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

## Expected Behavior

### Pakistan Users:
```
SOLO: Rs. 2,500
SQUAD: Rs. 8,000 (Save 36% - was Rs. 12,500)
STUDIO: Rs. 22,000
```

### India Users:
```
SOLO: ₹299
SQUAD: ₹999 (Save 33% - was ₹1,500)
STUDIO: ₹2,999
```

### Global Users (USA/Europe/Others):
```
SOLO: $9
SQUAD: $29 (Save 35% - was $45)
STUDIO: $79
```

## Debugging Tips

### If currency doesn't detect:
1. Open console (F12)
2. Type: `Intl.DateTimeFormat().resolvedOptions().timeZone`
3. Check what timezone is returned
4. Verify it matches detection logic in `src/lib/currency.ts`

### If prices don't update:
1. Clear localStorage: `localStorage.clear()`
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Clear browser cache
4. Try incognito/private mode

### Check detection logic:
```javascript
// In browser console
console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
console.log('Language:', navigator.language);
console.log('Saved Currency:', localStorage.getItem('preferred_currency'));
```

## Production Testing

### Before Launch:
1. Test from actual Pakistan IP (VPN or actual user)
2. Test from actual India IP
3. Test from USA/Europe IPs
4. Verify all currencies in different browsers (Chrome, Firefox, Safari, Edge)
5. Test on mobile devices (Android, iOS)
6. Confirm prices are correct in all currencies

### User Feedback:
- Ask beta users in Pakistan/India to verify prices
- Confirm pricing makes sense for local purchasing power
- Adjust prices if needed based on regional feedback

## Quick Test Script

Run this in your browser console to test all currencies quickly:

```javascript
async function testCurrencies() {
  const currencies = ['USD', 'INR', 'PKR'];
  
  for (const curr of currencies) {
    localStorage.setItem('preferred_currency', curr);
    console.log(`\n=== Testing ${curr} ===`);
    console.log('Refresh the page to see changes');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run the test
testCurrencies();
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify timezone detection is working
3. Clear localStorage and try again
4. Test in different browser
5. Contact development team with:
   - Your location/timezone
   - Browser and version
   - Screenshot of pricing
   - Console errors (if any)

## Notes

- Currency detection happens **once** when page loads
- Preference is **saved** in localStorage for future visits
- No manual switcher needed - fully automatic
- Works offline (uses saved preference)
- Privacy-friendly (no IP tracking, only timezone API)
