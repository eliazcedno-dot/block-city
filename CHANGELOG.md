## 2026-11-26 — Correct arcade steering controls

- Fixed the vehicle's reversed A/D steering: A now turns left and D turns right when driving forward, with reverse motion retaining the expected steering response.
- Extracted keyboard-to-steering conversion into a small dependency-free gameplay helper.
- Added four Node.js regression tests and made GitHub Actions run them before the TypeScript/Vite build.

**Verification:** the four steering regression tests passed locally with Node.js. The GitHub Actions build/deploy triggered by this commit still needs to complete; no browser gameplay test was run in this environment.

## 2026-11-12 — Reliable NPC picking

- Changed the contact hitbox from `isVisible = false` (excluded by Babylon's normal scene picking) to `visibility = 0` with `isVisible = true` and `isPickable = true`, so it stays invisible while remaining clickable.
- Switched the E-key interaction to Babylon's camera-forward ray, avoiding drawing-buffer-size assumptions when aiming from the center of the screen.
- Prevented pointer clicks from completing the contact while seated in the vehicle.

**Verification:** checked the worker startup pattern against the upstream Vlox Getting Started guide and confirmed the hitbox visibility/picking behavior against Babylon.js picking documentation. The container cannot resolve `github.com`, so no local dependency install/build or browser smoke test was possible. The previously successful Actions run predates this change; the new run still needs confirmation.

# Change log

## 2026-11-19 — Safer vehicle exits

- Vehicle exit now checks four positions around the car (left/right and front/rear) against building collision bounds before moving the camera.
- If every exit position is blocked, the player stays in the car and receives a clear message rather than being placed inside a building.
- Exiting restores first-person camera position and the car's heading.

**Verification:** exit-position logic reviewed and source-level scenario checks run; no local npm build or browser gameplay test was possible because this environment cannot resolve GitHub. CI for this commit is not yet confirmed.

## 2026-11-05 — Build repair

- Fixed the texture registry type to match the current Vlox API (`TextureData[]`).
- Fixed voxel helper typing to use the current `VoxelData` interface.
- Added Vite client type declarations for CSS imports and `import.meta.env`.
- Passed `null` for Babylon's nullable picking-ray world matrix instead of `undefined`.
- Pinned Vlox and its Babylon renderer to upstream package versions 0.0.86 / 0.0.65 and aligned Babylon.js with the upstream 9.15 line.


## Core controls and vehicle pass

- Added custom pointer-lock mouse look; the camera no longer depends on Babylon's default camera input stack.
- Added delta-time first-person movement, sprinting, jumping, and simple static building collision.
- Made the mission contact clickable through its visible meshes and kept E/ray interaction as a fallback.
- Reworked car acceleration, braking, steering, and drag to use seconds rather than frame-count multipliers.
- Added simple building collision response for the car and a chase camera; exiting the car restores the first-person look direction.
- Added a blocky asphalt road, sidewalks, and road markings.
- Updated controls and scope notes in README.

## Verification

- Reviewed the DVE worker/renderer initialization against the current upstream Getting Started guide.
- TypeScript compiler was invoked, but a full compile could not complete because npm dependency installation timed out and the project dependencies are not present. The compiler therefore reports unresolved Babylon/DVE modules. No browser gameplay test was possible in this environment.
