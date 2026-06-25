import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DataCardProps {
  title: string
  description: string
  content: React.ReactNode
  className?: string
  size?: "default" | "sm"
}

export function DataCard({
  title,
  description,
  content,
  className,
  size = "default",
}: DataCardProps) {
  return (
    <Card className={className} size={size}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  )
}