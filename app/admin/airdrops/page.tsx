"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Search, Edit, Trash, AlertTriangle, Download, Database } from "lucide-react"
import { AirdropForm } from "@/components/airdrop-form"
import { useToast } from "@/hooks/use-toast"
import { isAdmin } from "@/lib/auth-utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Airdrop } from "@/lib/airdrops-data"

export default function AdminAirdropsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [airdrops, setAirdrops] = useState<Airdrop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAirdrop, setCurrentAirdrop] = useState<Airdrop | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isImportingImages, setIsImportingImages] = useState(false)

  // 检查用户是否是管理员（使用Twitter用户名）
  useEffect(() => {
    if (status === "loading") return

    if (!session || !isAdmin(session.user?.name)) {
      router.push("/")
      toast({
        title: "访问被拒绝",
        description: "您没有权限访问此页面",
        variant: "destructive",
      })
    } else {
      console.log("管理员登录成功:", session.user?.name)
    }
  }, [session, status, router, toast])

  // 获取空投项目列表
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
      setError("加载空投项目时出错")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session && isAdmin(session.user?.name)) {
      fetchAirdrops()
    }
  }, [session])

  // 处理添加空投项目
  const handleAddAirdrop = async (airdrop: Omit<Airdrop, "id">) => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/airdrops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airdrop),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "添加空投项目失败")
      }

      toast({
        title: "添加成功",
        description: "空投项目已成功添加",
      })

      setIsAddDialogOpen(false)
      fetchAirdrops()
    } catch (err) {
      console.error(err)
      toast({
        title: "添加失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理编辑空投项目
  const handleEditAirdrop = async (airdrop: Airdrop) => {
    if (!currentAirdrop) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/airdrops/${currentAirdrop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airdrop),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "编辑空投项目失败")
      }

      toast({
        title: "编辑成功",
        description: "空投项目已成功更新",
      })

      setIsEditDialogOpen(false)
      fetchAirdrops()
    } catch (err) {
      console.error(err)
      toast({
        title: "编辑失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 处理删除空投项目
  const handleDeleteAirdrop = async () => {
    if (!currentAirdrop) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/airdrops/${currentAirdrop.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "删除空投项目失败")
      }

      toast({
        title: "删除成功",
        description: "空投项目已成功删除",
      })

      setIsDeleteDialogOpen(false)
      fetchAirdrops()
    } catch (err) {
      console.error(err)
      toast({
        title: "删除失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 导入所有项目
  const handleImportAll = async () => {
    try {
      setIsImporting(true)
      const response = await fetch("/api/import-airdrops", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "导入项目失败")
      }

      const data = await response.json()

      toast({
        title: "导入成功",
        description: `成功导入 ${data.imported} 个项目，跳过 ${data.skipped} 个已存在项目，失败 ${data.errors} 个项目`,
      })

      fetchAirdrops()
    } catch (err) {
      console.error(err)
      toast({
        title: "导入失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleImportRootDataImages = async () => {
    try {
      setIsImportingImages(true)
      const response = await fetch("/api/import-rootdata-images", {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "导入RootData图片失败")
      }

      const data = await response.json()

      toast({
        title: "导入成功",
        description: `成功处理 ${data.succeeded} 个图片，跳过 ${data.skipped} 个，失败 ${data.failed} 个`,
      })

      fetchAirdrops() // 刷新列表
    } catch (err) {
      console.error(err)
      toast({
        title: "导入失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsImportingImages(false)
    }
  }

  // 过滤空投项目
  const filteredAirdrops = airdrops.filter(
    (airdrop) =>
      airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      airdrop.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 如果用户不是管理员，不显示任何内容
  if (status !== "loading" && (!session || !isAdmin(session.user?.name))) {
    return null
  }

  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">管理空投项目</h1>
            <p className="text-muted-foreground">添加、编辑或删除空投项目</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              添加项目
            </Button>
            <Button onClick={handleImportAll} disabled={isImporting} variant="outline">
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  导入现有项目
                </>
              )}
            </Button>
            <Button onClick={handleImportRootDataImages} disabled={isImportingImages} variant="outline">
              {isImportingImages ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  导入RootData图片
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索项目..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[250px]" />
                    </div>
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredAirdrops.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">没有找到匹配的项目</div>
        ) : (
          <div className="space-y-4">
            {filteredAirdrops.map((airdrop) => (
              <Card key={airdrop.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{airdrop.name}</h3>
                      <p className="text-sm text-muted-foreground">{airdrop.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentAirdrop(airdrop)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCurrentAirdrop(airdrop)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 添加空投项目对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>添加空投项目</DialogTitle>
            <DialogDescription>填写以下表单添加新的空投项目</DialogDescription>
          </DialogHeader>
          <AirdropForm onSubmit={handleAddAirdrop} isSubmitting={isSubmitting} buttonText="添加项目" />
        </DialogContent>
      </Dialog>

      {/* 编辑空投项目对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑空投项目</DialogTitle>
            <DialogDescription>修改空投项目信息</DialogDescription>
          </DialogHeader>
          {currentAirdrop && (
            <AirdropForm
              initialData={currentAirdrop}
              onSubmit={handleEditAirdrop}
              isSubmitting={isSubmitting}
              buttonText="保存修改"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除 "{currentAirdrop?.name}" 项目吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAirdrop}
              className="bg-destructive text-destructive-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                "删除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
