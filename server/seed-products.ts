import { db } from './db';
import { products } from '@shared/schema';

async function seedProducts() {
  const products: InsertProduct[] = [
    {
      name: "2025-26 All-Star Girls Report Scouting Service (Regional)",
      slug: "regional-scouting-service",
      description: "Regional Package includes Top 350 High School Class coverage for Carolinas, DMV, Peach State, Sunshine State, Lone Star State, and SoCal/NorCal regions.",
      price: 695,
      category: "Regional",
      imageUrl: "/attached_assets/AddisonMackPhoto-e1726688270253.jpg",
      features: [
        "Top 350 High School Class",
        "Carolinas Coverage",
        "DMV Coverage",
        "Peach State Coverage",
        "Sunshine State Coverage",
        "Lone Star State Coverage",
        "SoCal/NorCal Coverage"
      ]
    },
    {
      name: "2025-26 All-Star Girls Report Scouting Service (National)",
      slug: "national-scouting-service",
      description: "National Package includes comprehensive coverage of Top 350 High School Class (2026-2027), Top 350 College Transfer Portal, and regional composite rankings.",
      price: 1095,
      category: "National",
      imageUrl: "/attached_assets/AliciaMitchellPhoto-e1717177516868.jpg",
      features: [
        "Top 350 High School Class (National) - 2026-2027",
        "Top 350 College Transfer Portal - 2026",
        "Top 350 High School Class (Composite)",
        "Carolinas, DMV, Peach State",
        "Sunshine State, Lone Star State",
        "SoCal/NorCal Coverage"
      ]
    },
    {
      name: "2025-26 All-Star Girls Report Scouting Service (Premium)",
      slug: "premium-scouting-service",
      description: "Premium Package includes the most comprehensive coverage with Top 350 High School Class (2026-2030), Transfer Portal rankings, and all regional composite rankings.",
      price: 1495,
      category: "Premium",
      imageUrl: "/attached_assets/AmaniJenkinsPhoto-e1726612378162.jpg",
      features: [
        "Top 350 High School Class (National) - 2026-2030",
        "Top 350 College Transfer Portal - 2026",
        "Top 350 High School Class (Composite)",
        "Carolinas, DMV, Peach State",
        "Sunshine State, Lone Star State",
        "SoCal/NorCal Coverage",
        "Extended Multi-Year Coverage"
      ]
    }
  ];

  console.log('Seeding products...');

  for (const product of products) {
    await db.insert(products).values(product).onConflictDoNothing();
    console.log(`Inserted: ${product.name}`);
  }

  console.log('Products seeded successfully!');
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error('Error seeding products:', error);
  process.exit(1);
});