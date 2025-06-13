import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const imageUrl = url.searchParams.get("url")

    if (!imageUrl) {
      return NextResponse.json({ error: "缺少URL参数" }, { status: 400 })
    }

    // 创建自定义请求头，模拟来自RootData的请求
    const headers = new Headers()
    headers.append("Referer", "https://www.rootdata.com/")
    headers.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    )
    headers.append("Origin", "https://www.rootdata.com")

    // 获取图片
    const response = await fetch(imageUrl, {
      headers,
      cache: "force-cache", // 强制缓存响应
    })

    if (!response.ok) {
      console.error(`获取图片失败: ${response.status} ${response.statusText}`)
      // 返回一个JSON错误而不是重定向
      return NextResponse.json({ error: "获取图片失败", status: response.status }, { status: 400 })
    }

    // 获取图片内容类型
    const contentType = response.headers.get("content-type") || "image/jpeg"

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer()

    // 返回图片，并设置缓存头
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // 缓存24小时
        "Access-Control-Allow-Origin": "*", // 允许任何源访问
      },
    })
  } catch (error) {
    console.error("图片代理错误:", error)
    // 返回JSON错误而不是重定向
    return NextResponse.json({ error: "处理图片时出错" }, { status: 500 })
  }
}
