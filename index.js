var probe = require("./lib/probe.js"),
  rimraf = require("rimraf"),
  { nanoid } = require("nanoid"),
  queue = require("d3").queue,
  mkdirp = require("mkdirp"),
  getWaveform = require("./waveform.js"),
  fs = require("fs"),
  initializeCanvas = require("./init-canvas.js"),
  drawFrames = require("./renderer/draw-frames.js"),
  path = require("path"),
  combineFrames = require("./renderer/combine-frames.js");
//   trimAudio = require("./trim.js");

let defaultOptions = {
  width: 1280,
  height: 720,
  framesPerSecond: 20,
  maxDuration: 300,
  samplesPerFrame: 64,
  pattern: "bars",
  waveTop: 150,
  waveBottom: 420,
  foregroundColor: "#d84a4a",
  name: "Bars",
  backgroundColor: "#fff",
  waveColor: "#d84a4a",
  captionColor: "#d84a4a",
  waveLeft: 0,
  waveRight: 1280,
};

function Audioviz(options) {
  // Unique audiogram ID
  this.id = nanoid();

  // File locations to use
  this.dir = path.join(process.cwd(), this.id);

  this.audioPath = options.audio;
  this.videoPath = path.join(this.dir, options.output);
  this.frameDir = path.join(this.dir, "frames");

  defaultOptions = { ...defaultOptions, ...options };
  return this;
}

Audioviz.prototype.render = async function () {
  try {
    var self = this,
      q = queue(1);

    //   this.status("audio-download");

    // Set up tmp directory
    q.defer(mkdirp, this.frameDir);

    // If the audio needs to be clipped, clip it first and update the path
    //   if (this.settings.start || this.settings.end) {
    //     q.defer(
    //       this.trimAudio.bind(this),
    //       this.settings.start || 0,
    //       this.settings.end || null
    //     );
    //   }

    // Get the audio waveform data
    q.defer(this.getWaveform.bind(this));

    // Draw all the frames
    q.defer(this.drawFrames.bind(this));

    // Combine audio and frames together with ffmpeg
    q.defer(this.combineFrames.bind(this));

    // Delete working directory
    q.defer(rimraf, this.frameDir);

    // Final callback, results in a URL where the finished video is accessible
    const res = await this.awaitQueue(q);
    return res;
  } catch (err) {
    throw err;
  }
};

Audioviz.prototype.awaitQueue = function (q) {
  return new Promise((resolve, reject) => {
    const _that = this;
    q.await(function (err) {
      if (err) {
        return reject(err);
      }

      return resolve({
        output: _that.videoPath,
      });
    });
  });
};

Audioviz.prototype.getWaveform = function (cb) {
  var self = this;

  probe(this.audioPath, function (err, data) {
    if (err) {
      return cb(err);
    }

    self.numFrames = Math.floor(data.duration * defaultOptions.framesPerSecond);

    getWaveform(
      self.audioPath,
      {
        numFrames: self.numFrames,
        samplesPerFrame: defaultOptions.samplesPerFrame,
        channels: data.channels,
      },
      function (waveformErr, waveform) {
        return cb(waveformErr, (self.waveform = waveform));
      }
    );
  });
};

Audioviz.prototype.drawFrames = function (cb) {
  var self = this;

  initializeCanvas(defaultOptions, function (err, renderer) {
    if (err) {
      return cb(err);
    }

    drawFrames(
      renderer,
      {
        width: defaultOptions.width,
        height: defaultOptions.height,
        numFrames: self.numFrames,
        frameDir: self.frameDir,
        caption: "",
        waveform: self.waveform,
        tick: function (buffer, framePath, frameNumber) {
          if (defaultOptions.frameProcessor) {
            defaultOptions.frameProcessor(buffer, framePath, frameNumber);
          }
        },
      },
      cb
    );
  });
};

Audioviz.prototype.combineFrames = function (cb) {
  var self = this;
  combineFrames(
    {
      framePath: path.join(this.frameDir, "%06d.png"),
      audioPath: this.audioPath,
      videoPath: this.videoPath,
      framesPerSecond: defaultOptions.framesPerSecond,
    },
    cb
  );
};

Audioviz.prototype.totalFrames = function () {
  return self.numFrames;
};

module.exports = Audioviz;
