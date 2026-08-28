# Corncob 3D — WebAssembly edition

An archival browser edition of **Corncob 3D v3.42**. The original mode runs a reconstructed DOS build through a DOSBox-compatible x86 runtime compiled to WebAssembly. A separate real-time multiplayer mode adds five landing strips, optional call signs, shared player counts, combat damage, and respawns.

## Run locally

```sh
npm install
npm run build
npm start
```

Then open `http://localhost:3057`. For frontend development, run `npm run dev`; the multiplayer/API server remains on port **3057**.

## What “WebAssembly port” means here

The original is 16-bit MASM and talks directly to DOS, BIOS, VGA, keyboard, timer, and sound hardware interfaces. WebAssembly cannot execute that source directly. The original mode runs a source-reconstructed binary with a guarded assembly extension that adds four parallel runways. See [`reverse-engineering/README.md`](reverse-engineering/README.md) for the reproducible historical build notes.

Multiplayer uses an authoritative TypeScript WebSocket service. Clients report motion while the server owns the roster, validates firing direction/range, applies damage, and respawns destroyed planes. There are no accounts; a blank call sign receives an anonymous pilot name.

The runnable bundle includes the VGA screens produced by the game's deterministic first-run JPG decompressor. This avoids making every visitor repeat the original installation step. The untouched v3.42 distribution, including its compressed JPG inputs, remains in `original/cc3d342-original.zip`.

The recovered assembly is retained in [`original/source`](original/source) for study and a possible future native rewrite.

## Provenance and licensing

- Game: Kevin Stokes / Pie in the Sky Software, 1992; v3.42 shareware distribution.
- Source preservation: [foone/Corncob3D](https://github.com/foone/Corncob3D), recovered in 2018.
- The preservation record reports that Kevin Stokes authorized reuse with “do whatever you like with it.” No formal SPDX license accompanied the source, so that statement and original notices are retained rather than assigning a new license to the historical material.
- Emulator UI/runtime: [js-dos](https://js-dos.com/), GPL-2.0.

The new web-shell files in this repository are released under the MIT license; that does not alter the notices or terms applicable to the historical game, source, or emulator.
