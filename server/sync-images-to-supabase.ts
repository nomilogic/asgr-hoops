
import * as fs from "fs";
import * as path from "path";
import { db } from "./db";
import { players, colleges, highSchools } from "@shared/schema";
import { uploadImageFromLocalPath } from "./supabase-storage";
import { eq } from "drizzle-orm";

async function syncImagesToSupabase() {
  console.log("Starting image sync to Supabase...");

  const attachedAssetsPath = path.join(process.cwd(), "attached_assets");
  
  if (!fs.existsSync(attachedAssetsPath)) {
    console.error("attached_assets folder not found");
    return;
  }

  // Get all players from database
  const allPlayers = await db.select().from(players);
  console.log(`Found ${allPlayers.length} players in database`);

  let uploadedCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  // Process each player
  for (const player of allPlayers) {
    if (!player.photoUrl) {
      skippedCount++;
      continue;
    }

    // Extract filename from the current URL
    const urlParts = player.photoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Check if file exists in attached_assets
    const localPath = path.join(attachedAssetsPath, filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`File not found for player ${player.name}: ${filename}`);
      skippedCount++;
      continue;
    }

    try {
      // Upload to Supabase
      const storagePath = `players/${player.id}-${filename}`;
      console.log(`Uploading ${filename} for player ${player.name}...`);
      
      const result = await uploadImageFromLocalPath(localPath, storagePath);
      
      // Update player record with new URL
      await db.update(players)
        .set({ photoUrl: result.url })
        .where(eq(players.id, player.id));
      
      console.log(`✓ Updated player ${player.name}: ${result.url}`);
      uploadedCount++;
      
    } catch (err) {
      console.error(`✗ Error uploading image for ${player.name}:`, err);
      errorCount++;
    }
  }

  // Get all colleges from database
  const allColleges = await db.select().from(colleges);
  console.log(`\nFound ${allColleges.length} colleges in database`);

  // Process each college
  for (const college of allColleges) {
    if (!college.logoUrl) {
      skippedCount++;
      continue;
    }

    // Extract filename from the current URL
    const urlParts = college.logoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Check if file exists in attached_assets
    const localPath = path.join(attachedAssetsPath, filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`File not found for college ${college.name}: ${filename}`);
      skippedCount++;
      continue;
    }

    try {
      // Upload to Supabase
      const sanitizedName = college.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const storagePath = `colleges/${sanitizedName}-${filename}`;
      console.log(`Uploading ${filename} for college ${college.name}...`);
      
      const result = await uploadImageFromLocalPath(localPath, storagePath);
      
      // Update college record with new URL
      await db.update(colleges)
        .set({ logoUrl: result.url })
        .where(eq(colleges.id, college.id));
      
      console.log(`✓ Updated college ${college.name}: ${result.url}`);
      uploadedCount++;
      
    } catch (err) {
      console.error(`✗ Error uploading logo for ${college.name}:`, err);
      errorCount++;
    }
  }

  // Get all high schools from database
  const allHighSchools = await db.select().from(highSchools);
  console.log(`\nFound ${allHighSchools.length} high schools in database`);

  // Process each high school
  for (const school of allHighSchools) {
    if (!school.logoUrl) {
      skippedCount++;
      continue;
    }

    // Extract filename from the current URL
    const urlParts = school.logoUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Check if file exists in attached_assets
    const localPath = path.join(attachedAssetsPath, filename);
    
    if (!fs.existsSync(localPath)) {
      console.log(`File not found for high school ${school.name}: ${filename}`);
      skippedCount++;
      continue;
    }

    try {
      // Upload to Supabase
      const sanitizedName = school.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const storagePath = `high-schools/${sanitizedName}-${filename}`;
      console.log(`Uploading ${filename} for high school ${school.name}...`);
      
      const result = await uploadImageFromLocalPath(localPath, storagePath);
      
      // Update high school record with new URL
      await db.update(highSchools)
        .set({ logoUrl: result.url })
        .where(eq(highSchools.id, school.id));
      
      console.log(`✓ Updated high school ${school.name}: ${result.url}`);
      uploadedCount++;
      
    } catch (err) {
      console.error(`✗ Error uploading logo for ${school.name}:`, err);
      errorCount++;
    }
  }

  console.log(`\n=== Sync Complete ===`);
  console.log(`Successfully uploaded and updated: ${uploadedCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Skipped (no URL or file not found): ${skippedCount}`);
}

syncImagesToSupabase()
  .catch(console.error)
  .finally(() => process.exit());
