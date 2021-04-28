const Audioviz = require("..");
const path = require("path");

var audioviz = new Audioviz({
  audio: path.join(__dirname, "blob.mp3"),
  output: "video1.mp4",
  samplesPerFrame: 64,
  backgroundColor: "#DAF7A6",
  pattern: "line",
  waveColor: "#9B480B",
});

(async () => {
  const output = await audioviz.render();
  console.log(output);
})();
