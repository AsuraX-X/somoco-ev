import bcrypt from "bcryptjs";

/**
 * Script to generate a password hash for the admin user
 * Usage: npx ts-node scripts/generate-password-hash.ts YOUR_PASSWORD
 */

const password = process.argv[2];

if (!password) {
  console.error("❌ Please provide a password as an argument");
  console.log(
    "Usage: npx ts-node scripts/generate-password-hash.ts YOUR_PASSWORD"
  );
  process.exit(1);
}

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, 10);

    console.log("\n✅ Password hash generated successfully!\n");
    console.log("Add these to your .env.local file:\n");
    console.log('ADMIN_USERNAME="admin"');
    console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
    console.log('AUTH_SECRET="' + generateRandomString(32) + '"');
    console.log(
      "\n📝 You can change ADMIN_USERNAME to any username you prefer.\n"
    );
  } catch (error) {
    console.error("❌ Error generating hash:", error);
    process.exit(1);
  }
}

function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

generateHash();
