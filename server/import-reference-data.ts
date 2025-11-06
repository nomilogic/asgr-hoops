
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import { db } from "./db";
import { players, schools, rankings, schoolRankings } from "@shared/schema";
import { uploadPlayerImage, uploadCollegeLogo } from "./supabase-storage";

interface PlayerData {
  name: string;
  rankNumber: number | null;
  position: string | null;
  heightRaw: string | null;
  school: string | null;
  city: string | null;
  state: string | null;
  gradYear: number | null;
  committedTo: string | null;
  imageUrl: string | null;
  localImagePath: string | null;
}

interface SchoolRankingData {
  rank: number;
  schoolName: string;
  schoolState: string | null;
  logoUrl: string | null;
  wins: number | null;
  losses: number | null;
  keyWins: string | null;
  season: string;
  localLogoPath: string | null;
}

function downloadImageFromHTML(imageSrc: string, htmlDir: string): string | null {
  try {
    // Check if image is local reference
    if (imageSrc.startsWith('./')) {
      const imagePath = path.join(htmlDir, imageSrc.replace('./', ''));
      if (fs.existsSync(imagePath)) {
        return imagePath;
      }
    }
    
    // Extract filename from URL
    const urlParts = imageSrc.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Check in HTML files directory
    const localPath = path.join(htmlDir, filename);
    if (fs.existsSync(localPath)) {
      return localPath;
    }
    
    return null;
  } catch (err) {
    console.error('Error finding local image:', err);
    return null;
  }
}

function parsePlayersFromHTML(htmlPath: string, year: number): PlayerData[] {
  const html = fs.readFileSync(htmlPath, "utf-8");
  const $ = cheerio.load(html);
  const playersData: PlayerData[] = [];
  const htmlDir = path.dirname(htmlPath);

  // Try to find player tables or listings
  $('table tr, .player-row, .ranking-row, .divRow').each((i, elem) => {
    try {
      const $elem = $(elem);
      const text = $elem.text();
      
      // Skip header rows
      if (text.toLowerCase().includes('rank') && text.toLowerCase().includes('name')) {
        return;
      }

      // Try to extract player image first
      let imageUrl = null;
      let localImagePath = null;
      const imgTag = $elem.find('img').first();
      if (imgTag.length > 0) {
        const imgSrc = imgTag.attr('src');
        if (imgSrc) {
          imageUrl = imgSrc;
          localImagePath = downloadImageFromHTML(imgSrc, htmlDir);
        }
      }

      // Try to extract player data from table cells
      const cells = $elem.find('td, .divCell');
      if (cells.length >= 3) {
        const rank = parseInt(cells.eq(0).text().trim());
        const nameCell = cells.eq(1).find('.player_name a, a').first();
        const name = nameCell.length > 0 ? nameCell.text().trim() : cells.eq(1).text().trim();
        const height = cells.eq(2).text().trim();
        const position = cells.eq(3).text().trim();
        const gradYearText = cells.eq(4).text().trim();
        const school = cells.eq(5).text().trim();
        const program = cells.length > 6 ? cells.eq(6).text().trim() : null;

        if (name && !isNaN(rank)) {
          playersData.push({
            name,
            rankNumber: rank,
            position: position || null,
            heightRaw: height || null,
            school: school || null,
            city: null,
            state: null,
            gradYear: year,
            committedTo: program && program !== '-' ? program : null,
            imageUrl: imageUrl,
            localImagePath: localImagePath,
          });
        }
      }
    } catch (err) {
      console.error('Error parsing player row:', err);
    }
  });

  return playersData;
}

function parseSchoolRankingsFromHTML(htmlPath: string, season: string): SchoolRankingData[] {
  const html = fs.readFileSync(htmlPath, "utf-8");
  const $ = cheerio.load(html);
  const schoolsData: SchoolRankingData[] = [];
  const htmlDir = path.dirname(htmlPath);

  // Look for school ranking tables
  $('table tr, .school-row').each((i, elem) => {
    try {
      const $elem = $(elem);
      const cells = $elem.find('td');
      
      if (cells.length >= 2) {
        const rank = parseInt(cells.eq(0).text().trim());
        const schoolName = cells.eq(1).text().trim();
        const state = cells.length > 2 ? cells.eq(2).text().trim() : null;
        const record = cells.length > 3 ? cells.eq(3).text().trim() : null;
        
        if (!isNaN(rank) && schoolName) {
          let wins = null;
          let losses = null;
          
          // Parse record like "32-3" or "32 - 3"
          if (record) {
            const recordMatch = record.match(/(\d+)\s*-\s*(\d+)/);
            if (recordMatch) {
              wins = parseInt(recordMatch[1]);
              losses = parseInt(recordMatch[2]);
            }
          }

          // Try to extract school logo
          let logoUrl = null;
          let localLogoPath = null;
          const logoImg = $elem.find('img').first();
          if (logoImg.length > 0) {
            const logoSrc = logoImg.attr('src');
            if (logoSrc) {
              logoUrl = logoSrc;
              localLogoPath = downloadImageFromHTML(logoSrc, htmlDir);
            }
          }

          schoolsData.push({
            rank,
            schoolName,
            schoolState: state || null,
            logoUrl: logoUrl,
            wins,
            losses,
            keyWins: null,
            season,
            localLogoPath: localLogoPath,
          });
        }
      }
    } catch (err) {
      console.error('Error parsing school row:', err);
    }
  });

  return schoolsData;
}

async function importReferenceData() {
  console.log("Starting import from reference HTML files...");

  const referenceWebPath = path.join(process.cwd(), "reference-web");
  
  if (!fs.existsSync(referenceWebPath)) {
    console.error("reference-web folder not found");
    return;
  }

  // Process player rankings files
  const playerFiles = [
    { file: "Top 350 High School Class 2024 _ ASGR Hoops.html", year: 2024 },
    { file: "Top 350 High School Class 2025 _ ASGR Hoops.html", year: 2025 },
  ];

  for (const { file, year } of playerFiles) {
    const filePath = path.join(referenceWebPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`Processing ${file}...`);
      const playersData = parsePlayersFromHTML(filePath, year);
      
      if (playersData.length > 0) {
        console.log(`Found ${playersData.length} players for class of ${year}`);
        
        // Insert players
        for (const playerData of playersData) {
          try {
            // Upload player image if available
            let uploadedImageUrl = playerData.imageUrl;
            if (playerData.localImagePath && fs.existsSync(playerData.localImagePath)) {
              try {
                console.log(`Uploading image for ${playerData.name}...`);
                const imageBuffer = fs.readFileSync(playerData.localImagePath);
                const fileName = path.basename(playerData.localImagePath);
                
                // Insert player first to get ID
                const [insertedPlayer] = await db.insert(players).values({
                  name: playerData.name,
                  rankNumber: playerData.rankNumber,
                  position: playerData.position,
                  heightRaw: playerData.heightRaw,
                  school: playerData.school,
                  city: playerData.city,
                  state: playerData.state,
                  gradYear: playerData.gradYear,
                  committedTo: playerData.committedTo,
                  imageUrl: null,
                }).returning();
                
                // Upload image using player ID
                const result = await uploadPlayerImage(
                  insertedPlayer.id,
                  imageBuffer,
                  fileName
                );
                
                // Update player with image URL
                await db.update(players)
                  .set({ imageUrl: result.url })
                  .where({ id: insertedPlayer.id });
                
                uploadedImageUrl = result.url;
                console.log(`✓ Uploaded image for ${playerData.name}`);
                
                // Create ranking entry
                if (playerData.rankNumber) {
                  await db.insert(rankings).values({
                    playerId: insertedPlayer.id,
                    rankType: "high_school",
                    rank: playerData.rankNumber,
                    year: year,
                    rating: null,
                    ratingDescription: null,
                  });
                }
              } catch (uploadErr) {
                console.error(`✗ Error uploading image for ${playerData.name}:`, uploadErr);
                // Still insert player without image
                const [insertedPlayer] = await db.insert(players).values({
                  name: playerData.name,
                  rankNumber: playerData.rankNumber,
                  position: playerData.position,
                  heightRaw: playerData.heightRaw,
                  school: playerData.school,
                  city: playerData.city,
                  state: playerData.state,
                  gradYear: playerData.gradYear,
                  committedTo: playerData.committedTo,
                  imageUrl: uploadedImageUrl,
                }).returning();
                
                if (playerData.rankNumber) {
                  await db.insert(rankings).values({
                    playerId: insertedPlayer.id,
                    rankType: "high_school",
                    rank: playerData.rankNumber,
                    year: year,
                    rating: null,
                    ratingDescription: null,
                  });
                }
              }
            } else {
              // No local image, just insert player
              const [insertedPlayer] = await db.insert(players).values({
                name: playerData.name,
                rankNumber: playerData.rankNumber,
                position: playerData.position,
                heightRaw: playerData.heightRaw,
                school: playerData.school,
                city: playerData.city,
                state: playerData.state,
                gradYear: playerData.gradYear,
                committedTo: playerData.committedTo,
                imageUrl: uploadedImageUrl,
              }).returning();
              
              if (playerData.rankNumber) {
                await db.insert(rankings).values({
                  playerId: insertedPlayer.id,
                  rankType: "high_school",
                  rank: playerData.rankNumber,
                  year: year,
                  rating: null,
                  ratingDescription: null,
                });
              }
            }
          } catch (err) {
            console.error(`Error inserting player ${playerData.name}:`, err);
          }
        }
      }
    }
  }

  // Process school rankings files
  const schoolFiles = [
    { file: "2023-24 High School Rankings _ ASGR Hoops.html", season: "2023-24" },
    { file: "2024-25 High School Rankings _ ASGR Hoops.html", season: "2024-25" },
  ];

  for (const { file, season } of schoolFiles) {
    const filePath = path.join(referenceWebPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`Processing ${file}...`);
      const schoolsData = parseSchoolRankingsFromHTML(filePath, season);
      
      if (schoolsData.length > 0) {
        console.log(`Found ${schoolsData.length} schools for ${season} season`);
        
        // Insert school rankings
        for (const schoolData of schoolsData) {
          try {
            // Upload college logo if available
            let uploadedLogoUrl = schoolData.logoUrl;
            if (schoolData.localLogoPath && fs.existsSync(schoolData.localLogoPath)) {
              try {
                console.log(`Uploading logo for ${schoolData.schoolName}...`);
                const logoBuffer = fs.readFileSync(schoolData.localLogoPath);
                const fileName = path.basename(schoolData.localLogoPath);
                
                const result = await uploadCollegeLogo(
                  schoolData.schoolName,
                  logoBuffer,
                  fileName
                );
                
                uploadedLogoUrl = result.url;
                console.log(`✓ Uploaded logo for ${schoolData.schoolName}`);
              } catch (uploadErr) {
                console.error(`✗ Error uploading logo for ${schoolData.schoolName}:`, uploadErr);
              }
            }
            
            await db.insert(schoolRankings).values({
              rank: schoolData.rank,
              schoolName: schoolData.schoolName,
              schoolState: schoolData.schoolState,
              logoUrl: uploadedLogoUrl,
              wins: schoolData.wins,
              losses: schoolData.losses,
              keyWins: schoolData.keyWins,
              season: schoolData.season,
            });
          } catch (err) {
            console.error(`Error inserting school ${schoolData.schoolName}:`, err);
          }
        }
      }
    }
  }

  console.log("Reference data import completed!");
}

importReferenceData().catch(console.error);
