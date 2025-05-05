"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Redirect to /seller/sales on accessing /seller
export default function SellerPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/seller/sales")
  }, [router])
  
  return null
}
