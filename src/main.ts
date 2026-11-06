import { Engine, Scene, UniversalCamera, Vector3, HemisphericLight, DirectionalLight, MeshBuilder, StandardMaterial, Color3, Color4, PointerEventTypes, AbstractMesh } from '@babylonjs/core';
import InitDVErenderer from '@divinevoxel/vlox-babylon/Init/Classic/InitDVEBRClassic';
import { StartRenderer } from '@divinevoxel/vlox/Init/StartRenderer';
import type { TextureData } from '@divinevoxel/vlox/Textures/Texture.types';
import type { VoxelData } from '@divinevoxel/vlox/Voxels';
import './style.css';

const canvas=document.querySelector<HTMLCanvasElement>('#game')!;
const engine=new Engine(canvas,true,{stencil:true,antialias:true});
const scene=new Scene(engine); scene.clearColor=new Color4(.48,.72,.92,1);
const camera=new UniversalCamera('fps',new Vector3(0,62.65,-2),scene);
camera.minZ=.08; camera.fov=1.05; camera.inertia=0; camera.inputs.clear(); scene.activeCamera=camera;
new HemisphericLight('sky',new Vector3(0,1,0),scene).intensity=.82;
new DirectionalLight('sun',new Vector3(-.5,-1,.35),scene).intensity=.75;

const textures:TextureData[]=[
 {id:'bc_grass',path:`${import.meta.env.BASE_URL}assets/textures/grass.png`},
 {id:'bc_dirt',path:`${import.meta.env.BASE_URL}assets/textures/dirt.png`},
 {id:'bc_stone',path:`${import.meta.env.BASE_URL}assets/textures/stone.png`}
];
const voxel=(id:string):VoxelData=>({id,properties:{dve_substance:'dve_solid',dve_collider_id:'dve_cube',dve_check_collisions:true,dve_model_data:{id:'dve_simple_cube',modSchema:[],modRelationSchema:[],inputs:{'*':{texture:id}}}}});
async function boot(){
 const worldWorker=new Worker(new URL('./Contexts/World/index.ts',import.meta.url),{type:'module'});
 const count=Math.max(1,Math.min(3,Math.ceil(((navigator.hardwareConcurrency||4)-2)/2)));
 const mesherWorkers=Array.from({length:count},()=>new Worker(new URL('./Contexts/Mesher/index.ts',import.meta.url),{type:'module'}));
 const generatorWorkers=Array.from({length:count},()=>new Worker(new URL('./Contexts/Generator/index.ts',import.meta.url),{type:'module'}));
 const renderer=await InitDVErenderer({textureTypes:[],substances:[],scene,textureData:textures});
 const DVER=await StartRenderer({renderer,worldWorker,mesherWorkers,generatorWorkers,voxels:[voxel('bc_grass'),voxel('bc_dirt'),voxel('bc_stone')],memoryAndCPU:{useSharedMemory:false}});
 DVER.threads.world.runTask('start-world',[]);
}
const mat=(name:string,c:Color3)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=c;return m};
const concrete=mat('concrete',new Color3(.28,.31,.34)),glass=mat('glass',new Color3(.13,.38,.48)),skin=mat('skin',new Color3(.72,.48,.31)),shirt=mat('shirt',new Color3(.12,.3,.78)),red=mat('car-red',new Color3(.72,.08,.055)),tire=mat('rubber',new Color3(.035,.04,.045)),gold=mat('gold',new Color3(1,.67,.08));
type Bounds={minX:number;maxX:number;minZ:number;maxZ:number}; const bounds:Bounds[]=[];
function building(x:number,z:number,w:number,d:number,h:number){
 const y=61,body=MeshBuilder.CreateBox('building',{width:w,height:h,depth:d},scene);body.position.set(x,y+h/2,z);body.material=concrete;body.isPickable=false;
 bounds.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 for(let yy=1;yy<h-1;yy+=2)for(let xx=-w/2+1;xx<w/2;xx+=2){const win=MeshBuilder.CreateBox('window',{width:.85,height:.9,depth:.04},scene);win.position.set(x+xx,y+yy,z-d/2-.025);win.material=glass;win.isPickable=false}
 const roof=MeshBuilder.CreateBox('roof',{width:w+.2,height:.35,depth:d+.2},scene);roof.position.set(x,y+h+.16,z);roof.material=concrete;roof.isPickable=false;
}
building(15,10,10,10,12);building(-16,14,12,9,17);building(18,-18,9,12,9);building(-18,-18,10,10,13);
const road=MeshBuilder.CreateBox('road',{width:15,height:.08,depth:100},scene);road.position.set(0,61.04,0);road.material=mat('asphalt',new Color3(.12,.14,.16));road.isPickable=false;
for(const x of [-8.3,8.3]){const w=MeshBuilder.CreateBox('sidewalk',{width:1.5,height:.16,depth:100},scene);w.position.set(x,61.08,0);w.material=mat('walk',new Color3(.48,.5,.48));w.isPickable=false}
for(let z=-42;z<=42;z+=8){const s=MeshBuilder.CreateBox('lane-mark',{width:.22,height:.025,depth:3},scene);s.position.set(0,61.09,z);s.material=gold;s.isPickable=false}
const npc=MeshBuilder.CreateBox('contact',{width:.8,height:1.8,depth:.65},scene);npc.position.set(4,61.9,-8);npc.isVisible=false;npc.metadata={kind:'contact'};
const body=MeshBuilder.CreateBox('contact-shirt',{width:.72,height:1,depth:.5},scene);body.position.set(4,61.5,-8);body.material=shirt;body.metadata={kind:'contact'};
const head=MeshBuilder.CreateBox('contact-head',{size:.52},scene);head.position.set(4,62.25,-8);head.material=skin;head.metadata={kind:'contact'};
const marker=MeshBuilder.CreateCylinder('marker',{height:.12,diameter:1.2,tessellation:8},scene);marker.position.set(4,63.35,-8);marker.material=gold;marker.isPickable=false;
const car=MeshBuilder.CreateBox('car',{width:2.2,height:.75,depth:4.2},scene);car.position.set(0,61.5,-14);car.material=red;
const cabin=MeshBuilder.CreateBox('cabin',{width:1.65,height:.85,depth:2.1},scene);cabin.position.set(0,.72,-.15);cabin.parent=car;cabin.material=glass;
for(const x of [-1,1])for(const z of [-1.35,1.35]){const w=MeshBuilder.CreateBox('wheel',{width:.35,height:.7,depth:.8},scene);w.position.set(x*1.08,-.18,z);w.parent=car;w.material=tire}
const objective=document.querySelector<HTMLElement>('#objective')!,toast=document.querySelector<HTMLElement>('#toast')!;
let timer=0;function notify(s:string){toast.textContent=s;toast.classList.add('show');clearTimeout(timer);timer=window.setTimeout(()=>toast.classList.remove('show'),2400)}
let done=false,inCar=false,yaw=0,pitch=0,vy=0,ground=true,speed=0;const keys=new Set<string>();
const collides=(x:number,z:number,rx:number,rz:number)=>bounds.some(b=>x+rx>b.minX&&x-rx<b.maxX&&z+rz>b.minZ&&z-rz<b.maxZ);
function move(p:Vector3,dx:number,dz:number,rx:number,rz:number){if(!collides(p.x+dx,p.z,rx,rz))p.x+=dx;if(!collides(p.x,p.z+dz,rx,rz))p.z+=dz}
function mission(){if(!done){done=true;objective.textContent='MISSION COMPLETE — FIRST CONTACT';marker.dispose();notify('CONTACT: Reward $250 — take the red car for a drive.')}else notify('CONTACT: The garage is down the block.')}
function interact(){if(inCar)return;const ray=scene.createPickingRay(canvas.width/2,canvas.height/2,null,camera);const hit=scene.pickWithRay(ray,(m:AbstractMesh)=>m.metadata?.kind==='contact');if(hit?.hit&&(hit.distance??Infinity)<=6)mission();else notify('Aim at the gold contact within 6 blocks and press E.')}
function toggleCar(){if(inCar){inCar=false;speed=0;camera.position.copyFrom(car.position.add(new Vector3(Math.cos(yaw),0,-Math.sin(yaw)).scale(2.4)));camera.position.y=62.65;yaw=car.rotation.y;camera.rotation.set(pitch,yaw,0);notify('Exited vehicle')}else if(Vector3.Distance(camera.position,car.position)<=4.5){inCar=true;speed=0;notify('Vehicle entered — WASD drive · F exit')}else notify('Move closer to the red car to enter it.')}
canvas.addEventListener('click',()=>{if(!document.pointerLockElement)void canvas.requestPointerLock()});
document.addEventListener('mousemove',e=>{if(!document.pointerLockElement||inCar)return;yaw+=e.movementX*.0022;pitch=Math.max(-1.48,Math.min(1.48,pitch-e.movementY*.0022));camera.rotation.set(pitch,yaw,0)});
window.addEventListener('keydown',e=>{keys.add(e.code);if(['KeyW','KeyA','KeyS','KeyD','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&!e.repeat)interact();if(e.code==='KeyF'&&!e.repeat)toggleCar()});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
scene.onPointerObservable.add((i:any)=>{const m=i.pickInfo?.pickedMesh as AbstractMesh|null;if(i.type===PointerEventTypes.POINTERDOWN&&i.pickInfo?.hit&&m?.metadata?.kind==='contact'&&(i.pickInfo.distance??99)<=6)mission()});
scene.onBeforeRenderObservable.add(()=>{const dt=Math.min(engine.getDeltaTime()/1000,.05),f=Number(keys.has('KeyW'))-Number(keys.has('KeyS')),s=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));
 if(inCar){const throttle=f,steer=Number(keys.has('KeyA'))-Number(keys.has('KeyD'));if(throttle>0)speed=Math.min(11,speed+8*dt);else if(throttle<0)speed=Math.max(-4.5,speed-9*dt);else speed=Math.abs(speed)<.08?0:speed-Math.sign(speed)*Math.min(Math.abs(speed),3.2*dt);
 const grip=Math.min(1,Math.abs(speed)/2.2),heading=car.rotation.y+steer*1.7*grip*dt*Math.sign(speed||1),next=car.position.clone();move(next,Math.sin(heading)*speed*dt,Math.cos(heading)*speed*dt,1.15,2.15);
 if(next.x!==car.position.x||next.z!==car.position.z){car.position.x=next.x;car.position.z=next.z;car.rotation.y=heading}else speed*= -.12;
 camera.position.copyFrom(car.position.add(new Vector3(-Math.sin(car.rotation.y)*5.2,2.7,-Math.cos(car.rotation.y)*5.2)));camera.setTarget(car.position.add(new Vector3(0,.8,0)));yaw=car.rotation.y;
 }else{const forward=new Vector3(Math.sin(yaw),0,Math.cos(yaw)),right=new Vector3(Math.cos(yaw),0,-Math.sin(yaw));let v=forward.scale(f).add(right.scale(s));if(v.lengthSquared()>1)v.normalize();const speedWalk=keys.has('ShiftLeft')?7:4.4;move(camera.position,v.x*speedWalk*dt,v.z*speedWalk*dt,.34,.34);
 if(keys.has('Space')&&ground){vy=5.5;ground=false}vy-=16*dt;camera.position.y+=vy*dt;if(camera.position.y<=62.65){camera.position.y=62.65;vy=0;ground=true}camera.rotation.set(pitch,yaw,0)}
});
engine.runRenderLoop(()=>scene.render());window.addEventListener('resize',()=>engine.resize());boot().catch(e=>{console.error(e);notify('Voxel engine failed to start. Check console.')});
