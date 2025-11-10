import { db } from "./db";
import { players, colleges, highSchools } from "@shared/schema";
import { getImageUrl } from "./supabase-storage";
import { eq } from "drizzle-orm";

async function syncImagesToSupabase() {
  console.log("Starting image URL sync from Supabase bucket...");

  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || 'asgr-images';

  if (!SUPABASE_URL) {
    console.error("SUPABASE_URL not found in environment");
    return;
  }

  let updatedCount = 0;
  let skippedCount = 0;

  // Update players
  const allPlayers = await db.select().from(players);
  console.log(`Found ${allPlayers.length} players in database`);

  for (const player of allPlayers) {
    if (!player.photoUrl) {
      skippedCount++;
      continue;
    }

    // Extract filename from current URL
    const urlParts = player.photoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Construct new Supabase URL
    const storagePath = `players/${player.id}-${filename}`;
    const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;

    try {
      await db.update(players)
        .set({ photoUrl: newUrl })
        .where(eq(players.id, player.id));

      console.log(`✓ Updated player ${player.name}: ${newUrl}`);
      updatedCount++;
    } catch (err) {
      console.error(`✗ Error updating ${player.name}:`, err);
    }
  }

  // Update colleges
  const allColleges = await db.select().from(colleges);
  console.log(`\nFound ${allColleges.length} colleges in database`);

  for (const college of allColleges) {
    if (!college.logoUrl) {
      skippedCount++;
      continue;
    }

    // Extract filename from current URL
    const urlParts = college.logoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Construct new Supabase URL
    const sanitizedName = college.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const storagePath = `colleges/${sanitizedName}-${filename}`;
    const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;

    try {
      await db.update(colleges)
        .set({ logoUrl: newUrl })
        .where(eq(colleges.id, college.id));

      console.log(`✓ Updated college ${college.name}: ${newUrl}`);
      updatedCount++;
    } catch (err) {
      console.error(`✗ Error updating ${college.name}:`, err);
    }
  }

  // Update high schools
  const allHighSchools = await db.select().from(highSchools);
  console.log(`\nFound ${allHighSchools.length} high schools in database`);

  for (const school of allHighSchools) {
    if (!school.logoUrl) {
      skippedCount++;
      continue;
    }

    // Extract filename from current URL
    const urlParts = school.logoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Construct new Supabase URL
    const sanitizedName = school.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const storagePath = `high-schools/${sanitizedName}-${filename}`;
    const newUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;

    try {
      await db.update(highSchools)
        .set({ logoUrl: newUrl })
        .where(eq(highSchools.id, school.id));

      console.log(`✓ Updated high school ${school.name}: ${newUrl}`);
      updatedCount++;
    } catch (err) {
      console.error(`✗ Error updating ${school.name}:`, err);
    }
  }

  console.log(`\n=== Sync Complete ===`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Skipped (no URL): ${skippedCount}`);
}

syncImagesToSupabase()
  .catch(console.error)
  .finally(() => process.exit());