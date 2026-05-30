const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:223326061189Marcopolo@db.zvjahzusqybrjlbctrsc.supabase.co:5432/postgres",
});

async function test() {
  try {
    await client.connect();
    console.log("Conexión DIRECTA exitosa!");
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    await client.end();
  } catch (e) {
    console.error("Fallo conexión DIRECTA:", e.message);
  }
}

test();
