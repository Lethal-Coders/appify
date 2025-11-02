const { createClient } = require('@libsql/client');
const fs = require('fs');
require('dotenv').config();

async function pushSchemaToTurso() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Connected to Turso database');
  console.log('Reading schema.sql...');

  const schema = fs.readFileSync('./schema.sql', 'utf-8');
  
  // Remove all comment lines first
  const cleanedSchema = schema
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');
  
  // Split by semicolons and filter
  const statements = cleanedSchema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Found ${statements.length} SQL statements`);

  for (const statement of statements) {
    try {
      await client.execute(statement);
      const preview = statement.replace(/\s+/g, ' ').substring(0, 60);
      console.log('✓ Executed:', preview + '...');
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        const preview = statement.replace(/\s+/g, ' ').substring(0, 60);
        console.log('⊗ Skipped (already exists):', preview + '...');
      } else {
        console.error('✗ Error:', error.message);
        console.error('Statement:', statement.substring(0, 100));
      }
    }
  }

  console.log('\n✓ Schema push completed!');
}

pushSchemaToTurso().catch(console.error);
