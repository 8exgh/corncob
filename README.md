# Corncob 3D — WebAssembly edition

An archival browser edition of **Corncob 3D v3.42**. The DOS program and its data files are unchanged; a DOSBox-compatible x86 runtime compiled to WebAssembly executes them in the browser.

## Run locally

```sh
npm install
npm run dev
```

Then open the URL printed by Vite and click **Start engine**. The pinned js-dos runtime is hosted by this project, so playing does not depend on a third-party CDN.

## What “WebAssembly port” means here

The original is 16-bit MASM and talks directly to DOS, BIOS, VGA, keyboard, timer, and sound hardware interfaces. WebAssembly cannot execute that source directly. This project therefore preserves the released machine code and runs it with a WebAssembly DOS/PC compatibility layer. This is the fidelity-first version: gameplay and data remain the original bytes rather than a reinterpretation.

The runnable bundle includes the VGA screens produced by the game's deterministic first-run JPG decompressor. This avoids making every visitor repeat the original installation step. The untouched v3.42 distribution, including its compressed JPG inputs, remains in `original/cc3d342-original.zip`.

The recovered assembly is retained in [`original/source`](original/source) for study and a possible future native rewrite.

## Provenance and licensing

- Game: Kevin Stokes / Pie in the Sky Software, 1992; v3.42 shareware distribution.
- Source preservation: [foone/Corncob3D](https://github.com/foone/Corncob3D), recovered in 2018.
- The preservation record reports that Kevin Stokes authorized reuse with “do whatever you like with it.” No formal SPDX license accompanied the source, so that statement and original notices are retained rather than assigning a new license to the historical material.
- Emulator UI/runtime: [js-dos](https://js-dos.com/), GPL-2.0.

The new web-shell files in this repository are released under the MIT license; that does not alter the notices or terms applicable to the historical game, source, or emulator.
