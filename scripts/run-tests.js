#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🧪 Test Runner voor Anemi Project')
console.log('================================')

// Test configuratie
const testConfig = {
  unit: {
    pattern: 'src/**/*.test.{js,jsx,ts,tsx}',
    description: 'Unit Tests'
  },
  integration: {
    pattern: 'src/app/api/**/*.test.{js,jsx,ts,tsx}',
    description: 'Integration Tests'
  },
  component: {
    pattern: 'src/components/**/*.test.{js,jsx,ts,tsx}',
    description: 'Component Tests'
  },
  validation: {
    pattern: 'src/lib/**/*.test.{js,jsx,ts,tsx}',
    description: 'Validation Tests'
  }
}

// Functie om tests te vinden
function findTestFiles(pattern) {
  const glob = require('glob')
  return glob.sync(pattern, { cwd: process.cwd() })
}

// Functie om test uit te voeren
function runTests(testFiles, description) {
  if (testFiles.length === 0) {
    console.log(`⚠️  Geen ${description} gevonden`)
    return { success: true, count: 0 }
  }

  console.log(`\n📋 ${description} (${testFiles.length} bestanden):`)
  testFiles.forEach(file => console.log(`   - ${file}`))

  try {
    const command = `npx jest ${testFiles.join(' ')} --verbose --coverage`
    console.log(`\n🚀 Uitvoeren: ${command}`)
    
    const result = execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    return { success: true, count: testFiles.length }
  } catch (error) {
    console.error(`❌ ${description} gefaald`)
    return { success: false, count: testFiles.length }
  }
}

// Functie om coverage rapport te genereren
function generateCoverageReport() {
  console.log('\n📊 Coverage Rapport:')
  
  try {
    const coveragePath = path.join(process.cwd(), 'coverage', 'lcov-report', 'index.html')
    if (fs.existsSync(coveragePath)) {
      console.log(`✅ Coverage rapport gegenereerd: ${coveragePath}`)
      console.log('💡 Open het rapport in je browser om details te bekijken')
    } else {
      console.log('⚠️  Coverage rapport niet gevonden')
    }
  } catch (error) {
    console.error('❌ Fout bij genereren coverage rapport:', error.message)
  }
}

// Functie om test resultaten samen te vatten
function summarizeResults(results) {
  console.log('\n📈 Test Samenvatting:')
  console.log('=====================')
  
  let totalTests = 0
  let totalSuccess = 0
  
  Object.entries(results).forEach(([type, result]) => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${type}: ${result.count} tests`)
    totalTests += result.count
    if (result.success) totalSuccess++
  })
  
  console.log(`\n📊 Totaal: ${totalTests} tests in ${Object.keys(results).length} categorieën`)
  
  if (totalSuccess === Object.keys(results).length) {
    console.log('🎉 Alle tests geslaagd!')
    return true
  } else {
    console.log('⚠️  Sommige tests gefaald')
    return false
  }
}

// Hoofdfunctie
async function runAllTests() {
  console.log('🔍 Zoeken naar test bestanden...')
  
  const results = {}
  
  // Voer tests uit per categorie
  for (const [type, config] of Object.entries(testConfig)) {
    const testFiles = findTestFiles(config.pattern)
    results[type] = runTests(testFiles, config.description)
  }
  
  // Genereer coverage rapport
  generateCoverageReport()
  
  // Samenvatting
  const allPassed = summarizeResults(results)
  
  // Exit code
  process.exit(allPassed ? 0 : 1)
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

// Start tests
runAllTests().catch(error => {
  console.error('❌ Test runner error:', error)
  process.exit(1)
}) 