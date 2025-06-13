"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { ThumbsUp, AlertCircle, Loader2, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { marked } from "marked"
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
import { ADMIN_TWITTER_USERNAMES } from "@/lib/auth-utils"

interface Author {
  name: string
  image: string
  email: string
}

interface Discussion {
  id: string
  content: string
  author: Author
  createdAt: string
  likes: number
}

export function DiscussionList() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likingId, setLikingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  // 配置 marked 选项
  useEffect(() => {
    marked.setOptions({
      breaks: true, // 启用换行符转换为 <br>
      gfm: true, // 启用 GitHub 风格的 Markdown
      sanitize: false, // 不要过滤 HTML 标签
    })
  }, [])

  const fetchDiscussions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/discussions")

      if (!response.ok) {
        throw new Error("获取讨论失败")
      }

      const data = await response.json()
      setDiscussions(data.discussions || [])
    } catch (err) {
      setError("加载讨论时出错")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscussions()
  }, [])

  const handleLike = async (id: string) => {
    if (!session) {
      toast({
        title: "请先登录",
        description: "登录后才能点赞",
        variant: "destructive",
      })
      return
    }

    try {
      setLikingId(id)
      const response = await fetch("/api/discussions/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("点赞失败")
      }

      const data = await response.json()

      // 更新本地状态
      setDiscussions((prev) =>
        prev.map((discussion) => (discussion.id === id ? { ...discussion, likes: data.likes } : discussion)),
      )

      toast({
        title: "点赞成功",
        description: "感谢您的支持",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "点赞失败",
        description: "请稍后再试",
        variant: "destructive",
      })
    } finally {
      setLikingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/discussions/${deletingId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "删除失败")
      }

      // 更新本地状态
      setDiscussions((prev) => prev.filter((discussion) => discussion.id !== deletingId))

      toast({
        title: "删除成功",
        description: "文章已成功删除",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "删除失败",
        description: err instanceof Error ? err.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
      setShowDeleteAlert(false)
    }
  }

  // 检查用户是否可以删除讨论
  const canDelete = (discussion: Discussion) => {
    if (!session || !session.user) return false

    // 作者可以删除自己的讨论
    const isAuthor = discussion.author.email === session.user.email

    // 管理员可以删除任何讨论
    const twitterUsername = session.user.name?.toLowerCase() || ""
    const isAdmin = ADMIN_TWITTER_USERNAMES.includes(twitterUsername)

    return isAuthor || isAdmin
  }

  // 将 Markdown 转换为 HTML
  const renderMarkdown = (content: string) => {
    try {
      return { __html: marked(content) }
    } catch (error) {
      console.error("Markdown 解析错误:", error)
      return { __html: content }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (discussions.length === 0) {
    return <div className="text-center text-muted-foreground">暂无讨论，成为第一个发起讨论的人吧！</div>
  }

  return (
    <>
      <div className="space-y-4">
        {discussions.map((discussion) => (
          <Card key={discussion.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={discussion.author.image} alt={discussion.author.name} />
                    <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{discussion.author.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{formatDate(discussion.createdAt)}</p>
                  </div>
                </div>
                {canDelete(discussion) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setDeletingId(discussion.id)
                      setShowDeleteAlert(true)
                    }}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    删除
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={renderMarkdown(discussion.content)} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleLike(discussion.id)}
                  disabled={likingId === discussion.id}
                >
                  {likingId === discussion.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ThumbsUp className="h-4 w-4" />
                  )}
                  <span>{discussion.likes}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>你确定要删除这篇文章吗？此操作无法撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
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
    </>
  )
}
