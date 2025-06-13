"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Twitter, Github } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true)
      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
      console.error("登录失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <Button variant="outline" onClick={() => handleSignIn("twitter")} disabled={isLoading}>
          <Twitter className="mr-2 h-4 w-4" />
          {isLoading ? "登录中..." : "使用 Twitter 登录"}
        </Button>
        <Button variant="outline" onClick={() => handleSignIn("github")} disabled={isLoading}>
          <Github className="mr-2 h-4 w-4" />
          {isLoading ? "登录中..." : "使用 GitHub 登录"}
        </Button>
      </div>
    </Card>
  )
}
