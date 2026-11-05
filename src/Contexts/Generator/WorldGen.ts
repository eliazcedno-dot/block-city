import { WorldGeneration } from '@divinevoxel/vlox/Tasks/WorldGeneration/WorldGeneration';
import type { WorldGenInterface } from '@divinevoxel/vlox/Tasks/WorldGeneration/WorldGen.types';
import { WorldGenBrush } from '@divinevoxel/vlox/Tasks/WorldGeneration/WorldGenBrush';
import { WorldSpaces } from '@divinevoxel/vlox/World/WorldSpaces';
export class WorldGen implements WorldGenInterface {
  brush!: WorldGenBrush;
  init() { this.brush = WorldGeneration.getBrush(); }
  async generate(dimension:number,cx:number,y:number,cz:number) {
    const b=this.brush; b.start(dimension,cx,y,cz);
    const w=WorldSpaces.section.bounds.x, d=WorldSpaces.section.bounds.z;
    // Raised green grass base with a stone foundation. This is the first terrain pass;
    // roads, sidewalks, buildings and props are added as the city generator evolves.
    for(let x=cx;x<cx+w;x++) for(let z=cz;z<cz+d;z++) {
      b.setId('bc_grass'); b.setXYZ(x,60+y,z)!.paint();
      b.setId('bc_dirt'); b.setXYZ(x,59+y,z)!.paint();
      b.setId('bc_stone'); b.setXYZ(x,58+y,z)!.paint();
    }
    b.stop();
  }
  async decorate(_dimension:number,_cx:number,_y:number,_cz:number) {}
}
