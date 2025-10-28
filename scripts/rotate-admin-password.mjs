#!/usr/bin/env node
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

function generatePassword(len = 16) {
  // base64url yields URL-safe characters without padding
  return randomBytes(Math.ceil((len * 3) / 4))
    .toString("base64url")
    .slice(0, len);
}

function setOrAddEnvVar(contents, key, value) {
  const re = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;
  if (re.test(contents)) return contents.replace(re, line);
  return contents.trimEnd() + `\n${line}\n`;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const providedPassword = [...args]
    .find((a) => a.startsWith("--password="))
    ?.split("=")[1];
  const printOnly = args.has("--dry-run") || args.has("--print-only");
  const showPlain = args.has("--show-plain");

  const password = providedPassword || generatePassword(16);
  const hash = await bcrypt.hash(password, 10);
  const hashB64 = Buffer.from(hash, "utf8").toString("base64");

  const envPath = path.resolve(process.cwd(), ".env.local");
  let envContent = "";
  try {
    envContent = fs.readFileSync(envPath, "utf8");
  } catch (e) {
    console.error(e)
    console.error(`Could not read ${envPath}. Create it first.`);
    process.exit(1);
  }

  // Prefer the base64 variant to avoid $ expansion issues
  let nextContent = envContent;
  nextContent = setOrAddEnvVar(nextContent, "ADMIN_PASSWORD_HASH_B64", hashB64);
  // Keep plain hash in sync for reference (auth prefers _B64 if present)
  nextContent = setOrAddEnvVar(nextContent, "ADMIN_PASSWORD_HASH", `'${hash}'`);

  if (printOnly) {
    console.log("--- DRY RUN (no changes written) ---");
    console.log(
      "New password:",
      showPlain ? password : "(hidden) use --show-plain to reveal"
    );
    console.log("bcrypt hash:", hash);
    console.log("base64 hash:", hashB64);
    console.log("\nPreview of updated .env.local:");
    console.log(nextContent);
    return;
  }

  fs.writeFileSync(envPath, nextContent, "utf8");
  console.log("Admin password rotated successfully.");
  console.log("Username: admin");
  console.log(
    "New password:",
    showPlain ? password : "(hidden) use --show-plain to reveal"
  );
  console.log("Note: Restart your dev server to load the new env values.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
