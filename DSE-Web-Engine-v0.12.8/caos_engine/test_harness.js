// Compatibility Test Harness for CAOS Engine
const tests = [
  { code: 'setv va00 2\naddv va00 3\noutv va00', expected: '5' },
  { code: 'doif 4 ge 4\n  outs "OK"\nelse\n  outs "NO"\nendi', expected: 'OK' },
  { code: 'setv va01 1\nreps 3\n  addv va01 1\nrepe\noutv va01', expected: '4' },
  { code: 'inst\nnew: simp 2 10 1000 "test" 1 0 1000\nendm\nenum 2 10 1000\n  outs name "\n"\nnext', expected: '<agent_name>\n' }
];
console.log('Running CAOS compatibility tests...');
let passCount = 0;
for (const t of tests) {
  try {
    // Basic validation using caos_opcodes.json
    validateScriptSyntax(t.code);  // Throws if unknown opcode or arity/type mismatch
    const result = engine.executeCAOS(t.code);  // Execute script in engine (returns output string or last OUTS/OUTV)
    const pass = (typeof result === 'string' ? result : String(result)) === t.expected;
    console.log(`${pass ? '✅' : '❌'} Script: ${JSON.stringify(t.code)} Expected: ${JSON.stringify(t.expected)} Got: ${JSON.stringify(result)}`);
    if (!pass) {
      console.warn(`Mismatch for script: ${t.code}`);
    } else {
      passCount++;
    }
  } catch (err) {
    console.error(`⚠️ Error executing script "${t.code}": ${err.message}`);
  }
}
console.log(`${passCount}/${tests.length} tests passed.`);
