import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ADMIN_TWITTER_USERNAMES } from "@/lib/auth-utils"

// 指定运行时为 Node.js
export const runtime = "nodejs"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "讨论ID不能为空" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 首先获取讨论详情
    const { data: discussion, error: fetchError } = await supabase.from("discussions").select("*").eq("id", id).single()

    if (fetchError) {
      console.error("获取讨论失败:", fetchError)
      return NextResponse.json({ error: "获取讨论失败" }, { status: 500 })
    }

    // 检查是否是作者
    const isAuthor = discussion.author_email === session.user.email

    // 检查是否是管理员（通过 Twitter 用户名）
    const twitterUsername = session.user.name?.toLowerCase() || ""
    const isAdmin = ADMIN_TWITTER_USERNAMES.includes(twitterUsername)

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: "没有权限删除此讨论" }, { status: 403 })
    }

    // 删除讨论
    const { error } = await supabase.from("discussions").delete().eq("id", id)

    if (error) {
      console.error("删除讨论失败:", error)
      return NextResponse.json({ error: "删除讨论失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除讨论失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
