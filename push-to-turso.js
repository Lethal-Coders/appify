const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function main() {
    const url = "libsql://appify-vercel-icfg-2xdut9jkyno1wmkiqobl0sgm.aws-us-east-1.turso.io";
    const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjEwMzI4OTAsImlkIjoiZDVjZmNkMmQtYjIyOC00NjM0LWIwM2EtYTgwZTE2MGMzNWVjIiwicmlkIjoiN2FlYmE2MmItZWI0OC00ZWM1LWJmYzktODk3M2RmODFiYWVmIn0.MPk3VYO3mlmm7Qaywp6GEG6T9ioG4nqbvCMpJOLzKTHd5TX-GAggu0NGOgYUChEpPev1CRrw6U3-LE9Y3dnpCQ";

    console.log('Connecting to Turso...');
    const client = createClient({
        url,
        authToken,
    });

    try {
        const sqlPath = path.join(__dirname, 'migration_utf8.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon to get individual statements
        // This is a naive split, but standard Prisma migrations usually work with it
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`Found ${statements.length} statements to execute.`);

        for (const statement of statements) {
            console.log(`Executing statement: ${statement.substring(0, 50)}...`);
            await client.execute(statement);
        }

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        client.close();
    }
}

main();
