import 'dotenv/config';
import { query } from '../src/config/db.js';

const products = [
    {
        sku: 'KORI-HM-001',
        name: 'Hokkaido Milk',
        category: 'classic',
        description: 'Ultra-creamy ice cream made with pure Hokkaido milk from free-range cows. Subtly sweet with a velvety finish.',
        flavor_profile: JSON.stringify({ notes: ['creamy', 'vanilla', 'milk'], intensity: 'mild', origin: 'Hokkaido' }),
        price_cents: 1480,
        stock_quantity: 50,
        batch_status: 'available',
        image_url: '/images/hokkaido-milk.jpg'
    },
    {
        sku: 'KORI-YZ-002',
        name: 'Yuzu Citrus',
        category: 'seasonal',
        description: 'Bright and tangy yuzu citrus sorbet blended into a silky ice cream base. A burst of Japanese sunshine.',
        flavor_profile: JSON.stringify({ notes: ['citrus', 'tangy', 'refreshing'], intensity: 'bright', origin: 'Kochi' }),
        price_cents: 1580,
        stock_quantity: 15,
        batch_status: 'low_stock',
        image_url: '/images/yuzu-citrus.jpg'
    },
    {
        sku: 'KORI-KM-003',
        name: 'Kyoto Matcha',
        category: 'classic',
        description: 'Ceremonial-grade Uji matcha from Kyoto, stone-ground and folded into rich cream. Earthy, umami, unforgettable.',
        flavor_profile: JSON.stringify({ notes: ['matcha', 'earthy', 'umami'], intensity: 'rich', origin: 'Kyoto' }),
        price_cents: 1680,
        stock_quantity: 35,
        batch_status: 'available',
        image_url: '/images/kyoto-matcha.jpg'
    },
    {
        sku: 'KORI-BS-004',
        name: 'Black Sesame',
        category: 'classic',
        description: 'Toasted black sesame seeds ground into a nutty, deeply aromatic ice cream. Bold and sophisticated.',
        flavor_profile: JSON.stringify({ notes: ['nutty', 'roasted', 'sesame'], intensity: 'bold', origin: 'Kagoshima' }),
        price_cents: 1580,
        stock_quantity: 28,
        batch_status: 'available',
        image_url: '/images/black-sesame.jpg'
    },
    {
        sku: 'KORI-SK-005',
        name: 'Sakura Blossom',
        category: 'seasonal',
        description: 'Delicate cherry blossom petals infused into a light, floral ice cream. The taste of Japanese spring.',
        flavor_profile: JSON.stringify({ notes: ['floral', 'cherry', 'delicate'], intensity: 'light', origin: 'Yoshino' }),
        price_cents: 1780,
        stock_quantity: 8,
        batch_status: 'low_stock',
        image_url: '/images/sakura-blossom.jpg'
    },
    {
        sku: 'KORI-HA-006',
        name: 'Houjicha Amber',
        category: 'limited_batch',
        description: 'Roasted green tea with caramel undertones. Limited release from a single Shizuoka estate.',
        flavor_profile: JSON.stringify({ notes: ['roasted', 'caramel', 'tea'], intensity: 'warm', origin: 'Shizuoka' }),
        price_cents: 1980,
        stock_quantity: 0,
        batch_status: 'pre_order',
        waitlist_count: 47,
        image_url: '/images/houjicha-amber.jpg'
    },
    {
        sku: 'KORI-WM-007',
        name: 'Wasabi Mint',
        category: 'limited_batch',
        description: 'Fresh Shizuoka wasabi meets cool peppermint in an unexpectedly harmonious, tingling creation.',
        flavor_profile: JSON.stringify({ notes: ['spicy', 'mint', 'fresh'], intensity: 'bold', origin: 'Shizuoka' }),
        price_cents: 2180,
        stock_quantity: 5,
        batch_status: 'low_stock',
        image_url: '/images/wasabi-mint.jpg'
    },
    {
        sku: 'KORI-KB-008',
        name: 'Kori Club Box',
        category: 'subscription',
        description: 'Monthly curated tasting box with 4 rotating seasonal pints. Exclusive access to limited drops and early releases.',
        flavor_profile: JSON.stringify({ notes: ['variety', 'curated', 'seasonal'], intensity: 'varied', origin: 'Japan' }),
        price_cents: 4980,
        stock_quantity: 999,
        batch_status: 'available',
        image_url: '/images/kori-club-box.jpg'
    }
];

async function seed() {
    console.log('🧊 Seeding Kori products...');
    for (const p of products) {
        const sql = `
      INSERT INTO products (sku, name, category, description, flavor_profile, price_cents, stock_quantity, batch_status, waitlist_count, image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (sku) DO NOTHING
    `;
        await query(sql, [
            p.sku, p.name, p.category, p.description, p.flavor_profile,
            p.price_cents, p.stock_quantity, p.batch_status, p.waitlist_count || 0, p.image_url
        ]);
        console.log(`  ✓ ${p.name}`);
    }
    console.log('🎉 Seed complete.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
