
import { db } from './db';
import { products } from '@shared/schema';

async function seedProducts() {
  const productData = [
    {
      name: '2025-26 All-Star Girls Report Scouting Service (Regional)',
      slug: 'regional-scouting-service',
      description: 'Regional scouting service covering top prospects in specific regions',
      price: 695,
      category: 'Scouting Service',
      features: [
        'Top 350 High School Class',
        '*Carolinas, DMV, Peach State, Sunshine State, Lone Star State, SoCal/NorCal'
      ],
      imageUrl: '/assets/iPad_scouting_app_mockup_1a4da2f8.png'
    },
    {
      name: '2025-26 All-Star Girls Report Scouting Service (National)',
      slug: 'national-scouting-service',
      description: 'Comprehensive national scouting service with transfer portal access',
      price: 1095,
      category: 'Scouting Service',
      features: [
        'Top 350 High School Class (National)',
        '*2026-2027',
        'Top 350 College Transfer Portal',
        '*2026',
        'Top 350 High School Class (Composite)',
        '*Carolinas, DMV, Peach State, Sunshine State, Lone Star State, SoCal/NorCal'
      ],
      imageUrl: '/assets/iPad_scouting_app_mockup_1a4da2f8.png'
    },
    {
      name: '2025-26 All-Star Girls Report Scouting Service (Premium)',
      slug: 'premium-scouting-service',
      description: 'Premium scouting service with extended coverage of multiple graduating classes',
      price: 1495,
      category: 'Scouting Service',
      features: [
        'Top 350 High School Class (National)',
        '*2026-2030',
        'Top 350 College Transfer Portal',
        '*2026',
        'Top 350 High School Class (Composite)',
        '*Carolinas, DMV, Peach State, Sunshine State, Lone Star State, SoCal/NorCal'
      ],
      imageUrl: '/assets/iPad_scouting_app_mockup_1a4da2f8.png'
    }
  ];

  console.log('Seeding products...');
  
  for (const product of productData) {
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
