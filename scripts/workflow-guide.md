# Adding New Images to S3 Wedding Gallery

## Quick Workflow

### 1. Add New Images
```bash
# Place new images in the new-images folder
mkdir -p new-images
# Copy your new .jpg files to new-images/
```

### 2. Process & Upload
```bash
# Run the automated script
node scripts/add-new-images.js
```

### 3. Deploy Changes
```bash
# Commit the updated JSON file
git add src/data/wedding-photos.json
git commit -m "Add X new wedding photos"
git push origin main
```

## What the Script Does Automatically

1. **📏 Resizes Images**: Optimizes to max 2000px (same as existing)
2. **🖼️ Generates Thumbnails**: Creates 400x400 thumbnails
3. **☁️ Uploads to S3**: Both main images and thumbnails
4. **📝 Updates JSON**: Adds entries with S3 URLs and categories
5. **💾 Creates Backup**: Saves backup of JSON before changes
6. **📁 Organizes Files**: Moves processed images to `processed/` folder

## Manual Category Assignment

The script will randomly assign categories. To manually set categories, edit the script:

```javascript
// Replace this line in add-new-images.js:
const category = promptForCategory();

// With your desired category:
const category = 'ceremony'; // or 'reception', 'portraits', 'candid'
```

## File Structure After Processing

```
new-images/
├── processed/           # Processed images (moved here)
│   ├── KM (700).jpg
│   └── KM (701).jpg
└── (empty - ready for next batch)

S3 Bucket:
├── images/
│   ├── KM (700).jpg     # New main images
│   └── KM (701).jpg
└── images/thumbnails/
    ├── KM (700).jpg     # New thumbnails
    └── KM (701).jpg
```

## Troubleshooting

### AWS Credentials Not Found
```bash
aws configure
# Enter your Access Key, Secret Key, and region
```

### Script Fails
- Check AWS credentials are configured
- Ensure S3 bucket exists and has proper permissions
- Verify new images are .jpg format
- Check file names don't contain special characters

### Images Don't Appear in Gallery
- Verify JSON file was updated and committed
- Check Netlify deployment completed
- Confirm S3 URLs are accessible in browser

## Advanced: Batch Processing with Categories

For large batches, organize by category first:

```bash
new-images/
├── ceremony/
│   ├── IMG001.jpg
│   └── IMG002.jpg
├── reception/
│   ├── IMG003.jpg
│   └── IMG004.jpg
└── portraits/
    ├── IMG005.jpg
    └── IMG006.jpg
```

Then modify the script to read folder names as categories.
