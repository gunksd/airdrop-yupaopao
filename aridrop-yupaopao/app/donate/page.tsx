"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export default function DonatePage() {
  const btcAddress = "bc1pwswdr8jand4v8a45wuauzr6tc2fl92k7qxveqxjlk6mphmkyz3cszsj8cl"
  const evmAddress = "0x41d5408ce2b7dfd9490c0e769edd493dc878058f"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold">Sponsor</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          如果你觉得这些项目对你带来了某些帮助的话，可以打赏我一杯咖啡！欢迎大家在评论区积极讨论！
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">BTC 地址</h3>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <code className="flex-1 text-sm break-all">{btcAddress}</code>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(btcAddress)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/QQ_1741948247896-0b2ihjhNIHhHgMta0BDFGnlCXUSKTi.png"
                  alt="BTC 二维码"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">EVM 地址 (USDT)</h3>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <code className="flex-1 text-sm break-all">{evmAddress}</code>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(evmAddress)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/QQ_1741948173772-83qXOehUBNY19ajVhdFx5HOtBNbNh1.png"
                  alt="USDT 二维码"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-muted-foreground">
        <p>感谢您的支持！如有任何问题，欢迎通过Twitter或GitHub与我联系。</p>
      </div>
    </div>
  )
}

