
import * as fs from "fs";
import * as path from "path";
import { uploadImageFromLocalPath } from "./supabase-storage";

async function uploadLocalImages() {
  console.log("Starting upload of local images to Supabase...");

  const attachedAssetsPath = path.join(process.cwd(), "attached_assets");
  
  if (!fs.existsSync(attachedAssetsPath)) {
    console.error("attached_assets folder not found");
    return;
  }

  const files = fs.readdirSync(attachedAssetsPath);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} image files to upload`);

  let uploadedCount = 0;
  let errorCount = 0;

  for (const fileName of imageFiles) {
    try {
      const localPath = path.join(attachedAssetsPath, fileName);
      
      // Determine storage path based on filename patterns
      let storagePath: string;
      
      if (fileName.toLowerCase().includes('logo')) {
        // College/school logos
        storagePath = `colleges/${fileName}`;
      } else if (fileName.toLowerCase().includes('photo')) {
        // Player photos
        storagePath = `players/${fileName}`;
      } else {
        // Other images
        storagePath = `misc/${fileName}`;
      }

      console.log(`Uploading ${fileName} to ${storagePath}...`);
      
      const result = await uploadImageFromLocalPath(localPath, storagePath);
      console.log(`✓ Uploaded: ${result.url}`);
      uploadedCount++;
      
    } catch (err) {
      console.error(`✗ Error uploading ${fileName}:`, err);
      errorCount++;
    }
  }

  console.log(`\nUpload completed!`);
  console.log(`Successfully uploaded: ${uploadedCount}`);
  console.log(`Errors: ${errorCount}`);
}

uploadLocalImages().catch(console.error);
