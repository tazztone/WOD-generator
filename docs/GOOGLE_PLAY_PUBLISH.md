# Publishing to Google Play Store Guide

This guide covers the non-technical and administrative steps required to publish **WOD Gen Ultimate** to the Google Play Store.

## 1. Google Play Console Account
To publish apps, you need a developer account.
1.  Go to [Google Play Console](https://play.google.com/console).
2.  Sign in with your Google Account.
3.  Accept the Developer Distribution Agreement.
4.  **Pay the registration fee**: It is a one-time payment of **$25 USD**.
5.  Complete your account details (Name, Address, etc.).
6.  *Verification*: Google may ask for ID verification which can take 1-2 days.

## 2. Create the App
Once your account is ready:
1.  Click **Create App**.
2.  **App Name**: "WOD Gen Ultimate" (must match your branding).
3.  **Default Language**: English (en-US).
4.  **App or Game**: App.
5.  **Free or Paid**: Free.
6.  **Declarations**: Accept the declarations (Export laws, Guidelines).

## 3. Store Listing (The Marketing Stuff)
You will need to fill out the "Main Store Listing".
*   **Short Description**: 80 characters max.
    *   *Example*: "Smart CrossFit workout generator and timer. Works offline."
*   **Full Description**: Detailed explanation of features (AMRAP, EMOM, specialized heavy days, etc.).
*   **Graphics**:
    *   **App Icon**: 512x512 PNG (You have this: `assets/logo.png`).
    *   **Feature Graphic**: 1024x500 PNG (A banner image). **You need to create this**.
    *   **Phone Screenshots**: At least 2 screenshots. Upload the ones we took or take new ones from the emulator.
    *   **Tablet Screenshots**: Optional but recommended if you support tablets.

## 4. App Content (Questionnaire)
Go to the **App Content** section in the menu. You must complete all outstanding tasks:
*   **Privacy Policy**: Enter the URL to your privacy policy.
    *   *Tip*: Use a free host (like GitHub Pages or a Google Site) to host a simple page saying "This app runs locally and does not collect personal data."
*   **Ads**: Select "No, my app does not contain ads".
*   **App Access**: Select "All functionality is available without special access".
*   **Content Ratings**: Fill out the questionnaire (Rating Authority). Since it's a fitness app properly rated, it will likely be "Everyone" or "Teen".
*   **Target Audience**: Select "18 and over" (easiest) or "13+".
*   **News Apps**: "No".
*   **COVID-19 Contact Tracing**: "My app is not a publicly available COVID-19 contact tracing or status app".
*   **Data Safety**: This is critical.
    *   Since you use `localStorage` but don't send data to a server:
    *   "Does your app collect or share any of the required user data types?" -> **No**.

## 5. Releases
This is where you upload your code.
1.  Go to **Production** (or **Testing** > **Internal testing** first).
2.  **Create new release**.
3.  **Signing Key**: Google will ask to "Choose signing key". Select "Use Google Play App Signing" (Recommended).
4.  **Upload**: Upload the `.aab` (Android App Bundle) file we generated in `android/app/build/outputs/bundle/release/app-release.aab`.
    *   *Note*: Ensure you have built the **Signed Release Bundle** using Android Studio as described in `MOBILE_BUILD.md`, not just the debug APK.
5.  **Release Name**: "7.0.0".
6.  **Release Notes**: "Initial Release - Smart WOD Generator with Offline Support."
7.  **Review Release**: Fix any errors warnings.
8.  **Start Rollout**: Submit for review.
    *   *Review Time*: New accounts can take 3-7 days for the first review.

## 6. Post-Review
Once approved, your app will be live on the Play Store!

## Checklist for You:
- [ ] **Privacy Policy URL**: create this page.
- [ ] **Feature Graphic**: 1024x500 banner image.
- [ ] **Signed Bundle**: Use Android Studio to `Generate Signed Bundle` using the keystore you create.
