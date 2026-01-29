const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bgImg = null;
let audio = null;

document.getElementById("bgImage").addEventListener("change", e => {
  const img = new Image();
  img.src = URL.createObjectURL(e.target.files[0]);
  img.onload = () => bgImg = img;
});

document.getElementById("bgMusic").addEventListener("change", e => {
  audio = new Audio(URL.createObjectURL(e.target.files[0]));
});

function drawFrame() {
  const text = document.getElementById("textInput").value;
  const font = document.getElementById("fontSelect").value;
  const textColor = document.getElementById("textColor").value;
  const bgColor = document.getElementById("bgColor").value;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bgImg) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = textColor;
  ctx.font = `40px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2, 650);
}

document.getElementById("recordBtn").onclick = async () => {
  const duration = document.getElementById("duration").value * 1000;
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-video.webm";
    a.click();
  };

  recorder.start();
  if (audio) audio.play();

  const start = Date.now();
  const interval = setInterval(() => {
    drawFrame();
    if (Date.now() - start > duration) {
      clearInterval(interval);
      recorder.stop();
      if (audio) audio.pause();
    }
  }, 33);
};
