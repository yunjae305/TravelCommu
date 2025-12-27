const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const DEFAULT_DB_URL = 'https://travel-9bade-default-rtdb.asia-southeast1.firebasedatabase.app/';
const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'servicekey.json');

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`서비스 계정 파일을 찾을 수 없습니다!!!!: ${serviceAccountPath}`);
}

const databaseURL = process.env.FIREBASE_DATABASE_URL || DEFAULT_DB_URL;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL
  });
}

const db = admin.database();
module.exports = db;