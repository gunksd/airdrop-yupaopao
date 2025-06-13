"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export function GiscusComments() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // 清除之前的评论
    const commentsDiv = document.getElementById("giscus-comments")
    if (commentsDiv) {
      while (commentsDiv.firstChild) {
        commentsDiv.removeChild(commentsDiv.firstChild)
      }
    }

    // 创建新的 script 元素
    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", "gunksd/yupaopao-Giscus")
    script.setAttribute("data-repo-id", "R_kgDOOIW5Lg")
    script.setAttribute("data-category", "Announcements")
    script.setAttribute("data-category-id", "DIC_kwDOOIW5Ls4CoApl")
    script.setAttribute("data-mapping", "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "bottom")
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light")
    script.setAttribute("data-lang", "zh-CN")
    script.setAttribute("crossorigin", "anonymous")

    // 如果用户已登录，添加会话信息
    if (session?.user) {
      script.setAttribute(
        "data-session",
        JSON.stringify({
          username: session.user.name || "用户",
          email: session.user.email || "",
          avatar: session.user.image || "",
        }),
      )
    }

    script.async = true

    // 添加到页面
    if (commentsDiv) {
      commentsDiv.appendChild(script)
    }

    return () => {
      // 清理函数
      if (commentsDiv) {
        while (commentsDiv.firstChild) {
          commentsDiv.removeChild(commentsDiv.firstChild)
        }
      }
    }
  }, [resolvedTheme, mounted, session])

  if (!mounted) return null

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-xl font-semibold mb-4">评论区</h3>
      <div id="giscus-comments" className="mt-2" />
    </div>
  )
}

