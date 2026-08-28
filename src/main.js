const launch = document.querySelector("#launch");
const boot = document.querySelector("#boot");
const dosNode = document.querySelector("#dos");
const fullscreen = document.querySelector("#fullscreen");
const multiplayer = document.querySelector("#multiplayer");
const playerCount = document.querySelector("#player-count");
const multiplayerGame = document.querySelector("#multiplayer-game");
const canvas = document.querySelector("#multiplayer-canvas");
const ctx = canvas.getContext("2d");
const keys = new Set();
let socket;
let animation;
let myId = "";
let players = [];
let me = { x: 0, y: -450, heading: 0, speed: 90, health: 100 };

let started = false;

launch.addEventListener("click", () => {
  if (started) return;
  started = true;
  launch.disabled = true;
  launch.textContent = "LOADING…";

  if (typeof window.Dos !== "function") {
    launch.disabled = false;
    launch.textContent = "RUNTIME UNAVAILABLE — RETRY";
    started = false;
    return;
  }

  boot.classList.add("departing");
  window.Dos(dosNode, {
    url: "/game/corncob-3d-3.42.jsdos",
    backend: "dosboxX",
    backendLocked: true,
    theme: "dark",
    autoStart: true,
    kiosk: true,
    mouseCapture: true,
  });
  window.setTimeout(() => boot.remove(), 650);
});

fullscreen.addEventListener("click", async () => {
  const machine = document.querySelector(".machine");
  if (!document.fullscreenElement) await machine.requestFullscreen();
  else await document.exitFullscreen();
});

async function refreshPopulation() {
  try { playerCount.textContent = (await (await fetch("/api/players")).json()).active; } catch { playerCount.textContent = "0"; }
}
refreshPopulation();
setInterval(refreshPopulation, 5000);

function resize() {
  canvas.width = Math.max(640, innerWidth);
  canvas.height = Math.max(360, innerHeight);
}
addEventListener("resize", resize);

function drawRunway(x, y, width = 70, height = 900) {
  ctx.fillStyle = "#50534b"; ctx.fillRect(x-width/2,y-height/2,width,height);
  ctx.strokeStyle = "#d9d7bd"; ctx.lineWidth=3; ctx.strokeRect(x-width/2+4,y-height/2,width-8,height);
  ctx.fillStyle="#eae6c6";
  for(let n=-height/2+35;n<height/2-20;n+=55) ctx.fillRect(x-2,y+n,4,28);
}
function drawPlane(p, mine=false) {
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(-p.heading);
  ctx.fillStyle=mine?"#ffd45b":"#aebc77"; ctx.strokeStyle="#171b12"; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(0,-14);ctx.lineTo(5,-2);ctx.lineTo(18,7);ctx.lineTo(5,6);ctx.lineTo(4,14);ctx.lineTo(-4,14);ctx.lineTo(-5,6);ctx.lineTo(-18,7);ctx.lineTo(-5,-2);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.rotate(p.heading);ctx.fillStyle="#fff";ctx.font="11px Share Tech Mono";ctx.textAlign="center";ctx.fillText(`${p.name||""} ${p.health}`,0,-21);ctx.restore();
}
function render(now) {
  const dt=Math.min(.04,(now-(render.last||now))/1000); render.last=now;
  if(keys.has("ArrowLeft")) me.heading-=1.8*dt;
  if(keys.has("ArrowRight")) me.heading+=1.8*dt;
  if(keys.has("ArrowUp")) me.speed=Math.min(220,me.speed+70*dt);
  if(keys.has("ArrowDown")) me.speed=Math.max(35,me.speed-70*dt);
  me.x+=Math.sin(me.heading)*me.speed*dt; me.y+=Math.cos(me.heading)*me.speed*dt;
  if(Math.abs(me.x)>1300) me.x=-Math.sign(me.x)*1300;
  if(Math.abs(me.y)>1800) me.y=-Math.sign(me.y)*1800;
  if(socket?.readyState===1 && now-(render.sent||0)>50){socket.send(JSON.stringify({type:"move",...me}));render.sent=now;}
  ctx.fillStyle="#719253";ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.save();ctx.translate(canvas.width/2-me.x,canvas.height/2-me.y);
  ctx.fillStyle="#567a40";for(let x=-1500;x<1500;x+=160)for(let y=-1900;y<1900;y+=170){ctx.beginPath();ctx.arc(x,y,28,0,7);ctx.fill()}
  for(const x of [-320,-160,0,160,320]) drawRunway(x,0);
  for(const p of players) drawPlane(p,p.id===myId);
  ctx.restore();
  ctx.strokeStyle="#ffe076";ctx.beginPath();ctx.moveTo(canvas.width/2-9,canvas.height/2);ctx.lineTo(canvas.width/2+9,canvas.height/2);ctx.moveTo(canvas.width/2,canvas.height/2-9);ctx.lineTo(canvas.width/2,canvas.height/2+9);ctx.stroke();
  animation=requestAnimationFrame(render);
}

function leaveMultiplayer(){socket?.close();cancelAnimationFrame(animation);multiplayerGame.hidden=true;refreshPopulation();}
multiplayer.addEventListener("click",()=>{
  multiplayerGame.hidden=false;resize();
  const scheme=location.protocol==="https:"?"wss":"ws"; socket=new WebSocket(`${scheme}://${location.host}/multiplayer`);
  socket.addEventListener("open",()=>socket.send(JSON.stringify({type:"join",name:document.querySelector("#pilot-name").value})));
  socket.addEventListener("message",({data})=>{const msg=JSON.parse(data);if(msg.type==="welcome")myId=msg.id;if(msg.type==="state"){players=msg.players;const mine=players.find(p=>p.id===myId);if(mine){me={x:mine.x,y:mine.y,heading:mine.heading,speed:mine.speed,health:mine.health};document.querySelector("#mp-name").textContent=mine.name;document.querySelector("#mp-health").textContent=mine.health;}document.querySelector("#mp-count").textContent=players.length;playerCount.textContent=players.length;}if(msg.type==="hit"){const feed=document.querySelector("#kill-feed");feed.textContent=`${msg.attacker} hit ${msg.victim}${msg.health===0?" — DOWN":""}`;setTimeout(()=>feed.textContent="",2500);}});
  render.last=0;animation=requestAnimationFrame(render);
});
document.querySelector("#leave-multiplayer").addEventListener("click",leaveMultiplayer);
addEventListener("keydown",event=>{if(multiplayerGame.hidden)return;if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space"].includes(event.code))event.preventDefault();keys.add(event.key);if(event.code==="Space"&&socket?.readyState===1)socket.send(JSON.stringify({type:"shoot"}));});
addEventListener("keyup",event=>keys.delete(event.key));
