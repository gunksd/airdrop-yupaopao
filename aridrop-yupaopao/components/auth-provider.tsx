"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      // 添加以下配置来保持会话活跃
      refetchInterval={5 * 60} // 每5分钟刷新一次会话（单位是秒）
      refetchOnWindowFocus={true} // 窗口获得焦点时刷新会话
    >
      {children}
    </SessionProvider>
  )
}
