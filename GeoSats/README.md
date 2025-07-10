# 🌍⚡ GEOSATS

**GEOSATS** is a decentralized bounty hunting platform powered by GPS, the Lightning Network (LN), Nostr protocol, and optionally enhanced by AI. It enables users to create real-world GPS-based bounties funded with Bitcoin (sats). Others can locate and claim these bounties by physically reaching the location, solving a puzzle, and receiving automated LN payouts.

---

## 🧠 Project Vision

> A small DApp where users post GPS-linked bounties with Bitcoin rewards on **Nostr**. Other users physically locate and solve optional AI-generated puzzles to **claim** rewards, which are paid out via **Lightning Network**.

---

## ⚙️ Tech Stack

| Layer        | Technology                          | Justification                                              |
|--------------|-------------------------------------|-------------------------------------------------------------|
| Frontend     | React + Vite                        | Fast dev environment, modular components, modern tooling    |
| Lightning    | Alby (WebLN)                        | Browser-ready, easiest dev wallet with `window.webln`       |
| Decentralized Events | Nostr + `nostr-tools`       | Open pub/sub event protocol to post/read bounties/claims   |
| Backend      | Node.js + Express (optional)        | Handles payout logic and server-side verification           |
| Map/GPS      | Leaflet.js + `navigator.geolocation`| Visual bounty discovery and real-world proximity checks     |
| Styling      | Tailwind CSS                        | Rapid, utility-first styling                                |
| AI (optional)| OpenAI (ChatGPT API)                | Generates & verifies puzzles for bounty challenges          |
