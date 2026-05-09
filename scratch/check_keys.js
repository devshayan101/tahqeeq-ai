
const mysql = require('mysql2/promise');

async function checkKeys() {
  const connection = await mysql.createConnection("mysql://4TGRdtTMJKSEq2A.root:91SBlvNzt9HoEMnD@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl=%7B%22rejectUnauthorized%22:true%7D");
  
  const [rows] = await connection.execute('SELECT id, projectId, keyPrefix, hashedKey, revokedAt FROM apiKeys');
  console.log("API Keys in DB:");
  console.log(JSON.stringify(rows, null, 2));
  
  await connection.end();
}

checkKeys().catch(console.error);
