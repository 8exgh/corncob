# Corncob 3D reverse-engineering workspace

This directory documents the reproducible reconstruction of the original DOS build.

Historical compiler/runtime binaries are intentionally not committed. Local copies belong under `vendor/`, which is ignored by Git. The known Spontaneous Assembly 3.0 installation archive has SHA-256:

`d7d33a2346df451ee2b4a07445e3f9c8faaeeb108f3710af9fae77064bea01b9`

The original link response files require the small-model `STARTS.OBJ` and `SAS.LIB` files from that package.

`BUILD.BAT` uses MASM compatibility mode to assemble the recovered source and the original response file to link it. The reconstructed unmodified program is six bytes larger than the 1993 executable and boots successfully with the released data files.

The production build defines `five_runways`. This adds four parallel strips in `DEFOBJS.ASM` using the original `objroadend`, `roadpiece`, and collision objects. Without that define, the historical one-strip behavior is retained.
