"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GiscusComments } from "@/components/giscus-comments"
import {
  PlusCircle,
  RefreshCw,
  MessageSquare,
  FileText,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Info,
  DollarSign,
} from "lucide-react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { useSession } from "next-auth/react"
import { DiscussionList } from "@/components/discussion-list"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function DiscussionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { data: session } = useSession()

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleCreatePostSuccess = () => {
    setIsDialogOpen(false)
    handleRefresh()
  }

  return (
    <div className="container py-12 pb-24 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 主要内容区域 */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out flex-1",
            sidebarOpen ? "md:max-w-[calc(100%-272px)]" : "md:max-w-full",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">讨论区</h1>
              <p className="text-muted-foreground">与其他成员分享和讨论空投项目</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} title="刷新">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    发起讨论
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>发起新讨论</DialogTitle>
                    <DialogDescription>分享你的想法、问题或发现的空投项目</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <MarkdownEditor
                      onSubmitSuccess={handleCreatePostSuccess}
                      placeholder="在这里输入你的讨论内容，支持 Markdown 格式..."
                      buttonText="发布讨论"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="articles" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  社区文章
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  评论区
                </TabsTrigger>
              </TabsList>
              <TabsContent value="articles" className="mt-6">
                <div className="mb-8">
                  <MarkdownEditor
                    onSubmitSuccess={handleRefresh}
                    placeholder="分享你的想法或问题，支持 Markdown 格式..."
                  />
                </div>
                <DiscussionList key={refreshKey} />
              </TabsContent>
              <TabsContent value="comments">
                <GiscusComments />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className="relative">
          {/* 侧边栏内容 */}
          <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              "w-full md:w-64 space-y-4",
              sidebarOpen ? "opacity-100 translate-x-0" : "md:w-8 md:opacity-0 md:invisible md:h-0 md:overflow-hidden",
            )}
          >
            {/* Sponsor卡片 */}
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">Sponsor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-3">
                  如果你觉得这些项目对你带来了某些帮助的话，可以打赏我一杯咖啡！
                </p>
                <Link href="/donate">
                  <Button className="w-full h-8 text-xs" variant="outline">
                    <Coffee className="mr-2 h-3 w-3" />
                    赞赏支持
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 社区指南卡片 */}
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">社区指南</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• 请保持友善和尊重</li>
                  <li>• 分享有价值的信息</li>
                  <li>• 禁止发布垃圾内容</li>
                  <li>• 欢迎积极讨论和提问</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 收起/展开按钮 */}
          <div className="hidden md:block absolute top-0 left-0 -ml-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full shadow-sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "收起侧边栏" : "展开侧边栏"}
            >
              {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* 收起状态下的侧边标签 */}
          <div
            className={cn(
              "hidden md:flex flex-col gap-2 absolute top-0 left-0",
              "transition-all duration-300 ease-in-out",
              sidebarOpen ? "opacity-0 invisible" : "opacity-100 visible",
            )}
          >
            <div className="border rounded-md bg-card shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 py-6 h-auto w-8 flex flex-col items-center justify-center"
                onClick={() => setSidebarOpen(true)}
                title="展开侧边栏"
              >
                <ChevronLeft className="h-4 w-4 mb-2" />
                <span className="text-xs vertical-text">侧边栏</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
