import { createClient } from "@supabase/supabase-js"

// 服务器端使用的 Supabase 客户端
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient(supabaseUrl, supabaseServiceKey)
}
