const { Project } = require('ts-morph');

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
const barrelPath = 'src/components/features/assessment/index.ts';

const barrelFile = project.getSourceFile(barrelPath);
if (!barrelFile) {
  console.error(`❌ Barrel file not found at ${barrelPath}`);
  process.exit(1);
}

let hasError = false;

barrelFile.getExportDeclarations().forEach((exp) => {
  exp.getNamedExports().forEach((named) => {
    const name = named.getName();
    const symbol = named.getSymbol();
    const target = symbol?.getAliasedSymbol() ?? symbol;

    if (!target) {
      console.error(`❌ Missing symbol for export '${name}'`);
      hasError = true;
    }
  });
});

if (hasError) {
  console.error('❌ Barrel verification failed.');
  process.exit(1);
}

console.log('✅ Barrel exports verified.'); 