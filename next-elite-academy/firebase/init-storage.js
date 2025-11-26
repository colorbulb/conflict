import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

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

async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed });
          } else {
            reject({ status: res.statusCode, data: parsed, message: parsed.error?.message || 'Request failed' });
          }
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function initializeStorage() {
  try {
    const authClient = await auth.getClient();
    const projectId = serviceAccount.project_id;
    const token = await authClient.getAccessToken();

    console.log(`Initializing Firebase Storage for project: ${projectId}`);

    // Try to get the default location first
    const locationUrl = `https://firebase.googleapis.com/v1beta1/projects/${projectId}/defaultLocation`;
    
    try {
      const locationResponse = await makeRequest({
        hostname: 'firebase.googleapis.com',
        path: `/v1beta1/projects/${projectId}/defaultLocation`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Default location:', locationResponse.data);
    } catch (error) {
      console.log('Could not get default location:', error.message);
    }

    // Try to initialize storage by making a request to the storage endpoint
    // This might trigger the initialization
    const storage = google.storage({ version: 'v1', auth: authClient });
    
    // List buckets to see if any exist
    try {
      const buckets = await storage.buckets.list({ project: projectId });
      console.log('\nExisting buckets:', buckets.data.items?.map(b => b.name) || []);
      
      // Check for Firebase Storage buckets
      const firebaseBuckets = buckets.data.items?.filter(b => 
        b.name.includes(projectId) && (b.name.includes('appspot') || b.name.includes('firebasestorage'))
      ) || [];
      
      if (firebaseBuckets.length > 0) {
        console.log('\n✅ Firebase Storage buckets found:');
        firebaseBuckets.forEach(b => console.log(`  - ${b.name}`));
        console.log('\n✅ Firebase Storage appears to be initialized!');
        return;
      }
    } catch (error) {
      console.log('Error listing buckets:', error.message);
    }

    // If no buckets found, Storage needs to be initialized via Console
    console.log('\n⚠️  Firebase Storage API is enabled, but Storage service needs initialization.');
    console.log('Please complete the setup in Firebase Console:');
    console.log(`  https://console.firebase.google.com/project/${projectId}/storage`);
    console.log('\nClick "Get Started" and follow the prompts.');
    console.log('After that, you can deploy storage rules with: firebase deploy --only storage');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

initializeStorage();

