"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Bold, Italic, List, ListOrdered, LinkIcon, ImageIcon, Loader2, HelpCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface MarkdownEditorProps {
  onSubmitSuccess?: () => void
  placeholder?: string
  buttonText?: string
}

export function MarkdownEditor({
  onSubmitSuccess,
  placeholder = "在这里输入内容...",
  buttonText = "发布",
}: MarkdownEditorProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim()) return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "发布失败")
      }

      toast({
        title: "发布成功",
        description: "你的讨论已成功发布",
      })

      setContent("")
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error("提交失败:", error)
      toast({
        title: "发布失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    try {
      setIsUploading(true)

      // 创建一个 FormData 对象
      const formData = new FormData()
      formData.append("file", file)

      // 发送请求到我们的上传 API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "上传失败")
      }

      const data = await response.json()

      // 在编辑器中插入图片 Markdown
      insertMarkdown(`![${file.name}](${data.url})`, "")

      toast({
        title: "上传成功",
        description: "图片已成功上传",
      })
    } catch (error) {
      console.error("上传失败:", error)
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const insertMarkdown = (prefix: string, suffix = "") => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    const newText = beforeText + prefix + selectedText + suffix + afterText
    setContent(newText)

    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  return (
    <Card className="p-4">
      {!session ? (
        <div className="text-center p-4 text-muted-foreground">请登录后发表评论</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => insertMarkdown("**", "**")} title="加粗">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertMarkdown("*", "*")} title="斜体">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertMarkdown("\n- ")} title="无序列表">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertMarkdown("\n1. ")} title="有序列表">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertMarkdown("[", "](链接地址)")} title="链接">
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="上传图片"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageUpload(file)
                  }
                }}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowHelp(!showHelp)} title="Markdown 帮助">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>

          {showHelp && (
            <div className="bg-muted p-3 rounded-md mb-2 text-xs">
              <p className="font-medium mb-1">Markdown 语法帮助:</p>
              <ul className="space-y-1">
                <li>
                  <code>**粗体**</code> - <strong>粗体</strong>
                </li>
                <li>
                  <code>*斜体*</code> - <em>斜体</em>
                </li>
                <li>
                  <code>[链接文字](URL)</code> - 链接
                </li>
                <li>
                  <code>![图片描述](图片URL)</code> - 图片
                </li>
                <li>
                  <code># 标题</code> - 一级标题
                </li>
                <li>
                  <code>## 标题</code> - 二级标题
                </li>
                <li>
                  <code>- 列表项</code> - 无序列表
                </li>
                <li>
                  <code>1. 列表项</code> - 有序列表
                </li>
                <li>
                  <code>```代码块```</code> - 代码块
                </li>
              </ul>
            </div>
          )}

          <Textarea
            id="markdown-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[150px] mb-2 font-mono"
          />
          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-foreground">支持 Markdown 格式和图片上传</div>
            <Button onClick={handleSubmit} disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发布中...
                </>
              ) : (
                buttonText
              )}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}

