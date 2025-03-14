import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "未找到文件" }, { status: 400 })
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只支持上传图片" }, { status: 400 })
    }

    // 验证文件大小（例如：限制为 5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过 5MB" }, { status: 400 })
    }

    // 生成唯一的文件名
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`

    // 使用 Vercel Blob 上传文件
    const blob = await put(fileName, file, {
      access: "public",
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("上传失败:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "服务器错误" }, { status: 500 })
  }
}

