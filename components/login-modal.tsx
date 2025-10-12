"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Shield, Users, ArrowLeft, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  userType: "citizen" | "mcc"
}

export default function LoginModal({ isOpen, onClose, userType }: LoginModalProps) {
  // mode: login or signup (both supported). For MCC we use credentials (StaffID + password) instead of phone/OTP.
  const [mode, setMode] = useState<"login" | "signup">("login")
  // step: for citizens we use phone -> otp -> details; for MCC staff we use "credentials" -> details (if signup)
  const [step, setStep] = useState<"phone" | "otp" | "details" | "credentials">(
    userType === "mcc" ? "credentials" : "phone"
  )

  // Citizen states
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
<<<<<<< HEAD
  const [generatedOtp, setGeneratedOtp] = useState("")
=======

  // MCC staff states
  const [staffId, setStaffId] = useState("")
  const [password, setPassword] = useState("")

>>>>>>> aa5da82e920b93db34b3759ca1bf165a97cc1efb
  const [loading, setLoading] = useState(false)
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    address: "",
  })
  const router = useRouter()

<<<<<<< HEAD
  // ✅ Send OTP only after clicking the button
=======
  useEffect(() => {
    // whenever modal opens, ensure correct initial step for the userType
    if (isOpen) {
      setMode("login")
      setStep(userType === "mcc" ? "credentials" : "phone")
    }
  }, [isOpen, userType])

  // Citizen flows (unchanged)
>>>>>>> aa5da82e920b93db34b3759ca1bf165a97cc1efb
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) return

    setLoading(true)
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(randomOtp)

    setTimeout(() => {
      setLoading(false)
      setStep("otp")
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === "signup") {
        setStep("details")
      } else {
        onClose()
        router.push(userType === "citizen" ? "/citizen/dashboard" : "/mcc/dashboard")
      }
    }, 1500)
  }

  const handleCompleteSignup = async () => {
    if (!signupData.name || !signupData.email) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
      router.push(userType === "citizen" ? "/citizen/dashboard" : "/mcc/dashboard")
    }, 1500)
  }

  // MCC staff credential-based login
  const handleStaffCredentials = async () => {
    // basic validation
    if (!staffId || !password) return

    setLoading(true)
    // Simulate server validation
    setTimeout(() => {
      setLoading(false)
      if (mode === "signup") {
        // If you want staff signup flow, go to details to collect profile info
        setStep("details")
      } else {
        onClose()
        router.push("/mcc/dashboard")
      }
    }, 1200)
  }

  const resetModal = () => {
    setMode("login")
    setStep(userType === "mcc" ? "credentials" : "phone")
    setPhoneNumber("")
    setOtp("")
    setStaffId("")
    setPassword("")
    setSignupData({ name: "", email: "", address: "" })
    setGeneratedOtp("")
    setLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {userType === "citizen" ? (
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
            )}
            <div>
              <DialogTitle className="text-left">
                {mode === "login"
                  ? userType === "citizen"
                    ? "Citizen Login"
                    : "MCC Staff Login"
                  : userType === "citizen"
                  ? "Citizen Sign Up"
                  : "MCC Staff Sign Up"}
              </DialogTitle>
              <Badge variant="outline" className="text-xs">
                {userType === "citizen" ? "Public Access" : "Staff Access"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

<<<<<<< HEAD
        {/* 📱 STEP 1 - Phone Input */}
=======
        {/* Render different flows based on step */}
>>>>>>> aa5da82e920b93db34b3759ca1bf165a97cc1efb
        {step === "phone" ? (
          // Citizen phone -> OTP flow (unchanged)
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Enter Phone Number
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "We'll send you a 6-digit OTP for secure login"
                  : "We'll send you a 6-digit OTP to verify your number"}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">+91</div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="rounded-l-none"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* 👇 Button must be clicked to generate OTP */}
              <Button
                onClick={handleSendOTP}
                disabled={phoneNumber.length !== 10 || loading}
                className="w-full gradient-bg hover:opacity-90 text-white"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>

              <div className="text-center text-sm">
                {mode === "login" ? (
                  <span>
<<<<<<< HEAD
                    Don’t have an account?{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => setMode("signup")}>
=======
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => setMode("signup") }>
>>>>>>> aa5da82e920b93db34b3759ca1bf165a97cc1efb
                      Sign up here
                    </Button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => setMode("login") }>
                      Login here
                    </Button>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ) : step === "otp" ? (
          /* 🔢 STEP 2 - OTP Verification */
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => setStep("phone") } className="p-1 h-auto">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-lg">Verify OTP</CardTitle>
              </div>
              <CardDescription>
                Enter the 6-digit code sent to +91 {phoneNumber}
                {generatedOtp && (
                  <span className="block mt-1 text-xs text-green-600">Demo OTP: {generatedOtp}</span>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full gradient-bg hover:opacity-90 text-white"
              >
                {loading ? "Verifying..." : mode === "login" ? "Verify & Login" : "Verify & Continue"}
              </Button>

              <Button variant="ghost" onClick={handleSendOTP} className="w-full text-sm" disabled={loading}>
                Resend OTP
              </Button>
            </CardContent>
          </Card>
<<<<<<< HEAD
        ) : (
          /* 📝 STEP 3 - Signup Details */
=======
        ) : step === "credentials" ? (
          // MCC staff credentials (StaffID + Password) - replaces phone/OTP for MCC staff
>>>>>>> aa5da82e920b93db34b3759ca1bf165a97cc1efb
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <div className="flex items-center gap-2 mb-2">
                {/* back button only useful if coming from details - otherwise omitted */}
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {mode === "login" ? "Staff Login" : "Staff Sign Up"}
                </CardTitle>
              </div>
              <CardDescription>
                {mode === "login"
                  ? "Sign in using your Staff ID and password"
                  : "Provide a Staff ID and password to create a staff account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staffId">Staff ID</Label>
                <Input
                  id="staffId"
                  placeholder="Enter your Staff ID"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                onClick={handleStaffCredentials}
                disabled={!staffId || !password || loading}
                className="w-full gradient-bg hover:opacity-90 text-white"
              >
                {loading ? (mode === "login" ? "Signing in..." : "Creating...") : mode === "login" ? "Sign In" : "Continue"}
              </Button>

              <div className="text-center text-sm">
                {mode === "login" ? (
                  <span>
                    Don't have a staff account?{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => setMode("signup") }>
                      Sign up here
                    </Button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => setMode("login") }>
                      Login here
                    </Button>
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          // details step (used by signup flows for both citizen and staff)
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => setStep(userType === "mcc" ? "credentials" : "otp")} className="p-1 h-auto">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Complete Profile
                </CardTitle>
              </div>
              <CardDescription>Please provide your details to complete registration</CardDescription>
            </CardHeader>

            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your address (optional)"
                  value={signupData.address}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <Button
                onClick={handleCompleteSignup}
                disabled={!signupData.name || !signupData.email || loading}
                className="w-full gradient-bg hover:opacity-90 text-white"
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
