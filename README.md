# BLOCK CITY — Divine Voxel Engine foundation

## Live build status

- **Play in browser:** https://eliazcedno-dot.github.io/block-city/
- The GitHub Actions pipeline has successfully installed dependencies, passed `npm run build`, uploaded the Pages artifact, and reported a successful deployment.
- The published page has not yet had a manual browser gameplay smoke test. Treat DVE worker/world startup and in-game controls as implemented in the prototype but not yet runtime-verified.

A browser-game starter built around **Divine Voxel Engine (Vlox)** and its Babylon.js renderer.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Click the game to capture the mouse; Esc releases it.

## Controls

- **WASD** — walk / drive
- **Mouse** — look (click the game to capture; Esc releases)
- **Shift** — sprint
- **Space** — jump
- **E** — interact with the contact you're aiming at
- **Click the contact** — complete the contact mission when close enough
- **F** — enter or exit the red car when nearby

## Current milestone

- Vlox core + official Babylon.js renderer initialization using the upstream getting-started pattern
- Separate world, generator, and mesher workers
- Procedurally generated voxel ground with small pixel texture inputs
- First-person mouse look implemented with pointer lock; no visible player mesh
- Delta-time movement, sprint, jump, and simple building collision
- Clickable/ray-pickable mission contact and a one-time $250 reward
- Time-based arcade car acceleration, braking, steering, collision response, enter/exit, and chase camera
- Block-built city buildings, road, sidewalks, and road markings

## Scope notes

This remains an early playable-core prototype, not a finished GTA/Minecraft-scale game. The buildings/road are Babylon meshes while the ground is Vlox voxel terrain. Collision is a lightweight static-building approximation, not a full physics engine. Missions are local client-side interactions. There is no online multiplayer, persistence, combat system, traffic AI, or full vehicle physics yet.

## Engine references

- https://github.com/Divine-Star-Software/DivineVoxelEngine
- https://github.com/Divine-Star-Software/DivineVoxelEngine/blob/main/GETTING_STARTED.md

The engine is MIT licensed. Check upstream licensing and package versions before redistributing a release.
