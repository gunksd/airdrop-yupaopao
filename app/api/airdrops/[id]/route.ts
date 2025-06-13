import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { isAdmin } from "@/lib/auth-utils"

// 指定运行时为 Node.js
export const runtime = "nodejs"

// 获取单个空投项目
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "项目ID不能为空" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 从 Supabase 获取空投项目
    const { data, error } = await supabase.from("airdrops").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "获取空投项目失败" }, { status: 500 })
    }

    return NextResponse.json({ airdrop: data })
  } catch (error) {
    console.error("获取空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

// 更新空投项目
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // 检查用户是否已登录且是管理员（使用Twitter用户名）
    if (!session || !session.user || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "项目ID不能为空" }, { status: 400 })
    }

    const airdropData = await request.json()

    // 验证必填字段
    if (
      !airdropData.name ||
      !airdropData.link ||
      !airdropData.icon ||
      !airdropData.description ||
      !airdropData.status
    ) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 更新 Supabase 中的空投项目
    const { data, error } = await supabase
      .from("airdrops")
      .update({
        name: airdropData.name,
        link: airdropData.link,
        icon: airdropData.icon,
        description: airdropData.description,
        status: airdropData.status,
        release_date: airdropData.releaseDate || null,
        airdrop_date: airdropData.airdropDate || null,
        profit: airdropData.profit || null,
        twitter_link: airdropData.twitterLink || null,
        funding: airdropData.funding || null,
        updated_at: new Date().toISOString(),
        updated_by: session.user.name || "管理员",
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "更新空投项目失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true, airdrop: data })
  } catch (error) {
    console.error("更新空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

// 删除空投项目
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // 检查用户是否已登录且是管理员（使用Twitter用户名）
    if (!session || !session.user || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "项目ID不能为空" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // 从 Supabase 删除空投项目
    const { error } = await supabase.from("airdrops").delete().eq("id", id)

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "删除空投项目失败" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("删除空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
