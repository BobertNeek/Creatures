DSE Web Engine v0.12.0
- New: external CAOS stdlib file (caos_stdlib.cos) auto-fetched from the same folder; manual file picker provided for file:// contexts.
- CAOS VM: IF/ELSE/ENDI, math ops, VAxx/OVxx variables, MESG WRIT/WRT+, ENUM/NEAR/NEXT, NEW: SIMP, CLAS/ATTR, TICK->Timer(9), POSE/ANIM/MVTO.
- BG/Sprite: BLK and C16/S16 decoders intact; ATT support re-add next pass via composer module.
Usage:
1) Place this HTML and caos_stdlib.cos in the same directory; open the HTML on HTTPS/localhost for best picker support.
2) Click "Load Stdlib" (or use the file button), then "Run Block" to install scripts.
