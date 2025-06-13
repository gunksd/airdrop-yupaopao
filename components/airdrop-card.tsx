"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Calendar, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AirdropCardProps {
  name: string
  link: string
  icon: string
  description: string
  status: "进行中" | "结束"
  releaseDate?: string
  airdropDate?: string
  profit?: string
  twitterLink?: string
}

export function AirdropCard({
  name,
  link,
  icon,
  description,
  status,
  releaseDate,
  airdropDate,
  profit,
  twitterLink,
}: AirdropCardProps) {
  const [imageError, setImageError] = useState(false)

  // 处理点击卡片的事件
  const handleCardClick = () => {
    window.open(link, "_blank", "noopener,noreferrer")
  }

  // 处理点击Twitter链接的事件，阻止事件冒泡
  const handleTwitterClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡到卡片
    if (twitterLink) {
      window.open(twitterLink, "_blank", "noopener,noreferrer")
    }
  }

  // 创建一个备用图标URL，使用项目名称的首字母
  const fallbackIconUrl = `https://placehold.co/48x48/4f46e5/ffffff?text=${name.charAt(0).toUpperCase()}`

  // 使用代理URL处理RootData图片
  const proxyIconUrl = useMemo(() => {
    if (!icon) return fallbackIconUrl
    if (imageError) return fallbackIconUrl

    // 检查是否是RootData的URL
    if (icon.includes("rootdata.com")) {
      return `/api/image-proxy?url=${encodeURIComponent(icon)}`
    }

    return icon
  }, [icon, fallbackIconUrl, imageError])

  return (
    <Card
      className="h-full overflow-hidden transition-colors hover:bg-muted/50 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <Image
              src={proxyIconUrl || "/placeholder.svg"}
              alt={name}
              width={48}
              height={48}
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground">
              <span className="text-lg font-bold">{name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {name}
              <ExternalLink className="h-4 w-4" />
            </CardTitle>
            <Badge variant={status === "进行中" ? "default" : "secondary"}>{status}</Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {(releaseDate || airdropDate || profit) && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {releaseDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>发布: {releaseDate}</span>
                </div>
              )}
              {airdropDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>空投: {airdropDate}</span>
                </div>
              )}
              {profit && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{profit}</span>
                </div>
              )}
            </div>
          )}
          {twitterLink && (
            <div className="mt-2">
              <Button
                variant="link"
                className="p-0 h-auto text-xs text-blue-500 hover:underline"
                onClick={handleTwitterClick}
              >
                查看教程
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
