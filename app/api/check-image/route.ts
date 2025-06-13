import { NextResponse } from "next/server"

export const runtime = "nodejs"

// 检查图片URL是否可访问
export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL不能为空" }, { status: 400 })
    }

    try {
      // 尝试获取图片头信息
      const response = await fetch(url, { method: "HEAD" })

      // 检查响应状态
      if (response.ok) {
        return NextResponse.json({ valid: true })
      } else {
        return NextResponse.json({ valid: false, status: response.status })
      }
    } catch (error) {
      console.error("检查图片URL失败:", error)
      return NextResponse.json({ valid: false, error: "无法访问图片URL" })
    }
  } catch (error) {
    console.error("服务器错误:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
