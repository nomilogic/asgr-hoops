import { db } from './db';
import { products, type InsertProduct } from '@shared/schema';

async function seedProducts() {
  const productsList: InsertProduct[] = [
    {
      name: "2025-26 All-Star Girls Report Scouting Service",
      slug: "premium-scouting-service",
      description: "Premium scouting service with extended coverage of multiple graduating classes",
      price: 1495,
      category: "Premium Scouting Service",
      imageUrl: "/attached_assets/AmaniJenkinsPhoto-e1726612378162.jpg",
      features: [
        "Top 750 High School Class",
        "National prospects in class 2026-2030",
        "Top College Transfer Portal Prospects",
        "NCAA Certified Scouting Service"
      ]
    },
    {
      name: "2025-2026 Brand Player Marketing Service",
      slug: "brand-marketing-service",
      description: "Comprehensive brand player marketing service",
      price: 1095,
      category: "Brand Marketing",
      imageUrl: "/attached_assets/AliciaMitchellPhoto-e1717177516868.jpg",
      features: [
        "Skill Assessment",
        "Consultation on College Placement",
        "Social Marketing",
        "24/7 Calendar Year Access"
      ]
    },
    {
      name: "2025-2026 Player Development Program",
      slug: "player-development-program",
      description: "Player development program for High School & Middle School in specific regions",
      price: 695,
      category: "Player Development",
      imageUrl: "/attached_assets/AddisonMackPhoto-e1726688270253.jpg",
      features: [
        "SoCal Player Development Program Packages",
        "Led by Kris Johnson, Player Development Specialist",
        "Ball-Handling, Shooting, Footwork, Passing",
        "Conditioning, Decision Making",
        "Leadership, Communication, Awareness, Habits"
      ]
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