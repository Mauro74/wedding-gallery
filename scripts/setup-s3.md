# AWS S3 Setup Guide for Wedding Gallery

## Step 1: Create S3 Bucket

1. **Log into AWS Console**: Go to https://console.aws.amazon.com/s3/
2. **Create Bucket**:
   - Click "Create bucket"
   - Bucket name: `karen-maurizio-wedding-photos` (must be globally unique)
   - Region: Choose closest to your users (e.g., `us-east-1` or `eu-west-1`)
   - **Uncheck "Block all public access"** (we need public read access for images)
   - Acknowledge the warning about public access
   - Click "Create bucket"

## Step 2: Configure Bucket Permissions

### 2.1 Bucket Policy
1. Go to your bucket → **Permissions** tab
2. Scroll to **Bucket policy** and click "Edit"
3. Add this policy (replace `karen-maurizio-wedding-photos` with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::karen-maurizio-wedding-photos/*"
        }
    ]
}
```

### 2.2 CORS Configuration
1. Go to **Permissions** tab → **Cross-origin resource sharing (CORS)**
2. Add this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## Step 3: Upload Images

### Option A: AWS Console (Manual)
1. Go to your bucket → **Objects** tab
2. Click "Upload"
3. Create folders: `images/` and `images/thumbnails/`
4. Upload your optimized images from `public/images/` to `images/`
5. Upload thumbnails from `public/images/thumbnails/` to `images/thumbnails/`

### Option B: AWS CLI (Automated)
```bash
# Install AWS CLI if not already installed
# Configure with: aws configure

# Upload all images
aws s3 sync public/images/ s3://karen-maurizio-wedding-photos/images/ --acl public-read

# Upload thumbnails
aws s3 sync public/images/thumbnails/ s3://karen-maurizio-wedding-photos/images/thumbnails/ --acl public-read
```

## Step 4: Update Image URLs

Your S3 URLs will be in format:
- **Images**: `https://karen-maurizio-wedding-photos.s3.amazonaws.com/images/KM (5).jpg`
- **Thumbnails**: `https://karen-maurizio-wedding-photos.s3.amazonaws.com/images/thumbnails/KM (5).jpg`

## Step 5: Benefits

✅ **Performance**: CDN-like delivery from AWS edge locations
✅ **Scalability**: Handle unlimited traffic
✅ **Reliability**: 99.999999999% (11 9's) durability
✅ **Cost-effective**: Pay only for storage and bandwidth used
✅ **Smaller Git repo**: Remove large images from version control

## Security Note

The bucket policy allows public read access to images only. This is necessary for the gallery to work but keeps your images publicly accessible. Consider:
- Using CloudFront with signed URLs for additional security
- Implementing referrer restrictions if needed
