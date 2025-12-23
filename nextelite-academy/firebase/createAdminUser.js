// createAdminUser.js
// Usage: node createAdminUser.js <email> <password>

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, './serviceaccount.json'), 'utf8')
);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
}

const auth = getAuth();

async function createAdminUser(email, password) {
  try {
    // Create user if not exists
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log('User already exists:', user.uid);
    } catch (e) {
      user = await auth.createUser({ email, password });
      console.log('User created:', user.uid);
    }
    // Set admin custom claim
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log('Admin claim set for', email);
  } catch (err) {
    console.error('Error:', err);
  }
}

const [,, email, password] = process.argv;
if (!email || !password) {
  console.error('Usage: node createAdminUser.js <email> <password>');
  process.exit(1);
}
createAdminUser(email, password);
