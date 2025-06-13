"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Twitter, Github, User, LogOut } from "lucide-react"
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
  const { data: session, status } = useSession()

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            {session.user.name || "用户"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => signOut()}>
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
          <Button
            className="w-full"
            onClick={() => {
              signIn("twitter", { callbackUrl: window.location.href })
              setIsOpen(false)
            }}
            variant="outline"
          >
            <Twitter className="mr-2 h-4 w-4" />
            使用 Twitter 登录
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              signIn("github", { callbackUrl: window.location.href })
              setIsOpen(false)
            }}
            variant="outline"
          >
            <Github className="mr-2 h-4 w-4" />
            使用 GitHub 登录
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

