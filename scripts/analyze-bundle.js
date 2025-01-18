const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const BUNDLE_SIZE_LIMIT = 500 * 1024; // 500KB
const CHUNK_SIZE_LIMIT = 200 * 1024; // 200KB
const INITIAL_JS_LIMIT = 150 * 1024; // 150KB

function formatSize(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(2)}KB`;
  }
  return `${(kb / 1024).toFixed(2)}MB`;
}

function analyzeBundle() {
  const statsFile = path.join(process.cwd(), '.next', 'stats.json');
  
  if (!fs.existsSync(statsFile)) {
    console.error(chalk.red('Stats file not found. Please run `next build` first.'));
    process.exit(1);
  }

  const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
  const assessmentAssets = stats.assets.filter(asset => 
    asset.name.includes('assessment') || 
    asset.name.includes('features/assessment')
  );

  let totalSize = 0;
  let initialJsSize = 0;
  const issues = [];

  assessmentAssets.forEach(asset => {
    totalSize += asset.size;
    
    if (asset.name.endsWith('.js') && !asset.name.includes('chunk')) {
      initialJsSize += asset.size;
    }

    if (asset.size > CHUNK_SIZE_LIMIT) {
      issues.push(`Large chunk detected: ${asset.name} (${formatSize(asset.size)})`);
    }
  });

  console.log(chalk.blue('\nBundle Analysis Results:'));
  console.log('----------------------------------------');
  
  console.log(chalk.white('\nTotal Bundle Size:'), 
    totalSize > BUNDLE_SIZE_LIMIT 
      ? chalk.red(formatSize(totalSize))
      : chalk.green(formatSize(totalSize))
  );
  
  console.log(chalk.white('Initial JS Size:'),
    initialJsSize > INITIAL_JS_LIMIT
      ? chalk.red(formatSize(initialJsSize))
      : chalk.green(formatSize(initialJsSize))
  );

  if (issues.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    issues.forEach(issue => console.log(chalk.yellow(`- ${issue}`)));
  }

  const duplicates = findDuplicateModules(stats);
  if (duplicates.length > 0) {
    console.log(chalk.yellow('\nDuplicate Modules:'));
    duplicates.forEach(dup => {
      console.log(chalk.yellow(`- ${dup.module} (${dup.count} instances)`));
    });
  }

  console.log('\nSize Limits:');
  console.log(`- Total Bundle: ${formatSize(BUNDLE_SIZE_LIMIT)}`);
  console.log(`- Individual Chunk: ${formatSize(CHUNK_SIZE_LIMIT)}`);
  console.log(`- Initial JS: ${formatSize(INITIAL_JS_LIMIT)}`);

  if (totalSize > BUNDLE_SIZE_LIMIT || initialJsSize > INITIAL_JS_LIMIT || issues.length > 0) {
    console.log(chalk.red('\n❌ Bundle size check failed'));
    process.exit(1);
  }

  console.log(chalk.green('\n✅ Bundle size check passed'));
}

function findDuplicateModules(stats) {
  const modules = {};
  stats.modules.forEach(module => {
    const name = module.name.split('node_modules/')[1];
    if (name) {
      modules[name] = (modules[name] || 0) + 1;
    }
  });

  return Object.entries(modules)
    .filter(([_, count]) => count > 1)
    .map(([module, count]) => ({ module, count }))
    .sort((a, b) => b.count - a.count);
}

// Run analysis
analyzeBundle();
