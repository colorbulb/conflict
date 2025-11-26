import { exec } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account to get project ID
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
const projectId = serviceAccount.project_id;

const url = `https://console.firebase.google.com/project/${projectId}/storage`;

console.log('\n🔧 Firebase Storage needs to be initialized through the Console.');
console.log('\n📋 Steps:');
console.log('1. Open the following URL in your browser:');
console.log(`   ${url}`);
console.log('\n2. Click the "Get Started" button');
console.log('3. Choose a location (recommended: us-central1)');
console.log('4. Accept the default security rules');
console.log('5. Click "Done"');
console.log('\n6. After initialization, run:');
console.log('   firebase deploy --only storage');
console.log('\n🌐 Opening browser...\n');

// Try to open the URL in the default browser
const platform = process.platform;
let command;

if (platform === 'darwin') {
  command = `open "${url}"`;
} else if (platform === 'win32') {
  command = `start "${url}"`;
} else {
  command = `xdg-open "${url}"`;
}

exec(command, (error) => {
  if (error) {
    console.log('Could not open browser automatically. Please copy and paste the URL above.');
  } else {
    console.log('Browser opened!');
  }
});

