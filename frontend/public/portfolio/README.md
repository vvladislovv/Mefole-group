# Portfolio Media Files

This directory contains all media files for portfolio projects with organized structure.

## Directory Structure

```
portfolio/
├── images/
│   ├── web-development/
│   │   ├── covers/          # Web development project covers
│   │   └── screenshots/     # Web development screenshots
│   ├── mobile-apps/
│   │   ├── covers/          # Mobile app project covers
│   │   └── screenshots/     # Mobile app screenshots
│   └── telegram-bots/
│       ├── covers/          # Telegram bot project covers
│       └── screenshots/     # Telegram bot screenshots
└── videos/
    ├── web-development/     # Web development demo & presentation videos
    ├── mobile-apps/         # Mobile app demo & presentation videos
    └── telegram-bots/       # Telegram bot demo & presentation videos
```

## File Naming Conventions

### Cover Images (`images/{category}/covers/`)
- `project-{id}-cover.jpg/png` - Main project cover image
- Example: `images/web-development/covers/project-1-cover.jpg`

### Screenshots (`images/{category}/screenshots/`)
- `project-{id}-screenshot-{number}.jpg/png` - Additional project screenshots
- Example: `images/web-development/screenshots/project-1-screenshot-1.jpg`

### Demo Videos (`videos/{category}/`)
- `project-{id}-demo.mp4` - Project demonstration video
- Example: `videos/web-development/project-1-demo.mp4`

### Presentation Videos (`videos/{category}/`)
- `project-{id}-presentation.mp4` - Project presentation video
- Example: `videos/web-development/project-1-presentation.mp4`

## Supported Formats

### Images
- **Formats**: JPG, PNG, WebP
- **Recommended size**: 1920x1080 or higher
- **Max file size**: 5MB per image
- **Aspect ratio**: 16:9 preferred for covers

### Videos
- **Formats**: MP4, WebM (MP4 preferred)
- **Recommended resolution**: 1920x1080 (Full HD)
- **Max file size**: 50MB per video
- **Duration**: 30-120 seconds for demos, up to 5 minutes for presentations
- **Codec**: H.264 for maximum compatibility

## Usage in Code

Reference files in portfolio data using these paths:

### Cover Images
```javascript
photo: "/portfolio/images/web-development/covers/project-1-cover.jpg"
```

### Screenshots Array
```javascript
photos: [
  "/portfolio/images/web-development/covers/project-1-cover.jpg",
  "/portfolio/images/web-development/screenshots/project-1-screenshot-1.jpg",
  "/portfolio/images/web-development/screenshots/project-1-screenshot-2.jpg"
]
```

### Demo Videos
```javascript
video: "/portfolio/videos/web-development/project-1-demo.mp4"
```

### Presentation Videos
```javascript
presentationVideo: "/portfolio/videos/web-development/project-1-presentation.mp4"
```

## Best Practices

1. **Optimize images** before uploading (use tools like TinyPNG)
2. **Compress videos** to reduce file size while maintaining quality
3. **Use descriptive names** that match your project IDs
4. **Maintain consistent aspect ratios** for better visual presentation
5. **Test file paths** in your portfolio data after adding new media