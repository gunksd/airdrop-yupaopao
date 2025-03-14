import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { isAdmin } from "@/lib/auth-utils"
import type { Airdrop } from "@/lib/airdrops-data"

// 指定运行时为 Node.js
export const runtime = "nodejs"

// 获取所有空投项目
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // 从 Supabase 获取空投项目
    const { data, error } = await supabase.from("airdrops").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "获取空投项目失败" }, { status: 500 })
    }

    // 将数据库格式转换为前端格式
    const airdrops: Airdrop[] = data.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      link: item.link,
      icon: item.icon,
      description: item.description,
      status: item.status as "进行中" | "结束",
      releaseDate: item.release_date || undefined,
      airdropDate: item.airdrop_date || undefined,
      profit: item.profit || undefined,
      twitterLink: item.twitter_link || undefined,
      funding: item.funding || undefined,
    }))

    return NextResponse.json({ airdrops })
  } catch (error) {
    console.error("获取空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

// 添加新空投项目
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 检查用户是否已登录且是管理员
    if (!session || !session.user || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
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

    // 插入空投项目到 Supabase
    const { data, error } = await supabase
      .from("airdrops")
      .insert([
        {
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
          created_by: session.user.name || "管理员",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase 错误:", error)
      return NextResponse.json({ error: "添加空投项目失败" }, { status: 500 })
    }

    // 转换为前端格式
    const airdrop: Airdrop = {
      id: data.id.toString(),
      name: data.name,
      link: data.link,
      icon: data.icon,
      description: data.description,
      status: data.status as "进行中" | "结束",
      releaseDate: data.release_date || undefined,
      airdropDate: data.airdrop_date || undefined,
      profit: data.profit || undefined,
      twitterLink: data.twitter_link || undefined,
      funding: data.funding || undefined,
    }

    return NextResponse.json({ success: true, airdrop })
  } catch (error) {
    console.error("添加空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

