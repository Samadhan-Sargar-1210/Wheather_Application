#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌤️  Weather App - Comprehensive Test Suite');
console.log('==========================================\n');

// Test categories
const testCategories = [
  {
    name: 'Component Tests',
    description: 'Testing React components and UI elements',
    tests: [
      'src/components/__tests__/WeatherApp.test.jsx',
      'src/components/__tests__/WeatherForecast.test.jsx',
      'src/components/__tests__/AQIDisplay.test.jsx',
      'src/components/__tests__/WeatherAlert.test.jsx',
      'src/components/__tests__/ThemeToggle.test.jsx',
      'src/components/__tests__/FiveDayForecastChart.test.jsx',
      'src/components/__tests__/FarmerCalendar.test.jsx'
    ]
  },
  {
    name: 'Hook Tests',
    description: 'Testing custom React hooks',
    tests: [
      'src/hooks/__tests__/useTheme.test.js',
      'src/hooks/__tests__/useSpeech.test.js'
    ]
  },
  {
    name: 'Service Tests',
    description: 'Testing API services and data handling',
    tests: [
      'src/services/__tests__/weatherService.test.js'
    ]
  },
  {
    name: 'Integration Tests',
    description: 'Testing app integration and snapshots',
    tests: [
      'src/__tests__/App.test.jsx'
    ]
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}`);
  console.log('='.repeat(message.length));
}

function logSubHeader(message) {
  console.log(`\n${colors.bright}${colors.blue}${message}${colors.reset}`);
  console.log('-'.repeat(message.length));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if Jest is installed
function checkJestInstallation() {
  try {
    execSync('npx jest --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install dependencies if needed
function installDependencies() {
  logInfo('Checking dependencies...');
  
  if (!checkJestInstallation()) {
    logWarning('Jest not found. Installing testing dependencies...');
    try {
      execSync('npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event babel-jest @babel/preset-env @babel/preset-react identity-obj-proxy', { stdio: 'inherit' });
      logSuccess('Testing dependencies installed successfully!');
    } catch (error) {
      logError('Failed to install testing dependencies');
      process.exit(1);
    }
  } else {
    logSuccess('All testing dependencies are installed');
  }
}

// Run individual test file
function runTestFile(testFile) {
  try {
    const result = execSync(`npx jest ${testFile} --verbose --no-coverage`, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout || error.stderr || error.message };
  }
}

// Run test category
function runTestCategory(category) {
  logSubHeader(category.name);
  logInfo(category.description);
  
  let passedTests = 0;
  let failedTests = 0;
  const results = [];
  
  for (const testFile of category.tests) {
    if (fs.existsSync(testFile)) {
      log(`Running ${path.basename(testFile)}...`, 'reset');
      
      const result = runTestFile(testFile);
      results.push({ file: testFile, ...result });
      
      if (result.success) {
        logSuccess(`${path.basename(testFile)} passed`);
        passedTests++;
      } else {
        logError(`${path.basename(testFile)} failed`);
        failedTests++;
      }
    } else {
      logWarning(`${testFile} not found`);
    }
  }
  
  return { passedTests, failedTests, results };
}

// Run all tests with coverage
function runAllTestsWithCoverage() {
  logHeader('Running Complete Test Suite with Coverage');
  
  try {
    const result = execSync('npx jest --coverage --verbose', { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, output: error.stdout || error.stderr || error.message };
  }
}

// Generate test report
function generateTestReport(allResults) {
  const reportPath = 'test-report.md';
  let report = `# Weather App Test Report\n\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const category of allResults) {
    report += `## ${category.name}\n\n`;
    report += `**Description:** ${category.description}\n\n`;
    report += `**Results:** ${category.passedTests} passed, ${category.failedTests} failed\n\n`;
    
    if (category.failedTests > 0) {
      report += `### Failed Tests\n\n`;
      category.results.forEach(result => {
        if (!result.success) {
          report += `- ${path.basename(result.file)}\n`;
        }
      });
      report += `\n`;
    }
    
    totalPassed += category.passedTests;
    totalFailed += category.failedTests;
  }
  
  report += `## Summary\n\n`;
  report += `- **Total Tests Passed:** ${totalPassed}\n`;
  report += `- **Total Tests Failed:** ${totalFailed}\n`;
  report += `- **Success Rate:** ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%\n\n`;
  
  if (totalFailed === 0) {
    report += `🎉 All tests passed successfully!\n`;
  } else {
    report += `⚠️  Some tests failed. Please review the failed tests above.\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  logSuccess(`Test report generated: ${reportPath}`);
}

// Main execution
async function main() {
  try {
    // Install dependencies
    installDependencies();
    
    // Run tests by category
    logHeader('Running Tests by Category');
    
    const allResults = [];
    for (const category of testCategories) {
      const result = runTestCategory(category);
      allResults.push({ ...category, ...result });
    }
    
    // Run complete test suite with coverage
    logHeader('Running Complete Test Suite');
    const coverageResult = runAllTestsWithCoverage();
    
    // Generate report
    generateTestReport(allResults);
    
    // Summary
    logHeader('Test Summary');
    let totalPassed = 0;
    let totalFailed = 0;
    
    allResults.forEach(category => {
      totalPassed += category.passedTests;
      totalFailed += category.failedTests;
      log(`${category.name}: ${category.passedTests} passed, ${category.failedTests} failed`, 
          category.failedTests === 0 ? 'green' : 'yellow');
    });
    
    console.log('\n' + '='.repeat(50));
    log(`Total: ${totalPassed} passed, ${totalFailed} failed`, 
        totalFailed === 0 ? 'green' : 'red');
    
    if (totalFailed === 0) {
      logSuccess('🎉 All tests completed successfully!');
    } else {
      logWarning(`⚠️  ${totalFailed} tests failed. Check the test report for details.`);
    }
    
    console.log('\n' + '='.repeat(50));
    logInfo('Test coverage report available in coverage/ directory');
    logInfo('Detailed test report available in test-report.md');
    
  } catch (error) {
    logError(`Test execution failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Weather App Test Runner

Usage:
  node run-tests.js [options]

Options:
  --help, -h          Show this help message
  --category <name>   Run tests for specific category only
  --coverage-only     Run only coverage tests
  --verbose          Show detailed output

Categories:
  - Component Tests
  - Hook Tests
  - Service Tests
  - Integration Tests

Examples:
  node run-tests.js --category "Component Tests"
  node run-tests.js --coverage-only
  node run-tests.js --verbose
`);
  process.exit(0);
}

if (args.includes('--category')) {
  const categoryName = args[args.indexOf('--category') + 1];
  const category = testCategories.find(cat => cat.name === categoryName);
  
  if (category) {
    logHeader(`Running ${category.name} Only`);
    runTestCategory(category);
  } else {
    logError(`Category "${categoryName}" not found`);
    process.exit(1);
  }
} else if (args.includes('--coverage-only')) {
  logHeader('Running Coverage Tests Only');
  runAllTestsWithCoverage();
} else {
  main();
} 