import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');

// Configuration for "visually lossless" WebP
const webpConfig = {
    quality: 80, // Good quality, usually smaller than JPEG
    lossless: false, 
    smartSubsample: true 
};

async function convertImages() {
    if (!fs.existsSync(assetsDir)) {
        console.error('Assets directory not found:', assetsDir);
        return;
    }

    const files = fs.readdirSync(assetsDir);
    
    for (const file of files) {
        if (file.match(/\.(jpeg|jpg|png)$/i)) {
            const inputPath = path.join(assetsDir, file);
            const outputPath = path.join(assetsDir, file.replace(/\.(jpeg|jpg|png)$/i, '.webp'));
            
            try {
                console.log(`Converting ${file} to WebP...`);
                await sharp(inputPath)
                    .webp(webpConfig)
                    .toFile(outputPath);
                
                // Compare sizes
                const inputStats = fs.statSync(inputPath);
                const outputStats = fs.statSync(outputPath);
                const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);
                
                console.log(`Saved ${savings}% (${(inputStats.size/1024).toFixed(2)}kb -> ${(outputStats.size/1024).toFixed(2)}kb)`);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
            }
        }
    }
}

convertImages();

