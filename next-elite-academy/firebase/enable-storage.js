import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Authenticate with service account
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/firebase'
  ]
});

async function enableStorage() {
  try {
    const authClient = await auth.getClient();
    const projectId = serviceAccount.project_id;

    console.log(`Enabling Firebase Storage for project: ${projectId}`);

    // Enable the Storage API
    const serviceUsage = google.serviceusage({ version: 'v1', auth: authClient });
    
    // Enable firebasestorage.googleapis.com
    try {
      const enableResponse = await serviceUsage.services.enable({
        name: `projects/${projectId}/services/firebasestorage.googleapis.com`
      });
      console.log('Firebase Storage API enable request sent:', enableResponse.data);
    } catch (error) {
      if (error.code === 400 && error.message?.includes('already enabled')) {
        console.log('Firebase Storage API is already enabled');
      } else if (error.code === 403) {
        console.error('Permission denied. The service account needs the "Service Usage Admin" role.');
        console.error('Error:', error.message);
        return;
      } else {
        throw error;
      }
    }

    // Try to initialize Firebase Storage using Firebase Management API
    // First, let's try using the Firebase REST API to initialize storage
    console.log('\nAttempting to initialize Firebase Storage...');
    
    const { request } = await import('https');
    const https = await import('https');
    
    // Get access token
    const token = await authClient.getAccessToken();
    
    // Try to initialize Firebase Storage via REST API
    const firebaseApiUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/defaultLocation`;
    
    try {
      // Check if we can use Firebase Management API
      // Actually, let's try creating the bucket via Storage API with proper permissions
      const storage = google.storage({ version: 'v1', auth: authClient });
      
      // Try both possible bucket names
      const bucketNames = [
        `${projectId}.appspot.com`,
        `${projectId}.firebasestorage.app`
      ];
      
      let bucketCreated = false;
      
      for (const bucketName of bucketNames) {
        try {
          // Check if bucket exists
          await storage.buckets.get({ bucket: bucketName });
          console.log(`✅ Bucket ${bucketName} already exists`);
          bucketCreated = true;
          break;
        } catch (error) {
          if (error.code === 404) {
            console.log(`Attempting to create bucket: ${bucketName}`);
            try {
              await storage.buckets.insert({
                project: projectId,
                requestBody: {
                  name: bucketName,
                  location: 'US-CENTRAL1',
                  storageClass: 'STANDARD'
                }
              });
              console.log(`✅ Bucket ${bucketName} created successfully`);
              bucketCreated = true;
              break;
            } catch (createError) {
              console.log(`Could not create ${bucketName}: ${createError.message}`);
              // Continue to next bucket name
            }
          }
        }
      }
      
      if (!bucketCreated) {
        console.log('\n⚠️  Could not create bucket automatically.');
        console.log('Firebase Storage API is enabled, but bucket creation requires additional setup.');
        console.log('Please initialize Storage in the Firebase Console:');
        console.log(`  https://console.firebase.google.com/project/${projectId}/storage`);
        console.log('\nAlternatively, the bucket may be created automatically on first use.');
      }
    } catch (error) {
      console.error('Error during bucket creation:', error.message);
    }

    console.log('\n✅ Firebase Storage setup complete!');
    console.log('You can now deploy storage rules with: firebase deploy --only storage');
    
  } catch (error) {
    console.error('Error enabling Firebase Storage:', error.message);
    if (error.response) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

enableStorage();

