# Personal pins across browsers: required online setup

Current status: pins remain in browser storage. Personal cloud pin syncing is not connected or deployed. Project management and browser backups work independently.

The selected design is Google sign-in with Firebase Authentication and Cloud Firestore. Each user's pin documents must be stored below their authenticated Firebase UID, separately for each INNOVA-DASH workspace. GitHub Pages remains the frontend host. Team dashboard URL parameters identify workspaces; they must never identify the authenticated user or grant access.

## Setup needed from the Firebase project owner

1. Create or choose a Firebase project at https://console.firebase.google.com/ using the organization-approved account.
2. Register a Web app and obtain its public Firebase web configuration (`apiKey`, `authDomain`, `projectId`, `appId`). These are browser configuration identifiers, not service-account credentials. Never upload private keys or service-account JSON to GitHub or chat.
3. Enable Authentication → Sign-in method → Google. Under authorized domains, add `mag8389.github.io`.
4. Create a Cloud Firestore database in production mode and select the desired data location. Keep it closed until the authenticated per-user rules and application integration are deployed together.
5. Supply the public web app configuration to continue implementation and end-to-end validation. Never enable anonymous public read/write access as a workaround.

## Integration and validation still required

- Add Google sign-in/sign-out and show which account is active.
- Store pins under `users/{uid}/pinWorkspaces/{workspaceId}/pins/{pinId}`. Firestore rules must restrict every read and write to `request.auth.uid == uid`, validate pin data, and deny other access.
- Store enough resource metadata for a pin to open on another browser even if the resource was added locally. Do not synchronize personal notes or other workspace data implicitly.
- Offer an explicit action to copy existing browser pins to the account. Signing out or switching accounts must clear the previous account's in-memory data and listeners, without merging it into another account.
- Test two browsers signed into the same account, two different accounts, sign-out, custom-resource pins, deletion, unavailable network, and workspace separation. Verify denied cross-user reads/writes against the deployed rules or Firebase emulator.

Online sync must not be claimed ready until the Firebase configuration, authentication, rules, application integration, and real cross-browser checks are complete.
