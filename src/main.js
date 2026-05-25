import "@xterm/xterm/css/xterm.css";
import "./styles.css";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/plugin-dialog";

const terminalElement = document.getElementById("terminal");
const mediaLayer = document.getElementById("mediaLayer");
const pickMediaButton = document.getElementById("pickMedia");
const shuffleMediaButton = document.getElementById("shuffleMedia");
const dimInput = document.getElementById("dim");
const blurInput = document.getElementById("blur");
const minimizeWindowButton = document.getElementById("minimizeWindow");
const toggleMaximizeWindowButton = document.getElementById("toggleMaximizeWindow");
const closeWindowButton = document.getElementById("closeWindow");
const dragHandles = document.querySelectorAll(".drag-handle");
const appWindow = getCurrentWindow();

const defaultPlaylist = [
  new URL("./assets/media/vending-stigmata-loop-01.mp4", import.meta.url).href,
  new URL("./assets/media/vending-stigmata-loop-02.mp4", import.meta.url).href,
  new URL("./assets/media/vending-stigmata-loop-03.mp4", import.meta.url).href,
  new URL("./assets/media/vending-stigmata-loop-04.mp4", import.meta.url).href,
  new URL("./assets/media/vending-stigmata-loop-05.mp4", import.meta.url).href,
];

let playlist = [...defaultPlaylist];
let previousVideoIndex = -1;
let activeVideo = null;
let standbyVideo = null;
let fadeTimer = null;

const terminal = new Terminal({
  allowTransparency: true,
  cursorBlink: true,
  fontFamily: '"Cascadia Mono", "JetBrains Mono", Consolas, monospace',
  fontSize: 14,
  lineHeight: 1.18,
  letterSpacing: 0,
  theme: {
    background: "#07101466",
    foreground: "#dff7f2",
    cursor: "#ffe56f",
    selectionBackground: "#93e7ff44",
    red: "#ff6b7a",
    green: "#81f7a5",
    yellow: "#ffe56f",
    blue: "#7bc7ff",
    magenta: "#ff93df",
    cyan: "#69f0ff",
    white: "#e9fbff",
    brightBlack: "#56707a",
  },
});

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.loadAddon(new WebLinksAddon());
terminal.open(terminalElement);
fitAddon.fit();
terminal.write("\x1b[90mStarting Vignette Terminal...\x1b[0m\r\n");
terminal.focus();

function terminalSize() {
  return { cols: terminal.cols, rows: terminal.rows };
}

function resizeTerminal() {
  fitAddon.fit();
  invoke("resize_terminal", { size: terminalSize() }).catch(() => {});
}

window.addEventListener("resize", resizeTerminal);
new ResizeObserver(resizeTerminal).observe(terminalElement);

await listen("terminal-data", (event) => terminal.write(event.payload));
terminal.onData((data) =>
  invoke("write_terminal", { data }).catch((error) => {
    terminal.write(`\r\n\x1b[31mwrite_terminal failed: ${String(error)}\x1b[0m\r\n`);
  }),
);
invoke("start_terminal", { size: terminalSize() })
  .then(() => terminal.write("\x1b[90mPTY connected.\x1b[0m\r\n"))
  .catch((error) => {
    terminal.write(`\x1b[31mstart_terminal failed: ${String(error)}\x1b[0m\r\n`);
  });

function updateBackdropControls() {
  document.documentElement.style.setProperty("--backdrop-dim", `${Number(dimInput.value) / 100}`);
  document.documentElement.style.setProperty("--backdrop-blur", `${blurInput.value}px`);
}

dimInput.addEventListener("input", updateBackdropControls);
blurInput.addEventListener("input", updateBackdropControls);
updateBackdropControls();

function mediaUrl(filePath) {
  if (String(filePath).startsWith("http") || String(filePath).startsWith("asset:")) {
    return filePath;
  }
  return convertFileSrc(filePath);
}

function randomVideoPath() {
  if (playlist.length === 0) return null;
  if (playlist.length === 1) return playlist[0];

  let nextIndex = Math.floor(Math.random() * playlist.length);
  while (nextIndex === previousVideoIndex) {
    nextIndex = Math.floor(Math.random() * playlist.length);
  }
  previousVideoIndex = nextIndex;
  return playlist[nextIndex];
}

function createBackgroundVideo(filePath, isActive = false) {
  const video = document.createElement("video");
  video.className = `media media-video${isActive ? " is-active" : ""}`;
  video.src = mediaUrl(filePath);
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.loop = false;
  video.addEventListener("error", () => {
    terminal.write(`\r\n\x1b[31mbackground video failed: ${filePath}\x1b[0m\r\n`);
  });
  video.addEventListener("timeupdate", () => {
    if (video !== activeVideo || fadeTimer) return;
    if (Number.isFinite(video.duration) && video.duration > 0 && video.duration - video.currentTime < 1.25) {
      queueNextRandomVideo();
    }
  });
  video.addEventListener("ended", () => {
    if (video === activeVideo) queueNextRandomVideo();
  });
  return video;
}

function queueNextRandomVideo() {
  const filePath = randomVideoPath();
  if (!filePath) return;

  const nextVideo = createBackgroundVideo(filePath);
  mediaLayer.appendChild(nextVideo);
  standbyVideo = nextVideo;

  const startFade = () => {
    if (standbyVideo !== nextVideo) return;
    nextVideo.play().catch(() => {});
    nextVideo.classList.add("is-active");
    activeVideo?.classList.remove("is-active");

    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      activeVideo?.remove();
      activeVideo = nextVideo;
      standbyVideo = null;
      fadeTimer = null;
    }, 1200);
  };

  nextVideo.addEventListener("canplay", startFade, { once: true });
  nextVideo.load();
}

function startRandomPlaylist(paths = defaultPlaylist) {
  playlist = paths.length > 0 ? [...paths] : [...defaultPlaylist];
  previousVideoIndex = -1;
  clearTimeout(fadeTimer);
  fadeTimer = null;
  const firstPath = randomVideoPath();
  if (!firstPath) return;

  activeVideo = createBackgroundVideo(firstPath, true);
  standbyVideo = null;
  mediaLayer.replaceChildren(activeVideo);
  activeVideo.play().catch(() => {});
}

dragHandles.forEach((handle) => {
  handle.addEventListener("mousedown", (event) => {
    if (event.button !== 0 || event.detail > 1) return;
    event.preventDefault();
    appWindow.startDragging().catch(() => {});
  });

  handle.addEventListener("dblclick", (event) => {
    event.preventDefault();
    appWindow.toggleMaximize();
  });
});

minimizeWindowButton.addEventListener("click", () => appWindow.minimize());
toggleMaximizeWindowButton.addEventListener("click", () => appWindow.toggleMaximize());
closeWindowButton.addEventListener("click", () => appWindow.close());
shuffleMediaButton.addEventListener("click", () => startRandomPlaylist());

pickMediaButton.addEventListener("click", async () => {
  const filePath = await open({
    multiple: true,
    filters: [{ name: "Media", extensions: ["png", "jpg", "jpeg", "webp", "gif", "mp4", "webm", "mov"] }],
  });
  if (!filePath) return;

  const paths = Array.isArray(filePath) ? filePath : [filePath];
  const videoPaths = paths.filter((path) => ["mp4", "webm", "mov"].includes(String(path).split(".").pop()?.toLowerCase()));
  if (videoPaths.length > 1) {
    startRandomPlaylist(videoPaths);
    return;
  }

  const selectedPath = paths[0];
  const extension = String(selectedPath).split(".").pop()?.toLowerCase();
  const isVideo = ["mp4", "webm", "mov"].includes(extension);
  const element = document.createElement(isVideo ? "video" : "img");
  element.className = "media";
  element.src = mediaUrl(selectedPath);

  if (isVideo) {
    element.autoplay = true;
    element.muted = true;
    element.playsInline = true;
    element.loop = true;
  }

  clearTimeout(fadeTimer);
  activeVideo = isVideo ? element : null;
  standbyVideo = null;
  mediaLayer.replaceChildren(element);
});

startRandomPlaylist();
