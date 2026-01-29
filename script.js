const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bgImg = null;
let audio = null;

document.getElementById("bgImage").onchange = e => {
  bgImg = new Image();
  bgImg.src = URL.createObjectURL(e.target.files[0]);
};

document.getElementById("music").onchange = e => {
  audio = new Audio(URL.createObjectURL(e.target.files[0]));
};

function animateText(text, anim, t, x, y) {
  switch(anim) {
    case "fade":
      ctx.globalAlpha = Math.min(t/1000,1);
      ctx.fillText(text,x,y);
      ctx.globalAlpha = 1;
      break;

    case "slide":
      ctx.fillText(text,x-400+t*.4,y);
      break;

    case "zoom":
      ctx.save();
      ctx.translate(x,y);
      ctx.scale(Math.min(t/700,1),Math.min(t/700,1));
      ctx.fillText(text,0,0);
      ctx.restore();
      break;

    case "type":
      ctx.fillText(text.substring(0,Math.floor(t/80)),x,y);
      break;

    case "wave":
      [...text].forEach((c,i)=>{
        ctx.fillText(c,x-text.length*14+i*28,y+Math.sin(t/200+i)*20);
      });
      break;

    case "bounce":
      ctx.fillText(text,x,y+Math.sin(t/150)*30);
      break;

    case "rotate":
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(t/800);
      ctx.fillText(text,0,0);
      ctx.restore();
      break;

    case "shake":
      ctx.fillText(text,x+(Math.random()-0.5)*10,y+(Math.random()-0.5)*10);
      break;
  }
}

document.getElementById("export").onclick = () => {
  const duration = document.getElementById("duration").value * 1000;
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks,{type:"video/webm"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "text-video.webm";
    a.click();
  };

  recorder.start();
  if(audio) audio.play();

  const start = Date.now();
  const loop = setInterval(()=>{
    const t = Date.now()-start;

    ctx.fillStyle = document.getElementById("bgColor").value;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(bgImg) ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);

    ctx.fillStyle = document.getElementById("textColor").value;
    ctx.font = `${document.getElementById("fontSize").value}px ${document.getElementById("font").value}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if(document.getElementById("glow").checked){
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 20;
    } else ctx.shadowBlur = 0;

    animateText(
      document.getElementById("text").value,
      document.getElementById("animation").value,
      t,
      canvas.width/2,
      canvas.height/2
    );

    if(t>duration){
      clearInterval(loop);
      recorder.stop();
      if(audio) audio.pause();
    }
  },33);
};
