import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

// Load .env variables
dotenv.config();

const url = process.env["TURSO_DATABASE_URL"];
const authToken = process.env["TURSO_AUTH_TOKEN"];

if (!url || !authToken) {
    console.error("❌ Database URL or Auth Token is missing in .env file!");
    process.exit(1);
}

// Initialize Turso Client
const client = createClient({
    url: url,
    authToken: authToken,
});

async function testConnection() {
    try {
        console.log("⏳ Connecting to Turso...");
        const rs = await client.execute("SELECT 1");
        console.log("✅ Successfully connected to Turso DB!");
        console.log("Result:", rs.rows);
    } catch (e) {
        console.error("❌ Failed to connect to Turso:", e);
    }
}

testConnection();
