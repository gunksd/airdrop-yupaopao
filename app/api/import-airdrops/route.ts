import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { isAdmin } from "@/lib/auth-utils"
import { airdrops } from "@/lib/airdrops-data"

// 指定运行时为 Node.js
export const runtime = "nodejs"

// 导入所有空投项目到数据库
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // 检查用户是否已登录且是管理员
    if (!session || !session.user || !isAdmin(session.user.name)) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    const results = []

    // 逐个导入项目
    for (const airdrop of airdrops) {
      // 检查项目是否已存在（通过名称）
      const { data: existingAirdrop } = await supabase
        .from("airdrops")
        .select("id")
        .eq("name", airdrop.name)
        .maybeSingle()

      if (existingAirdrop) {
        // 项目已存在，跳过
        results.push({ name: airdrop.name, status: "skipped", id: existingAirdrop.id })
        continue
      }

      // 插入新项目
      const { data, error } = await supabase
        .from("airdrops")
        .insert([
          {
            name: airdrop.name,
            link: airdrop.link,
            icon: airdrop.icon,
            description: airdrop.description,
            status: airdrop.status,
            release_date: airdrop.releaseDate || null,
            airdrop_date: airdrop.airdropDate || null,
            profit: airdrop.profit || null,
            twitter_link: airdrop.twitterLink || null,
            funding: airdrop.funding || null,
            created_by: session.user.name || "管理员",
          },
        ])
        .select()
        .single()

      if (error) {
        console.error(`导入 ${airdrop.name} 失败:`, error)
        results.push({ name: airdrop.name, status: "error", error: error.message })
      } else {
        results.push({ name: airdrop.name, status: "imported", id: data.id })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      total: airdrops.length,
      imported: results.filter((r) => r.status === "imported").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
    })
  } catch (error) {
    console.error("导入空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
