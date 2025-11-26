# Enable Firebase Storage

## Quick Method (Recommended)

1. Go to Firebase Console: https://console.firebase.google.com/project/nexteliteweb1003/storage
2. Click **"Get Started"** button
3. Choose a location for your storage bucket (recommended: `us-central1`)
4. Accept the default security rules or customize them
5. Click **"Done"**

After enabling Storage in the console, you can deploy your storage rules:

```bash
firebase deploy --only storage
```

## Alternative: Grant Service Account Permissions

If you want to use the service account to enable Storage programmatically, you need to grant it the following IAM roles in Google Cloud Console:

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=nexteliteweb1003
2. Find the service account: `firebase-adminsdk-fbsvc@nexteliteweb1003.iam.gserviceaccount.com`
3. Click the edit icon (pencil) next to it
4. Add these roles:
   - **Service Usage Admin** (`roles/serviceusage.serviceUsageAdmin`)
   - **Storage Admin** (`roles/storage.admin`)
5. Save the changes

Then run:
```bash
node firebase/enable-storage.js
```

## After Storage is Enabled

Once Storage is enabled, you can deploy:

```bash
firebase deploy --only storage
```

This will deploy your `storage.rules` file and ensure everything is set up correctly.

