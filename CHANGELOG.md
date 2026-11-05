# Change log

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
