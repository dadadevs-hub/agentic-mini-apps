
# GEOSATS - GPS Bounty Hunter

A decentralized application that combines GPS location services, Lightning Network payments, Nostr protocol, and AI to create an exciting real-world bounty hunting experience.

## 🎯 What is GEOSATS?

GEOSATS allows users to create location-based bounties with Bitcoin rewards. Other users can hunt these bounties by physically going to the specified GPS coordinates, solving optional AI-generated puzzles, and claiming their rewards through the Lightning Network.

## 🚀 Features

- **GPS-Based Bounties**: Create and discover location-specific challenges
- **Lightning Network Integration**: Instant Bitcoin payments for successful claims
- **Nostr Protocol**: Decentralized data storage and communication
- **AI-Generated Puzzles**: Optional riddles and challenges for bounty locations
- **Interactive Map**: Visual bounty discovery and navigation
- **Real-time Feed**: Live updates of bounty activities
- **Mobile-Optimized**: Perfect for on-the-go treasure hunting

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Hooks + Custom Context
- **Lightning**: WebLN integration (Alby, LNbits compatible)
- **Location**: HTML5 Geolocation API
- **UI Components**: Lucide React icons + Custom components

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BountyMap.tsx   # Interactive map component
│   ├── BountyFeed.tsx  # Bounty listing and feed
│   ├── CreateBountyForm.tsx
│   └── ClaimBountyModal.tsx
├── hooks/              # Custom React hooks
│   ├── useNostr.ts     # Nostr protocol integration
│   ├── useLightning.ts # Lightning Network integration
│   └── useLocation.ts  # GPS and location services
├── pages/              # Main application pages
│   └── Index.tsx       # Main app interface
└── lib/                # Utility functions
    └── utils.ts
```

## 🎮 How to Use

### For Bounty Creators:
1. Click "Create Bounty" to set up a new challenge
2. Set GPS coordinates (or use current location)
3. Add description and reward amount in sats
4. Optionally generate an AI puzzle
5. Fund the bounty through Lightning Network

### For Bounty Hunters:
1. Browse bounties on the map or feed
2. Navigate to the GPS location
3. Solve any required puzzles
4. Claim your reward when within range

## 🔧 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Integration Features

### Lightning Network
- WebLN browser extension support
- Automatic payment processing
- Escrow functionality for bounty funds
- Real-time balance tracking

### Nostr Protocol
- Decentralized bounty storage
- Event-based claim verification
- Cross-relay synchronization
- Identity management

### GPS & Location
- High-accuracy positioning
- Proximity verification
- Real-time location tracking
- Distance calculations

## 🚀 Future Enhancements

- **Team Bounties**: Collaborative treasure hunting
- **Reputation System**: Hunter and creator ratings
- **Advanced Puzzles**: Photo verification, QR codes
- **Social Features**: Comments, sharing, following
- **Gamification**: Achievements, leaderboards, streaks

## 📱 Mobile Experience

GEOSATS is optimized for mobile devices with:
- Touch-friendly interface
- Offline map caching
- Background location tracking
- Push notifications for nearby bounties

## 🔐 Security & Privacy

- Non-custodial Lightning payments
- Encrypted location data
- Pseudonymous Nostr identities
- Optional privacy modes

## 📄 License

Open source project - see LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

---

**Ready to start your bounty hunting adventure? Install a Lightning wallet and let's explore the world together! ⚡🌍**
