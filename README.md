# 🎤 Personal Videoke

A simple, elegant karaoke application for personal use. Search YouTube for karaoke songs, build a queue, and sing along!

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)

## ✨ Features

- 🔍 **YouTube Search** - Search for karaoke songs from YouTube
- 📋 **Queue Management** - Build and manage your song queue
- 🎬 **Video Playback** - Embedded YouTube player with controls
- 🔄 **Drag & Drop** - Reorder songs in your queue
- 📱 **Mobile Responsive** - Works on desktop, iPad, and iPhone
- ⏭️ **Auto-advance** - Automatically plays next song when current ends
- 🎨 **Beautiful UI** - Modern, gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- **Node.js** 14.x or higher
- **npm** or **yarn**
- **YouTube Data API v3 Key** (free from Google Cloud Console)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/videoke-Christmas.git
   cd videoke-Christmas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your YouTube API key:**

   a. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

   b. Get a YouTube API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select existing)
   - Enable **YouTube Data API v3**
   - Create credentials → API Key
   - Copy the API key

   c. Edit `.env.local` and add your key:
   ```
   NEXT_PUBLIC_YOUTUBE_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Start searching for karaoke songs!

## 📱 Mobile Access (iPad/iPhone)

To use on mobile devices on the same WiFi network:

1. **Start the server for network access:**
   ```bash
   npm run dev:mobile
   ```

2. **Note the IP address shown** in the terminal output (e.g., `http://192.168.1.100:3000`)

3. **On your mobile device**, open browser and go to that URL

See [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md) for detailed instructions.

## 📖 Documentation

- **[Operating Guide](OPERATING_GUIDE.md)** - Complete user manual
- **[Technical Stack](TECHNICAL_STACK.md)** - Architecture and technology details
- **[Mobile Access Guide](MOBILE_ACCESS_GUIDE.md)** - iPad/iPhone setup
- **[Git Guide](GIT_GUIDE.md)** - Version control instructions

## 🛠️ Tech Stack

- **Framework:** Next.js 14.2 (App Router)
- **UI Library:** React 18.3
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 3.4
- **Video Player:** react-youtube 10.1
- **API:** YouTube Data API v3

## 📂 Project Structure

```
videoke-Christmas/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
├── public/                # Static assets
└── [config files]         # TypeScript, Tailwind, etc.
```

## 🎮 Usage

1. **Search** for a karaoke song in the search bar
2. **Click "Add to Queue"** on any search result
3. **First song auto-plays** when added to queue
4. **Use Prev/Next buttons** to navigate between songs
5. **Drag and drop** to reorder queue
6. **Click "Clear All"** to empty the queue

## 🔧 Available Scripts

```bash
npm run dev         # Start development server (localhost only)
npm run dev:mobile  # Start server accessible on network (for iPad/mobile)
npm run build       # Build for production
npm start           # Run production server
npm run lint        # Run ESLint
npm run type-check  # Check TypeScript types
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | YouTube Data API v3 key | Yes |

### API Quota

The free tier of YouTube Data API provides:
- **10,000 units per day**
- Each search costs ~100 units
- Approximately **100 searches per day**

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🎯 Use Cases

- **Family gatherings** - Karaoke nights at home
- **Parties** - Queue up songs for guests
- **Practice** - Solo karaoke practice
- **Christmas** - Holiday song singalongs (original use case!)

## 🐛 Troubleshooting

### "YouTube API access denied"
- Check your API key is correct in `.env.local`
- Verify YouTube Data API v3 is enabled in Google Cloud Console
- Check API key restrictions

### "Port 3000 is in use"
- App will automatically use port 3001
- Or specify a different port: `npm run dev -- -p 3002`

### "Can't access on iPad"
- Ensure both devices are on same WiFi
- Use `npm run dev:mobile` instead of `npm run dev`
- Check firewall settings on computer

### "Video won't play"
- Some videos disable embedding
- Try a different search result
- Check internet connection

## 🔒 Security Notes

- **Never commit `.env.local`** to git (already in `.gitignore`)
- API key is exposed to browser (normal for `NEXT_PUBLIC_` variables)
- Consider adding API key restrictions in Google Cloud Console:
  - HTTP referrer restrictions
  - IP address restrictions (for production)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Video playback via [react-youtube](https://github.com/tjallingt/react-youtube)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Data from [YouTube Data API](https://developers.google.com/youtube/v3)

## 📧 Contact

For questions or issues, please open a GitHub issue.

---

**Made with ❤️ for karaoke lovers**

🎤 Happy Singing! 🎵
