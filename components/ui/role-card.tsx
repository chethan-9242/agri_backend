import type React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  colorClass: string
}

export function RoleCard({ title, description, icon, href, colorClass }: RoleCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1",
        "hover:border-primary/20",
      )}
    >
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white", colorClass)}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4 flex-grow leading-relaxed">{description}</p>
      <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
        Get Started <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  )
}
