import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase-server"

// 指定运行时为 Node.js
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 插入讨论到 Supabase
    const { data, error } = await supabase
      .from("discussions")
      .insert([
        {
          content,
          author_name: session.user.name || "匿名用户",
          author_image: session.user.image || "",
          author_email: session.user.email || "",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "存储讨论失败" }, { status: 500 })
    }

    // 格式化返回数据
    const discussion = {
      id: data.id,
      content: data.content,
      author: {
        name: data.author_name,
        image: data.author_image,
        email: data.author_email,
      },
      createdAt: data.created_at,
      likes: data.likes,
    }

    return NextResponse.json({ success: true, discussion })
  } catch (error) {
    console.error("创建讨论失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // 从 Supabase 获取讨论
    const { data, error } = await supabase.from("discussions").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "获取讨论失败" }, { status: 500 })
    }

    // 格式化返回数据
    const discussions = data.map((item) => ({
      id: item.id,
      content: item.content,
      author: {
        name: item.author_name,
        image: item.author_image,
        email: item.author_email,
      },
      createdAt: item.created_at,
      likes: item.likes,
    }))

    return NextResponse.json({ discussions })
  } catch (error) {
    console.error("获取讨论失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
