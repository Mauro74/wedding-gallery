# Git Repository Cleanup Guide

## Folders to Remove (Safe to Delete)

Since your images are now hosted on S3, you can safely remove these large folders:

### 1. `public/images/` folder
- **Size**: ~160MB+ of optimized images
- **Contains**: All resized wedding photos and thumbnails
- **Safe to remove**: ✅ Yes - images now served from S3

### 2. `src/assets/` folder  
- **Size**: ~320MB+ of original high-res images
- **Contains**: Original wedding photos and thumbnails
- **Safe to remove**: ✅ Yes - no longer needed for production

## Step-by-Step Cleanup Process

### Option 1: Simple Removal (Recommended)
```bash
# Remove folders from current commit
git rm -r public/images/
git rm -r src/assets/

# Commit the removal
git commit -m "Remove large image folders - now hosted on S3"

# Push changes
git push origin main
```

### Option 2: Complete History Cleanup (Advanced)
If you want to remove these folders from Git history entirely to reduce repo size:

```bash
# Install git-filter-repo (if not installed)
brew install git-filter-repo

# Remove folders from entire Git history
git filter-repo --path public/images --invert-paths
git filter-repo --path src/assets --invert-paths

# Force push (WARNING: This rewrites history)
git push origin main --force
```

## Update .gitignore

Add these lines to prevent accidentally re-adding:
```
# Large image folders (now hosted on S3)
public/images/
src/assets/
```

## Benefits After Cleanup

- **Repo size**: Reduced by ~480MB+
- **Clone time**: Much faster for new developers
- **Git operations**: Faster commits, pulls, pushes
- **Storage**: Less GitHub storage usage
- **Performance**: Faster CI/CD builds

## Safety Checklist

Before cleanup, verify:
- ✅ S3 images are accessible at: https://karen-maurizio-wedding-photos.s3.amazonaws.com/
- ✅ Gallery loads images from S3 URLs
- ✅ All 210+ photos display correctly
- ✅ Thumbnails work properly
- ✅ Backup of original images exists elsewhere

## Files to Keep

These should remain in the repo:
- `scripts/` - All utility scripts
- `src/data/wedding-photos.json` - Photo metadata with S3 URLs
- `src/components/` - React components
- All other source code files
