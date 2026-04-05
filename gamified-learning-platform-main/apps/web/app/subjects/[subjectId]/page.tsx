"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type ChapterData = {
  id: string
  title?: string
}

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>()
  const chapterId = params?.chapterId

  const [chapterData, setChapterData] = useState<ChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadChapter = async () => {
      try {
        if (!chapterId) {
          setError("Chapter ID not found")
          setLoading(false)
          return
        }

        // Yahan apni actual API call lagao
        // Example:
        // const response = await fetch(`/api/chapters/${chapterId}`)
        // if (!response.ok) throw new Error("Failed to fetch chapter")
        // const data = await response.json()
        // setChapterData(data)

        // Temporary mock data
        setChapterData({
          id: chapterId,
          title: `Chapter ${chapterId}`,
        })

        setError(null)
      } catch (err) {
        console.error(err)
        setError("Failed to load chapter")
      } finally {
        setLoading(false)
      }
    }

    loadChapter()
  }, [chapterId])

  if (loading) {
    return <div className="p-8">Loading chapter...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {chapterData?.title || "Chapter Page"}
      </h1>
      <p>Chapter ID: {chapterId}</p>
    </div>
  )
}