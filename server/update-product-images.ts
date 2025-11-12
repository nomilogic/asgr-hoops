import { db } from "./db";
import { products } from "@shared/schema";
import { eq } from "drizzle-orm";

async function updateProductImages() {
  console.log("Updating product images...");

  await db
    .update(products)
    .set({ imageUrl: "/attached_assets/generated_images/Regional_scouting_service_package_2579b290.png" })
    .where(eq(products.id, 1));

  await db
    .update(products)
    .set({ imageUrl: "/attached_assets/generated_images/National_scouting_service_package_54b6ceb5.png" })
    .where(eq(products.id, 2));

  await db
    .update(products)
    .set({ imageUrl: "/attached_assets/generated_images/Premium_scouting_service_package_3e189ab6.png" })
    .where(eq(products.id, 3));

  console.log("Product images updated successfully!");
  process.exit(0);
}

updateProductImages().catch((error) => {
  console.error("Error updating product images:", error);
  process.exit(1);
});
