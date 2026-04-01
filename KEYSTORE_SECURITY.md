# Android Keystore Security Guide

## Critical Information

Your Android keystore file is the most important asset for your app. Losing it means you cannot update your app ever again.

### Keystore Details

**File Location:** `android/mzansi-release.keystore`

**Keystore Password:** `mzansi123`

**Key Alias:** `mzansi-release`

**Key Password:** `mzansi123`

**Validity:** 10,000 days (expires in year 2053)

---

## Security Best Practices

### 1. Backup Your Keystore

**Create Multiple Backups:**
```bash
# Backup to cloud storage
cp android/mzansi-release.keystore ~/Dropbox/mzansi-keystore-backup.keystore
cp android/mzansi-release.keystore ~/OneDrive/mzansi-keystore-backup.keystore
cp android/mzansi-release.keystore ~/iCloud\ Drive/mzansi-keystore-backup.keystore

# Or use external drive
cp android/mzansi-release.keystore /Volumes/ExternalDrive/mzansi-keystore-backup.keystore
```

### 2. Store Passwords Securely

**Use a Password Manager:**
- 1Password
- LastPass
- Bitwarden
- KeePass

**Store:** Keystore password and key password

**Never:** Commit passwords to git or share in plain text

### 3. Protect the Keystore File

**File Permissions (Linux/Mac):**
```bash
# Make file read-only
chmod 400 android/mzansi-release.keystore

# Verify permissions
ls -l android/mzansi-release.keystore
```

**Encryption (Optional):**
```bash
# Encrypt keystore with GPG
gpg --symmetric android/mzansi-release.keystore

# Creates: android/mzansi-release.keystore.gpg
# Delete original after encryption
rm android/mzansi-release.keystore

# To decrypt later:
gpg android/mzansi-release.keystore.gpg
```

### 4. Version Control

**DO NOT commit keystore to git:**
```bash
# Add to .gitignore
echo "android/mzansi-release.keystore" >> .gitignore

# Remove if accidentally committed
git rm --cached android/mzansi-release.keystore
git commit -m "Remove keystore from git"
```

---

## Disaster Recovery

### If Keystore is Lost

**You CANNOT recover it.** Your options:

1. **Create New App:**
   - Create new app in Google Play Console
   - New package name: `com.mzansispecials.app2`
   - Start from scratch with new keystore

2. **Request Google Support:**
   - Contact Google Play Support
   - Explain situation
   - Request exception (rarely granted)

3. **Prevent Future Loss:**
   - Implement backup strategy immediately
   - Store in multiple secure locations
   - Document passwords in secure manager

### If Password is Forgotten

**You CANNOT recover the password.** Your options:

1. **Create New Keystore:**
   - Generate new keystore with new password
   - Create new app in Google Play Console
   - Start from scratch

2. **Prevent Future Loss:**
   - Store password in password manager
   - Create written backup in secure location
   - Test password recovery process

---

## Keystore Verification

### Verify Keystore Contents

```bash
# List keystore contents
keytool -list -v -keystore android/mzansi-release.keystore -storepass mzansi123

# Output should show:
# Alias name: mzansi-release
# Creation date: [current date]
# Entry type: PrivateKeyEntry
# Certificate fingerprint (SHA-256): [fingerprint]
```

### Verify Signing Configuration

```bash
# Check build.gradle has correct signing config
cat android/app/build.gradle | grep -A 5 "signingConfigs"

# Should show:
# storeFile file('mzansi-release.keystore')
# storePassword 'mzansi123'
# keyAlias 'mzansi-release'
# keyPassword 'mzansi123'
```

---

## Backup Checklist

- [ ] Keystore file backed up to cloud storage
- [ ] Keystore file backed up to external drive
- [ ] Passwords stored in password manager
- [ ] Passwords written down and stored securely
- [ ] Keystore added to .gitignore
- [ ] Keystore NOT committed to git
- [ ] File permissions set to read-only
- [ ] Backup locations documented
- [ ] Recovery procedure tested

---

## Maintenance Schedule

| Task | Frequency | Notes |
|------|-----------|-------|
| Verify backups exist | Monthly | Ensure all backups are accessible |
| Test password recovery | Quarterly | Verify you can access password manager |
| Update backups | With each build | Ensure latest version backed up |
| Review security | Annually | Check for new best practices |

---

## Emergency Contact

If you lose your keystore:

1. **Google Play Support:** https://support.google.com/googleplay/android-developer
2. **Apple Support:** https://developer.apple.com/support/
3. **Capacitor Support:** https://capacitorjs.com/docs/support

---

**Status:** Keystore created and secured
**Last Updated:** April 1, 2026
**Keystore Expiration:** 2053
