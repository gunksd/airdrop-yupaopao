"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, User, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession, signIn, signOut } from "next-auth/react"

export function AuthButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session, status } = useSession()
  const [isSigningIn, setIsSigningIn] = useState(false)

  // 处理登录
  const handleSignIn = async (provider: string) => {
    try {
      setIsSigningIn(true)
      await signIn(provider, { callbackUrl: window.location.origin })
    } catch (error) {
      console.error("登录失败:", error)
    } finally {
      setIsSigningIn(false)
      setIsOpen(false)
    }
  }

  // 处理加载状态
  if (status === "loading") {
    return (
      <Button variant="outline" size="sm" disabled>
        <User className="mr-2 h-4 w-4" />
        加载中...
      </Button>
    )
  }

  // 已登录状态
  if (session && session.user) {
    return (
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            {session.user.name || "用户"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              signOut({ callbackUrl: window.location.origin })
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // 未登录状态
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          登录
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>登录账户</DialogTitle>
          <DialogDescription>登录后可以参与讨论和获取更多功能</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <Button className="w-full" onClick={() => handleSignIn("twitter")} variant="outline" disabled={isSigningIn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
            {isSigningIn ? "登录中..." : "使用 Twitter 登录"}
          </Button>
          <Button className="w-full" onClick={() => handleSignIn("github")} variant="outline" disabled={isSigningIn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            {isSigningIn ? "登录中..." : "使用 GitHub 登录"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
