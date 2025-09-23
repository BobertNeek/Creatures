DSE-Web-Engine v0.12.4 (merged)
- Base: DSE-Web-Engine-v0.12.0.zip
- CAOS package: caos_engine_package.full_opcodes.zip
What changed:
- Added ./caos_engine/ (contents from CAOS package)
- Copied opcode map to ./caos_opcodes.json if present
- Injected ./js/caos_bridge.js and added a module tag to index.html
How to use:
1) Serve this folder via HTTP.
2) Open index.html; the bridge autoloads the packaged CAOS engine.
3) Call window.caosRun("scrp 2 0 0 1\nlog hi\nendm") to execute, or use existing UI hooks.
