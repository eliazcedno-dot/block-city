import { StartWorld } from '@divinevoxel/vlox/Init/StartWorld';
import { WorldSimulation } from '@divinevoxel/vlox/WorldSimulation';
import { TickInterval } from '@divinevoxel/vlox/Util/TickInterval';
import { Threads } from '@amodx/threads';
const DVEW = await StartWorld();
WorldSimulation.init({ parent: DVEW.threads.parent, meshers: DVEW.threads.meshers, generators: DVEW.threads.generators });
const ticker = new TickInterval(() => WorldSimulation.tick(), 50);
Threads.registerTask('start-world', async () => {
  const position = { x: 0, y: 0, z: 0 };
  WorldSimulation.doTickUpdates = false;
  await WorldSimulation.Procedures.InitalLoad({ genData: { position, renderRadius: 96, generationRadius: 144, maxRadius: 176 } });
  const generator = WorldSimulation.createGenerator({ position, renderRadius: 96, generationRadius: 144, maxRadius: 176 });
  WorldSimulation.addGenerator(generator);
  ticker.start();
});
