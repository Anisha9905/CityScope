"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Shield, Phone } from "lucide-react"
import LoginModal from "@/components/login-modal"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [userType, setUserType] = useState<"citizen" | "mcc">("citizen")

  const handleLoginClick = (type: "citizen" | "mcc") => {
    setUserType(type)
    setShowLogin(true)
  }

  return (
    <div className="min-h-screen">
      {/* Gradient Background */}
      <div className="fixed inset-0 gradient-bg opacity-10 -z-10" />

      {/* Header */}
      <header className="relative border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">NammaRoads</h1>
                <p className="text-sm text-muted-foreground">Smart City Initiative</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              Beta Version
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Report Issues, <span className="gradient-text">Transform Our Roads</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Connect directly with your local authorities through NammaRoads. Report civic issues, track progress, and
              help build a better city for everyone.
            </p>

            {/* Login Options */}
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card
                className="relative overflow-hidden border-2 hover:border-blue-200 transition-colors cursor-pointer group"
                onClick={() => handleLoginClick("citizen")}
              >
                <div className="absolute inset-0 gradient-secondary-bg opacity-5 group-hover:opacity-10 transition-opacity" />
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Citizen Login</CardTitle>
                  <CardDescription>Report issues, track complaints, and stay updated</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gradient-bg hover:opacity-90 text-white">Login as Citizen</Button>
                </CardContent>
              </Card>

              <Card
                className="relative overflow-hidden border-2 hover:border-purple-200 transition-colors cursor-pointer group"
                onClick={() => handleLoginClick("mcc")}
              >
                <div className="absolute inset-0 gradient-accent opacity-5 group-hover:opacity-10 transition-opacity" />
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">MCC Staff Login</CardTitle>
                  <CardDescription>Manage complaints, assign tasks, and coordinate responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Login as MCC Staff</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, efficient, and transparent civic issue management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-bg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Report Issues</h4>
              <p className="text-sm text-muted-foreground">
                Use GPS location and camera to report civic issues instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-bg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Get Assigned</h4>
              <p className="text-sm text-muted-foreground">Issues are automatically assigned to relevant departments</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg gradient-bg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Track Progress</h4>
              <p className="text-sm text-muted-foreground">Real-time updates and notifications on issue resolution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 NammaRoads - Smart City Initiative. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} userType={userType} />
    </div>
  )
}
