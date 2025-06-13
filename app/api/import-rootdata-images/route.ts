import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { isAdmin } from "@/lib/auth-utils"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 检查用户是否已登录且是管理员
    if (!session || !session.user || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // 获取所有空投项目
    const { data: airdrops, error } = await supabase.from("airdrops").select("id, icon")

    if (error) {
      console.error("获取空投项目失败:", error)
      return NextResponse.json({ error: "获取空投项目失败" }, { status: 500 })
    }

    const results = []

    // 创建自定义请求头，模拟来自RootData的请求
    const headers = new Headers()
    headers.append("Referer", "https://www.rootdata.com/")
    headers.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )
    headers.append("Origin", "https://www.rootdata.com")

    // 处理每个项目的图标
    for (const airdrop of airdrops) {
      // 跳过非RootData图片或空图片URL
      if (!airdrop.icon || !airdrop.icon.includes("rootdata.com")) {
        results.push({ id: airdrop.id, status: "skipped", message: "非RootData图片" })
        continue
      }

      try {
        // 获取图片
        const response = await fetch(airdrop.icon, {
          headers,
          method: "GET", // 明确指定GET方法
        })

        if (!response.ok) {
          results.push({ id: airdrop.id, status: "error", message: `获取图片失败: ${response.status}` })
          continue
        }

        // 获取图片内容类型和数据
        const contentType = response.headers.get("content-type") || "image/jpeg"

        // 检查内容类型是否为图片
        if (!contentType.startsWith("image/")) {
          results.push({ id: airdrop.id, status: "error", message: `非图片内容类型: ${contentType}` })
          continue
        }

        const imageBuffer = await response.arrayBuffer()

        // 生成文件名
        const fileName = `rootdata-${Date.now()}-${airdrop.id}.${contentType.split("/")[1] || "jpg"}`

        // 上传到Vercel Blob
        const blob = await put(fileName, new Blob([imageBuffer], { type: contentType }), {
          access: "public",
          contentType,
        })

        // 更新数据库中的图标URL
        const { error: updateError } = await supabase.from("airdrops").update({ icon: blob.url }).eq("id", airdrop.id)

        if (updateError) {
          results.push({ id: airdrop.id, status: "error", message: `更新数据库失败: ${updateError.message}` })
        } else {
          results.push({ id: airdrop.id, status: "success", oldUrl: airdrop.icon, newUrl: blob.url })
        }
      } catch (err) {
        console.error(`处理项目 ${airdrop.id} 的图片时出错:`, err)
        results.push({ id: airdrop.id, status: "error", message: err instanceof Error ? err.message : "未知错误" })
      }
    }

    return NextResponse.json({
      success: true,
      total: airdrops.length,
      processed: results.length,
      succeeded: results.filter((r) => r.status === "success").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      failed: results.filter((r) => r.status === "error").length,
      results,
    })
  } catch (error) {
    console.error("导入RootData图片失败:", error)
    return NextResponse.json(
      { error: "服务器错误", message: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
