@echo off
echo Corncob 3D reconstructed build > C:\BUILD.LOG
echo Assembling modules... >> C:\BUILD.LOG
ML /c /Zm /Dshareflag=0 /Dmbflag=1 /Fo3_R.OBJ /I. 3.ASM >> C:\BUILD.LOG
ML /c /Zm /Dshareflag=0 /Dmbflag=1 /FoF3DVEC_R.OBJ /I. F3DVEC.ASM >> C:\BUILD.LOG
ML /c /Zm /FoHLINE.OBJ /I. HLINE.ASM >> C:\BUILD.LOG
ML /c /Zm /Dshareflag=0 /Dmbflag=1 /Dfive_runways=1 /FoDEFOBJ_R.OBJ /I. DEFOBJS.ASM >> C:\BUILD.LOG
ML /c /Zm /FoKLINE.OBJ /I. KLINE.ASM >> C:\BUILD.LOG
ML /c /Zm /FoEGALINE.OBJ /I. EGALINE.ASM >> C:\BUILD.LOG
ML /c /Zm /Dshareflag=0 /FoSTRTXP_R.OBJ /I. STRTEXP.ASM >> C:\BUILD.LOG
ML /c /Zm /FoINST.OBJ /I. INST.ASM >> C:\BUILD.LOG
ML /c /Zm /FoMAT.OBJ /I. MAT.ASM >> C:\BUILD.LOG
ML /c /Zm /FoSIN.OBJ /I. SIN.ASM >> C:\BUILD.LOG
ML /c /Zm /FoCSQRT.OBJ /I. CSQRT.ASM >> C:\BUILD.LOG
ML /c /Zm /FoATN.OBJ /I. ATN.ASM >> C:\BUILD.LOG
ML /c /Zm /FoDSQRT.OBJ /I. DSQRT.ASM >> C:\BUILD.LOG
ML /c /Zm /Dshareflag=0 /FoCMDLINER.OBJ /I. CMDLINE.ASM >> C:\BUILD.LOG
ML /c /Zm /Dshareflag=0 /Dmbflag=1 /FoMAP_R.OBJ /I. MAP.ASM >> C:\BUILD.LOG
ML /c /Zm /FoADL.OBJ /I. ADL.ASM >> C:\BUILD.LOG
ML /c /Zm /FoPICT.OBJ /I. PICT.ASM >> C:\BUILD.LOG
echo Linking 3.EXE... >> C:\BUILD.LOG
LINK @3R.LNK >> C:\BUILD.LOG
echo Build finished. >> C:\BUILD.LOG
