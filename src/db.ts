import { createClient } from "@libsql/client/web";

const url = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

// Initialize Turso Client
export const client = createClient({
    url: url,
    authToken: authToken,
});

export async function createTable() {
    await client.execute(`
        CREATE TABLE IF NOT EXISTS counter_table (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            counter INTEGER NOT NULL DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    // Ensure initial row exists
    await client.execute(`
        INSERT OR IGNORE INTO counter_table (id, counter) VALUES (1, 0)
    `);
}

export async function getCounter() {
    const rs = await client.execute(`
        SELECT counter FROM counter_table WHERE id = 1
    `);
    if (rs.rows.length === 0) {
        return null;
    }
    return rs.rows[0]!.counter;
}

export async function updateCounter() {
    const rs = await client.execute(`
        UPDATE counter_table SET counter = counter + 1 WHERE id = 1 RETURNING counter
    `);
    if (rs.rows.length === 0) {
        return null;
    }
    return rs.rows[0]!.counter;
}

// Initialize table and test connection
(async () => {
    await createTable();
})();
