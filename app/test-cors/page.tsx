"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, Globe } from 'lucide-react'

export default function TestCorsPage() {
  const [testResults, setTestResults] = useState<{
    corsHandler: 'loading' | 'success' | 'error' | null
    simplePayment: 'loading' | 'success' | 'error' | null
    corsTest: 'loading' | 'success' | 'error' | null
  }>({
    corsHandler: null,
    simplePayment: null,
    corsTest: null
  })
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testCorsHandler = async () => {
    setTestResults(prev => ({ ...prev, corsHandler: 'loading' }))
    setError(null)
    addLog('Testing CORS Handler endpoint...')

    try {
      const response = await fetch('https://backend-production-ea59.up.railway.app/store/cors-handler', {
        method: 'GET',
        headers: {
          'Origin': window.location.origin
        }
      })

      if (response.ok) {
        const result = await response.json()
        setTestResults(prev => ({ ...prev, corsHandler: 'success' }))
        addLog(`✅ CORS Handler successful: ${result.message}`)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      setTestResults(prev => ({ ...prev, corsHandler: 'error' }))
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      addLog(`❌ CORS Handler failed: ${errorMsg}`)
    }
  }

  const testSimplePayment = async () => {
    setTestResults(prev => ({ ...prev, simplePayment: 'loading' }))
    setError(null)
    addLog('Testing Simple Payment endpoint...')

    try {
      const response = await fetch('https://backend-production-ea59.up.railway.app/store/simple-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          items: [
            {
              id: 1,
              title: 'Test Product',
              price: 100000,
              quantity: 1
            }
          ],
          customer_email: 'test@example.com',
          customer_phone: '+989123456789'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setTestResults(prev => ({ ...prev, simplePayment: 'success' }))
        addLog(`✅ Simple Payment successful: ${result.message}`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      setTestResults(prev => ({ ...prev, simplePayment: 'error' }))
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      addLog(`❌ Simple Payment failed: ${errorMsg}`)
    }
  }

  const testCorsTest = async () => {
    setTestResults(prev => ({ ...prev, corsTest: 'loading' }))
    setError(null)
    addLog('Testing CORS Test endpoint...')

    try {
      const response = await fetch('https://backend-production-ea59.up.railway.app/store/cors-test', {
        method: 'GET',
        headers: {
          'Origin': window.location.origin
        }
      })

      if (response.ok) {
        const result = await response.json()
        setTestResults(prev => ({ ...prev, corsTest: 'success' }))
        addLog(`✅ CORS Test successful: ${result.message}`)
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      setTestResults(prev => ({ ...prev, corsTest: 'error' }))
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      addLog(`❌ CORS Test failed: ${errorMsg}`)
    }
  }

  const runAllTests = async () => {
    setLogs([])
    addLog('Starting all CORS tests...')
    
    await testCorsHandler()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testCorsTest()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testSimplePayment()
    
    addLog('All tests completed!')
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Globe className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'loading':
        return 'در حال تست...'
      case 'success':
        return 'موفق'
      case 'error':
        return 'خطا'
      default:
        return 'آماده'
    }
  }

  const allTestsPassed = testResults.corsHandler === 'success' && 
                        testResults.simplePayment === 'success' && 
                        testResults.corsTest === 'success'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="glassmorphism-light border-0 shadow-xl mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800 text-center flex items-center justify-center">
              <Globe className="w-8 h-8 ml-3" />
              تست CORS - بررسی اتصال به بک‌اند
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <Button 
                onClick={runAllTests}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
              >
                اجرای همه تست‌ها
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                {getStatusIcon(testResults.corsHandler)}
                <span>CORS Handler</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                تست endpoint جهانی CORS
              </p>
              <Button 
                onClick={testCorsHandler}
                disabled={testResults.corsHandler === 'loading'}
                className="w-full"
              >
                {testResults.corsHandler === 'loading' ? 'در حال تست...' : 'تست CORS Handler'}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                وضعیت: {getStatusText(testResults.corsHandler)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                {getStatusIcon(testResults.corsTest)}
                <span>CORS Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                تست endpoint اصلی CORS
              </p>
              <Button 
                onClick={testCorsTest}
                disabled={testResults.corsTest === 'loading'}
                className="w-full"
                variant="outline"
              >
                {testResults.corsTest === 'loading' ? 'در حال تست...' : 'تست CORS Test'}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                وضعیت: {getStatusText(testResults.corsTest)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                {getStatusIcon(testResults.simplePayment)}
                <span>Simple Payment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                تست endpoint پرداخت
              </p>
              <Button 
                onClick={testSimplePayment}
                disabled={testResults.simplePayment === 'loading'}
                className="w-full"
                variant="outline"
              >
                {testResults.simplePayment === 'loading' ? 'در حال تست...' : 'تست Payment'}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                وضعیت: {getStatusText(testResults.simplePayment)}
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {allTestsPassed && (
          <Alert className="border-green-200 bg-green-50 mb-6">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              🎉 همه تست‌ها موفقیت‌آمیز بود! CORS کاملاً کار می‌کند.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>لاگ تست‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">هیچ تستی اجرا نشده است...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button 
            onClick={() => window.location.href = '/checkout'}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            disabled={!allTestsPassed}
          >
            {allTestsPassed ? 'رفتن به صفحه تسویه حساب' : 'ابتدا تست‌ها را تکمیل کنید'}
          </Button>
        </div>
      </div>
    </div>
  )
}



