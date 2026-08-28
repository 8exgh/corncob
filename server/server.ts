import { createServer } from "node:http";
import { existsSync, createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { WebSocketServer, WebSocket } from "ws";

type Pilot = { id:string; name:string; x:number; y:number; heading:number; speed:number; health:number; lastShot:number };
const pilots = new Map<WebSocket, Pilot>();
const publicPilot = ({lastShot, ...pilot}: Pilot) => pilot;
const broadcast = (message: unknown) => { const data=JSON.stringify(message); for(const ws of pilots.keys()) if(ws.readyState===ws.OPEN) ws.send(data); };
const snapshot = () => broadcast({type:"state", players:[...pilots.values()].map(publicPilot)});
const cleanName = (value: unknown, id:string) => typeof value === "string" && value.trim() ? value.trim().replace(/[^a-z0-9 _-]/gi, "").slice(0,16) || `Pilot-${id.slice(0,4)}` : `Pilot-${id.slice(0,4)}`;

const server=createServer((req,res)=>{
  if(req.url==="/api/players") { res.setHeader("content-type","application/json"); res.end(JSON.stringify({active:pilots.size})); return; }
  const root=join(process.cwd(),"dist"); let path=normalize(join(root, decodeURIComponent((req.url||"/").split("?")[0])));
  if(!path.startsWith(root)) { res.writeHead(403).end(); return; }
  if(path.endsWith("/")) path=join(path,"index.html");
  if(!existsSync(path) || statSync(path).isDirectory()) path=join(root,"index.html");
  if(!existsSync(path)) { res.writeHead(404).end("Run npm run build first"); return; }
  const mime:Record<string,string>={".html":"text/html",".js":"text/javascript",".css":"text/css",".wasm":"application/wasm",".jsdos":"application/zip",".png":"image/png"};
  res.setHeader("content-type",mime[extname(path)]||"application/octet-stream");
  if(path.includes("/game/")||path.includes("/jsdos/")) res.setHeader("cache-control","public, max-age=31536000, immutable");
  createReadStream(path).pipe(res);
});
const wss=new WebSocketServer({server,path:"/multiplayer"});
wss.on("connection",ws=>{
  const id=Math.random().toString(36).slice(2,10);
  const pilot:Pilot={id,name:`Pilot-${id.slice(0,4)}`,x:(Math.random()-.5)*400,y:Math.random()*900-450,heading:0,speed:90,health:100,lastShot:0};
  pilots.set(ws,pilot); ws.send(JSON.stringify({type:"welcome",id})); snapshot();
  ws.on("message",raw=>{ let msg:any; try{msg=JSON.parse(raw.toString())}catch{return}
    if(msg.type==="join") pilot.name=cleanName(msg.name,id);
    if(msg.type==="move") { for(const k of ["x","y","heading","speed"] as const) if(Number.isFinite(msg[k])) pilot[k]=Number(msg[k]); }
    if(msg.type==="shoot" && Date.now()-pilot.lastShot>250) {
      pilot.lastShot=Date.now(); let victim:Pilot|undefined; let best=120;
      for(const other of pilots.values()){ if(other===pilot||other.health<=0) continue; const dx=other.x-pilot.x,dy=other.y-pilot.y; const along=dx*Math.sin(pilot.heading)+dy*Math.cos(pilot.heading); const across=Math.abs(dx*Math.cos(pilot.heading)-dy*Math.sin(pilot.heading)); if(along>0&&along<700&&across<best){best=across;victim=other} }
      if(victim){victim.health=Math.max(0,victim.health-25); broadcast({type:"hit",attacker:pilot.name,victim:victim.name,health:victim.health}); if(!victim.health){victim.health=100;victim.x=(Math.random()-.5)*400;victim.y=-450;}}
    }
    snapshot();
  });
  ws.on("close",()=>{pilots.delete(ws);snapshot()});
});
setInterval(snapshot,100);
server.listen(Number(process.env.PORT)||3057,()=>console.log(`Corncob server listening on ${Number(process.env.PORT)||3057}`));
