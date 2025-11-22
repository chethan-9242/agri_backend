"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Blocks, Hash, LinkIcon, Clock, CheckCircle2, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Simulated blockchain data
const generateBlock = (id: number) => ({
  id,
  hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  previousHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
  timestamp: new Date(Date.now() - Math.random() * 10000000).toISOString(),
  transactions: Math.floor(Math.random() * 15) + 1,
  validator: `Validator-${Math.floor(Math.random() * 100)}`,
  size: `${Math.floor(Math.random() * 500) + 100} KB`,
})

export default function BlockchainPage() {
  const { user } = useAuth()
  const [blocks, setBlocks] = useState<any[]>([])
  const [stats, setStats] = useState({
    tps: 12.5,
    blockTime: "2.4s",
    totalTransactions: 145892,
    activeNodes: 45,
  })

  useEffect(() => {
    // Initialize blocks
    const initialBlocks = Array.from({ length: 10 }, (_, i) => generateBlock(10890 - i))
    setBlocks(initialBlocks)

    // Simulate live updates
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const newBlock = generateBlock(prev[0].id + 1)
        return [newBlock, ...prev.slice(0, 9)]
      })
      setStats((prev) => ({
        ...prev,
        tps: +(prev.tps + (Math.random() - 0.5)).toFixed(1),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // If no user is logged in, we can default to consumer view layout or a generic wrapper
  // But since DashboardLayout requires a role, we'll just use 'consumer' as fallback if not logged in
  // or better, handle the null user case.Ideally this page is public?
  // For now, let's assume logged in or redirect.
  // We'll default to "consumer" role for the layout if user is null (for demo purposes)
  const role = user?.role || "consumer"

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Blocks className="h-8 w-8 text-primary" />
              FarmTrace Ledger
            </h1>
            <p className="text-muted-foreground">Live view of the supply chain blockchain network.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Mainnet Online
            </Badge>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TPS</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tps}</div>
              <p className="text-xs text-muted-foreground">Transactions per second</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Block Time</CardTitle>
              <Blocks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.blockTime}</div>
              <p className="text-xs text-muted-foreground">Average confirmation time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total TXs</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime transactions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validators</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeNodes}</div>
              <p className="text-xs text-muted-foreground">Active nodes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Latest Blocks */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Latest Blocks</CardTitle>
              <CardDescription>Real-time block production from the network.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <div
                      key={block.id}
                      className="flex flex-col p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Blocks className="h-4 w-4 text-primary" />
                          <span className="font-mono font-bold text-primary">#{block.id}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(block.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="grid gap-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Hash:</span>
                          <span className="font-mono text-xs truncate max-w-[200px]">{block.hash}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Validator:</span>
                          <span>{block.validator}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">TXs:</span>
                          <Badge variant="secondary" className="h-5 text-xs">
                            {block.transactions}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Smart Contract Events</CardTitle>
              <CardDescription>Recent supply chain actions recorded on-chain.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-primary/20 pb-6 last:pb-0">
                      <div className="absolute top-0 left-[-9px] bg-background">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            0x3a...2f{i}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                        <p className="text-sm font-medium">
                          {i % 3 === 0
                            ? "Batch #4920 Verified by Distributor"
                            : i % 3 === 1
                              ? "New Harvest #8821 Created"
                              : "Retailer Accepted Delivery #3321"}
                        </p>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          Gas used: {(Math.random() * 0.01).toFixed(5)} ETH
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
