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

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "讨论ID不能为空" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 获取当前点赞数
    const { data: currentData, error: fetchError } = await supabase
      .from("discussions")
      .select("likes")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("获取讨论失败:", fetchError)
      return NextResponse.json({ error: "获取讨论失败" }, { status: 500 })
    }

    // 更新点赞数
    const newLikes = (currentData.likes || 0) + 1

    const { data, error } = await supabase
      .from("discussions")
      .update({ likes: newLikes })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("更新点赞失败:", error)
      return NextResponse.json({ error: "更新点赞失败" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      likes: data.likes,
    })
  } catch (error) {
    console.error("点赞失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

