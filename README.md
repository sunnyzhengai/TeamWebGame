# TeamWebGame.com

The ultimate team guessing game where communication, strategy, and fun collide.

## 🎮 About

TeamWebGame is a multiplayer team guessing game where teams compete to guess each other's preferences. Players join teams, take turns being the "origin team" that sets preferences, while other teams try to guess the correct order.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TeamGame/v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Home page: http://localhost:4000/home.html
   - Admin panel: http://localhost:4000/admin.html
   - Player join: http://localhost:4000/join.html

### Production Deployment

#### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Vercel will auto-detect it's a Node.js app
   - Deploy!

3. **Add custom domain**
   - In Vercel dashboard, go to Settings → Domains
   - Add `teamwebgame.com`
   - Update your domain's DNS records as instructed

#### Option 2: Railway

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub and select your repo
   - Railway will auto-deploy

2. **Add custom domain**
   - In Railway dashboard, go to Settings → Domains
   - Add your custom domain

## 🌐 Domain Setup

### DNS Configuration

For your domain `teamwebgame.com`, you'll need to configure DNS records:

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Railway:**
```
Type: CNAME
Name: @
Value: your-app.railway.app
```

## 📁 Project Structure

```
TeamGame/v2/
├── app.js                 # Main server file
├── services/
│   └── gameService.js     # Game logic and state management
├── routes/
│   └── gameRoutes.js      # API endpoints
├── public/                # Static files
│   ├── home.html          # Landing page
│   ├── admin.html         # Admin panel
│   ├── join.html          # Player join page
│   ├── round.html         # Game round page
│   ├── scoreboard.html    # Scoreboard display
│   └── winner.html        # Winner announcement
└── package.json           # Dependencies and scripts
```

## 🎯 Features

- **Multi-team gameplay** with dynamic team formation
- **Multiple rounds** with different origin teams
- **Real-time scoring** and leaderboards
- **Admin controls** for game management
- **Responsive design** for all devices
- **No registration required** - join with game codes

## 🔧 API Endpoints

- `POST /api/create-game` - Create a new game
- `POST /api/add-player` - Add player to game
- `POST /api/start-game` - Start the game
- `POST /api/select-origin-team` - Select origin team for round
- `POST /api/submit-guess` - Submit team guess
- `GET /api/scoreboard/:gameId` - Get game scoreboard
- `GET /api/declare-winner/:gameId` - Get winner information

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **State Management**: In-memory (for simplicity)
- **Deployment**: Vercel/Railway

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, contact us at support@teamwebgame.com

---

Built with ❤️ for fun, connection, and clarity. 