import assert from 'node:assert/strict';
import test from 'node:test';
import { getVehicleSteeringInput } from './vehicle-controls.js';

test('A steers left (negative heading) while moving forward', () => {
  assert.equal(getVehicleSteeringInput(new Set(['KeyA'])), -1);
});

test('D steers right (positive heading) while moving forward', () => {
  assert.equal(getVehicleSteeringInput(new Set(['KeyD'])), 1);
});

test('opposing steering keys cancel', () => {
  assert.equal(getVehicleSteeringInput(new Set(['KeyA', 'KeyD'])), 0);
});

test('no steering keys produce neutral input', () => {
  assert.equal(getVehicleSteeringInput(new Set()), 0);
});
