import { NextRequest, NextResponse } from 'next/server'
import { runRetentionTests, generateTestReport } from '@/lib/retention-test'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Running retention tests...')
    
    const testSuites = await runRetentionTests()
    const report = generateTestReport(testSuites)
    
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0)
    const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0)
    const successRate = ((totalPassed / totalTests) * 100).toFixed(1)
    
    console.log(`✅ Retention tests completed: ${totalPassed}/${totalTests} passed (${successRate}%)`)
    
    return NextResponse.json({
      success: true,
      summary: {
        totalTests,
        passedTests: totalPassed,
        failedTests: totalTests - totalPassed,
        successRate: `${successRate}%`
      },
      testSuites,
      report
    })
  } catch (error) {
    console.error('❌ Error running retention tests:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: {
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          successRate: '0%'
        }
      },
      { status: 500 }
    )
  }
} 