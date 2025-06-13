"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
        <Input id="icon" name="icon" value={formData.icon} onChange={handleChange} required />
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

