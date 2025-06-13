"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import type { Airdrop } from "@/lib/airdrops-data"

interface AirdropFormProps {
  initialData?: Airdrop
  onSubmit: (data: Omit<Airdrop, "id">) => Promise<void>
  isSubmitting: boolean
  buttonText: string
}

export function AirdropForm({ initialData, onSubmit, isSubmitting, buttonText }: AirdropFormProps) {
  const [formData, setFormData] = useState<Omit<Airdrop, "id">>({
    name: initialData?.name || "",
    link: initialData?.link || "",
    icon: initialData?.icon || "",
    description: initialData?.description || "",
    status: initialData?.status || "进行中",
    releaseDate: initialData?.releaseDate || "",
    airdropDate: initialData?.airdropDate || "",
    profit: initialData?.profit || "",
    twitterLink: initialData?.twitterLink || "",
    funding: initialData?.funding || "",
  })

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.icon || null)
  const [imageError, setImageError] = useState(false)
  const [isCheckingImage, setIsCheckingImage] = useState(false)
  const [imageCheckResult, setImageCheckResult] = useState<{ valid: boolean; message?: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // 当图标URL改变时，重置图片预览状态
    if (name === "icon") {
      setImagePreview(value)
      setImageError(false)
      setImageCheckResult(null)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // 检查图片URL是否有效
  const checkImageUrl = async () => {
    if (!formData.icon) return

    setIsCheckingImage(true)
    setImageCheckResult(null)

    try {
      const response = await fetch("/api/check-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formData.icon }),
      })

      const data = await response.json()

      if (data.valid) {
        setImageCheckResult({ valid: true, message: "图片URL有效" })
      } else {
        setImageCheckResult({ valid: false, message: `图片URL无效: ${data.status || data.error || "未知错误"}` })
      }
    } catch (error) {
      setImageCheckResult({ valid: false, message: "检查图片URL时出错" })
    } finally {
      setIsCheckingImage(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">项目名称 *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="link">项目链接 *</Label>
          <Input id="link" name="link" value={formData.link} onChange={handleChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">图标链接 *</Label>
        <div className="flex gap-2">
          <Input id="icon" name="icon" value={formData.icon} onChange={handleChange} required />
          <Button type="button" variant="outline" onClick={checkImageUrl} disabled={isCheckingImage || !formData.icon}>
            {isCheckingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "检查"}
          </Button>
        </div>

        {imageCheckResult && (
          <Alert variant={imageCheckResult.valid ? "default" : "destructive"} className="mt-2">
            <div className="flex items-center gap-2">
              {imageCheckResult.valid ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>{imageCheckResult.message}</AlertDescription>
            </div>
          </Alert>
        )}

        {formData.icon && (
          <div className="mt-2 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted flex items-center justify-center">
              {!imageError ? (
                <Image
                  src={imagePreview || ""}
                  alt="图标预览"
                  width={48}
                  height={48}
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">{formData.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">图标预览</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">项目描述 *</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">状态 *</Label>
          <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="进行中">进行中</SelectItem>
              <SelectItem value="结束">结束</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="releaseDate">发布日期</Label>
          <Input
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            placeholder="YYYY/MM/DD"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="airdropDate">空投日期</Label>
          <Input
            id="airdropDate"
            name="airdropDate"
            value={formData.airdropDate}
            onChange={handleChange}
            placeholder="YYYY/MM/DD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profit">收益</Label>
          <Input id="profit" name="profit" value={formData.profit} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitterLink">Twitter教程链接</Label>
        <Input id="twitterLink" name="twitterLink" value={formData.twitterLink} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="funding">融资信息</Label>
        <Input id="funding" name="funding" value={formData.funding} onChange={handleChange} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            提交中...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  )
}
