const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const productTemplates = require('../src/data/products.json');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedFromUploads = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Get all image files from uploads/products recursively
        const productsUploadsDir = path.join(__dirname, 'uploads', 'products');
        
        const getFilesRecursively = (dir) => {
            let results = [];
            const list = fs.readdirSync(dir);
            list.forEach(file => {
                file = path.resolve(dir, file);
                const stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    results = results.concat(getFilesRecursively(file));
                } else {
                    const ext = path.extname(file).toLowerCase();
                    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                        results.push(file);
                    }
                }
            });
            return results;
        };

        if (!fs.existsSync(productsUploadsDir)) {
            console.error('❌ uploads/products folder not found!');
            process.exit(1);
        }

        const absoluteImagePaths = getFilesRecursively(productsUploadsDir);
        const imageFiles = absoluteImagePaths.map(abs => {
            // Get path relative to the uploads folder so it matches static serving
            return path.relative(path.join(__dirname, 'uploads'), abs).replace(/\\/g, '/');
        });

        console.log(`📸 Found ${imageFiles.length} images in uploads/products folder.`);

        if (imageFiles.length === 0) {
            console.log('❌ No images found. Exiting.');
            process.exit();
        }

        // 2. Clear existing products (optional, but requested "start fresh")
        await Product.deleteMany();
        console.log('🧹 Cleared existing products');

        // 3. Create new products by cycling through templates
        const newProducts = imageFiles.map((filename, index) => {
            const template = productTemplates[index % productTemplates.length];
            const imageNumber = filename.split('.')[0].replace('IMG_', '');
            
            return {
                name: `${template.name} - ${imageNumber}`,
                category: template.category,
                price: template.price,
                originalPrice: template.originalPrice,
                fabric: template.fabric,
                material: template.material,
                transparency: template.transparency,
                sizes: template.sizes,
                colors: template.colors,
                description: template.description,
                images: [filename.startsWith('/') ? filename : '/' + filename],
                room: template.room,
                isBestSeller: index < 10, // First 10 are best sellers
                fastDelivery: template.fastDelivery,
                stock: Math.floor(Math.random() * 50) + 10
            };
        });

        // 4. Insert into DB
        await Product.insertMany(newProducts);
        console.log(`🚀 Successfully added ${newProducts.length} products to the database!`);

        process.exit();
    } catch (err) {
        console.error('💥 Error seeding products:', err.message);
        process.exit(1);
    }
};

seedFromUploads();
