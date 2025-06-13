import { NextResponse } from "next/server"
import { airdrops } from "@/lib/airdrops-data"

// 使用 Edge 运行时以提高兼容性
export const runtime = "edge"

// 获取所有空投项目
export async function GET() {
  try {
    // 直接返回本地数据，避免 Supabase 连接问题
    return NextResponse.json({ airdrops })
  } catch (error) {
    console.error("获取空投项目失败:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
