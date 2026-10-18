# @keychord/vite-plugin

A Vite plugin to help standardize chord packages.

> [!NOTE]
> This section is largely AI-written, so parts of it may not be fully accurate. It will be replaced with a hand-written version when I get the time.

It builds every top-level `src/js/<name>.ts` handler of a [Chord](https://github.com/KeyChord/Chord) package into a self-contained `js/<name>.js` with its dependencies bundled in (`chord` and vendored packages stay external). The chord packages in [KeyChord/chords](https://github.com/KeyChord/chords) don't use this plugin; they're built with [@keychord/config](https://github.com/KeyChord/config), which also vendors `chords/` folders, writes `js/package.json.js` and builds Swift add-ons.

## Install

```sh
bun add -d @keychord/vite-plugin vite-plus
```

## Usage

```ts
// vite.config.ts
import chordPackage from '@keychord/vite-plugin';
export default {
  plugins: [chordPackage()]
};
```

> [!NOTE]
> This section is largely AI-written, so parts of it may not be fully accurate. It will be replaced with a hand-written version when I get the time.

Build with `bunx vp build`. To reuse another chord package's handlers, install it and list it in `vendor`, which copies its `js/` folder to `js/<package name>/js/`:

```ts
chordPackage({ vendor: ["@keychord/chords-menu"] })
```

The official chord packages aren't published to npm, so install them from GitHub, for example `bun add -d github:KeyChord/chords-menu`.
