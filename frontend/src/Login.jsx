"use client"

import { useState } from "react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./components/ui/input-otp"

export default function Login() {
  const [rollno, setRollno] = useState("")
  const [otp, setOtp] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempt:", { email, otp })
    // Add your login logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Examination Portal</CardTitle>
          <CardDescription>Enter the code assigned to you</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Roll Number</Label>
              <Input
                id="rollno"
                type="text"
                placeholder="Enter your Roll Number"
                value={rollno}
                onChange={(e) => setRollno(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full">
                Start Examination
              </Button>

              <div className="text-center">
                
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
