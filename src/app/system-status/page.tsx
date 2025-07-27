"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Activity, CheckCircle, AlertCircle, Clock, Database, Mail, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HealthStatus {
  status: string
  timestamp: string
  version?: string
  environment?: string
}

interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'outage'
  description: string
  lastChecked: string
  icon: React.ReactNode
}

export default function SystemStatusPage() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setHealthData(data)
      } catch (error) {
        console.error('Failed to fetch health data:', error)
        setHealthData({
          status: 'unhealthy',
          timestamp: new Date().toISOString()
        })
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
    // Refresh every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'outage':
      case 'unhealthy': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'outage':
      case 'unhealthy': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  // Mock service statuses - in a real application, these would come from actual monitoring
  const services: ServiceStatus[] = [
    {
      name: 'Web Application',
      status: healthData?.status === 'healthy' ? 'healthy' : 'degraded',
      description: 'Main website and user interface',
      lastChecked: healthData?.timestamp || new Date().toISOString(),
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: 'Database',
      status: 'healthy',
      description: 'User data and meetup storage',
      lastChecked: new Date().toISOString(),
      icon: <Database className="w-5 h-5" />
    },
    {
      name: 'Authentication',
      status: 'healthy',
      description: 'User login and registration',
      lastChecked: new Date().toISOString(),
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      name: 'Email Service',
      status: 'healthy',
      description: 'Invitation and notification emails',
      lastChecked: new Date().toISOString(),
      icon: <Mail className="w-5 h-5" />
    }
  ]

  const overallStatus = services.every(s => s.status === 'healthy') ? 'healthy' : 
                       services.some(s => s.status === 'outage') ? 'outage' : 'degraded'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="border-b-2 border-amber-200 bg-white/80 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2 text-amber-600 hover:text-amber-700">
                <Home className="w-4 h-4" />
                ← Terug naar Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-amber-700">Systeem Status</h1>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Overall Status */}
        <Card className="mb-8 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-amber-600" />
              Overall Systeem Status
              {getStatusIcon(overallStatus)}
            </CardTitle>
            <CardDescription>
              Laatste update: {loading ? 'Laden...' : new Date().toLocaleString('nl-NL')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(overallStatus)}`}>
              {loading ? 'Controleren...' : 
               overallStatus === 'healthy' ? '✅ Alle systemen operationeel' :
               overallStatus === 'degraded' ? '⚠️ Beperkte functionaliteit' :
               '🚨 Systeemstoring'}
            </div>
            {healthData && (
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><strong>Versie:</strong> {healthData.version || 'Onbekend'}</p>
                <p><strong>Omgeving:</strong> {healthData.environment || 'Onbekend'}</p>
                <p><strong>Laatste check:</strong> {new Date(healthData.timestamp).toLocaleString('nl-NL')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {services.map((service, index) => (
            <Card key={index} className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    {service.icon}
                    {service.name}
                  </div>
                  {getStatusIcon(service.status)}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`font-semibold ${getStatusColor(service.status)}`}>
                  {service.status === 'healthy' ? 'Operationeel' :
                   service.status === 'degraded' ? 'Verminderde prestaties' :
                   'Niet beschikbaar'}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Laatste check: {new Date(service.lastChecked).toLocaleString('nl-NL')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Status Legend */}
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="text-lg">Status Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-semibold text-green-600">Operationeel</div>
                  <div className="text-xs text-gray-600">Service werkt normaal</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-600">Verminderde prestaties</div>
                  <div className="text-xs text-gray-600">Service werkt langzamer</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-semibold text-red-600">Niet beschikbaar</div>
                  <div className="text-xs text-gray-600">Service werkt niet</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mt-8 border-amber-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-amber-700 mb-2">Problemen ervaren?</h3>
              <p className="text-gray-600 mb-4">
                Als je technische problemen ondervindt die niet hier vermeld staan:
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                    📧 Neem Contact Op
                  </Button>
                </Link>
                <a href="mailto:team@anemimeets.com">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    📧 Direct Email
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-refresh notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          ℹ️ Deze pagina wordt automatisch ververst elke 30 seconden
        </div>
      </div>
    </div>
  )
}