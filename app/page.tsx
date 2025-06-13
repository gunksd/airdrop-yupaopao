"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageSquare, Loader2 } from "lucide-react"
import { AirdropCard } from "@/components/airdrop-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { airdrops as fallbackAirdrops } from "@/lib/airdrops-data" // 导入本地数据作为备用

export default function Home() {
  const [airdrops, setAirdrops] = useState(fallbackAirdrops) // 使用本地数据作为初始状态
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/airdrops")

        if (!response.ok) {
          throw new Error("获取空投项目失败")
        }

        const data = await response.json()

        // 检查返回的数据是否有效
        if (data && Array.isArray(data.airdrops) && data.airdrops.length > 0) {
          setAirdrops(data.airdrops)
        } else {
          console.warn("API返回的数据格式不正确，使用本地数据")
          // 保持使用本地数据
        }
      } catch (err) {
        console.error("加载空投项目时出错:", err)
        // 出错时不设置错误状态，继续使用本地数据
        console.warn("使用本地数据作为备用")
      } finally {
        setLoading(false)
      }
    }

    fetchAirdrops()
  }, [])

  // 只显示前6个项目
  const featuredAirdrops = airdrops.slice(0, 6)

  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">鱼泡泡的空投聚合器</h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  主业撸毛/副业屯币/努力研究新项目/绝不偏见 慢慢发财，走向致富路
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:items-start">
                <Link href="/airdrops" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto inline-flex h-12 items-center justify-center text-base px-8">
                    查看空投项目
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/discussions" className="w-full sm:w-auto">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button className="relative w-full sm:w-auto px-8 py-3 bg-black dark:bg-gray-900 rounded-lg leading-none flex items-center justify-center space-x-3 text-white">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-base font-medium">参与讨论</span>
                    </button>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary/10 shadow-xl">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-V5mxq70ZjiiRLppAyW22t00G5DEtG5.png"
                  fill
                  alt="鱼泡泡"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">热门空投项目</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                发现最新、最热门的空投项目，从这里开始你的空投之旅
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg">加载中...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mt-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : featuredAirdrops.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">暂无空投项目</div>
          ) : (
            <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredAirdrops.map((airdrop) => (
                <AirdropCard
                  key={airdrop.id || airdrop.name}
                  name={airdrop.name}
                  link={airdrop.link}
                  icon={airdrop.icon}
                  description={airdrop.description}
                  status={airdrop.status}
                  releaseDate={airdrop.releaseDate}
                  airdropDate={airdrop.airdropDate}
                  profit={airdrop.profit}
                  twitterLink={airdrop.twitterLink}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link href="/airdrops">
              <Button variant="outline" size="lg" className="group">
                查看全部项目
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
