"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Filter, Loader2, AlertTriangle } from "lucide-react"
import { AirdropCard } from "@/components/airdrop-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Airdrop } from "@/lib/airdrops-data"

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>(["进行中", "结束"])

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/airdrops")

        if (!response.ok) {
          throw new Error("获取空投项目失败")
        }

        const data = await response.json()
        setAirdrops(data.airdrops || [])
      } catch (err) {
        console.error("加载空投项目时出错:", err)
        setError("加载空投项目时出错，请稍后再试")
      } finally {
        setLoading(false)
      }
    }

    fetchAirdrops()
  }, [])

  const filteredAirdrops = airdrops.filter(
    (airdrop) =>
      (airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        airdrop.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      statusFilter.includes(airdrop.status),
  )

  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">空投项目</h1>
        <p className="text-muted-foreground">发现最新的空投机会，共 {airdrops.length} 个项目</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索项目..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                筛选
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("进行中")}
                onCheckedChange={(checked) => {
                  setStatusFilter(checked ? [...statusFilter, "进行中"] : statusFilter.filter((s) => s !== "进行中"))
                }}
              >
                进行中
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("结束")}
                onCheckedChange={(checked) => {
                  setStatusFilter(checked ? [...statusFilter, "结束"] : statusFilter.filter((s) => s !== "结束"))
                }}
              >
                结束
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      ) : (
        <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAirdrops.map((airdrop) => (
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

      {!loading && !error && filteredAirdrops.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">没有找到匹配的项目</p>
        </div>
      )}
    </div>
  )
}

