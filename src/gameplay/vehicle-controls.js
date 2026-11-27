/**
 * Convert held keyboard keys to steering direction.
 * With the vehicle facing +Z, negative turns left and positive turns right.
 */
export function getVehicleSteeringInput(keys) {
  return Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
}
