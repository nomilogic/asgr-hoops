import { db } from './db';
import { products, type InsertProduct } from '@shared/schema';

async function seedProducts() {
  const productsList: InsertProduct[] = [
    {
      name: "2025-26 All-Star Girls Report Scouting Service",
      slug: "2025-26-all-star-girls-report-scouting-service",
      description: "Premium scouting service with extended coverage of multiple graduating classes",
      price: 1495,
      category: "Premium Scouting Service",
      features: [
        "Top 750 High School Class",
        "National prospects in class 2026-2030",
        "Top College Transfer Portal Prospects",
        "NCAA Certified Scouting Service"
      ],
      imageUrl: "/attached_assets/generated_images/Premium_scouting_service_package_3e189ab6.png"
    },
    {
      name: "2025-2026 Brand Player Marketing Service",
      slug: "2025-2026-brand-player-marketing-service",
      description: "Comprehensive brand player marketing service",
      price: 1095,
      category: "Brand Marketing",
      features: [
        "Skill Assessment",
        "Consultation on College Placement",
        "Social Marketing",
        "24/7 Calendar Year Access"
      ],
      imageUrl: "/attached_assets/generated_images/National_scouting_service_package_54b6ceb5.png"
    },
    {
      name: "2025-2026 Player Development Program",
      slug: "2025-2026-player-development-program",
      description: "Player development Program for High School & Middle School in specific regions",
      price: 695,
      category: "Player Development",
      features: [
        "SoCal Player Development Program Packages",
        "Led by Kris Johnson, Player Development Specialist",
        "Ball-Handling, Shooting, Footwork, Passing, Conditioning",
        "Decision Making, Leadership, Communication, Awareness, Habits"
      ],
      imageUrl: "/attached_assets/generated_images/Regional_scouting_service_package_2579b290.png"
    }
  ];

  console.log('Seeding products...');

  for (const product of productsList) {
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