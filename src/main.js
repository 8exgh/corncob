const launch = document.querySelector("#launch");
const boot = document.querySelector("#boot");
const dosNode = document.querySelector("#dos");
const fullscreen = document.querySelector("#fullscreen");

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
