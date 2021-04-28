**Audioviz** is a tool and framework for converting your audios into visualizer using Node.js and ffmpeg. Audioviz allows you to easily and **programmatically create a video** from your **audio**.

Inspired by [audiogram](https://github.com/nypublicradio/audiogram). **Audioviz** aims to be very extensible and feature rich with a it's **options**

## Features

- Convert audio into videos with code! 🤓
- Declarative API with fun defaults
- Create colorful videos by setting backgrounds

See [example](https://github.com/maddygoround/audioviz/blob/main/example/sample.js)

## Requirements

- Windows, MacOS or Linux
- [Node.js installed](https://nodejs.org/en/) (Use of the latest LTS version is recommended, [v12.16.2 or newer on MacOS](https://github.com/sindresorhus/meow/issues/144).)
- `ffmpeg` (and `ffprobe`) [installed](http://ffmpeg.org/) and available in `PATH`
- (Linux) may require some extra steps. See [headless-gl](https://github.com/stackgl/headless-gl#system-dependencies).

## Installing

`npm i -g audioviz`

## JavaScript library

```js
const Audioviz = require("audioviz");
const path = require("path");

var audioviz = new Audioviz({
  audio: path.join(__dirname, "audio.mp3"),
  output: "video.mp4",
});

(async () => {
  const output = await audioviz.render();
  console.log(output);
})();
```

### Parameters

| Parameter         | Description                                 | Default   |     |
| ----------------- | ------------------------------------------- | --------- | --- |
| `audio`           | Audio input path (mp3, wav)                 |           |     |
| `width`           | Width which all media will be converted to  | `1280`    |     |
| `height`          | Height which all media will be converted to | `720`     |     |
| `output`          | output file name                            |           |     |
| `waveColor`       | Color for audio waves drawn on frames       | `#d84a4a` |     |
| `backgroundColor` | BackGround color for video                  | `#fff`    |     |
| `pattern`         | Wave pattern to be drawn                    | `bars`    |     |
| `waveTop`         | Top alignment                               | `150`     |     |
| `waveRight`       | Right alignment                             | `1280`    |     |
| `waveLeft`        | Left alignment                              | `0`       |     |
| `waveBottom`      | Bottom alignment                            | `420`     |     |

## See also

- https://github.com/nypublicradio/audiogram

---

Made with ❤️
Follow me on [GitHub](https://github.com/maddygoround/)
