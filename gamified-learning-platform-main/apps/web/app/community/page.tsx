"use client"
import { useEffect, useState } from "react"
import { createPostApi, getCloudinarySignatureApi, listPosts, upvote, downvote, getSession } from "../components/api"
import Image from "next/image"
import Link from "next/link"
import {
  Users,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ImageIcon,
  Hash,
  Send,
  TrendingUp,
  Star,
  Award,
} from "lucide-react"

type Post = {
  id: string
  authorId: string
  authorName?: string
  authorDisplayName?: string
  authorPhotoURL?: string
  content: string
  attachmentUrl?: string
  attachmentType?: string
  attachmentPublicId?: string
  subjectTag?: string
  upvoteCount: number
  downvoteCount: number
  replyCount: number
  createdAt?: any
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Composer state
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [subjectTag, setSubjectTag] = useState("")

  // Replace with real session hook
  const [user, setUser] = useState<{
    id: string
    name?: string
    displayName?: string
    username?: string
    email?: string
  } | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await listPosts()
        setPosts(data as Post[])
        const session = await getSession()
        if (session?.message?.isAuthenticated) {
          const u = session.message.user
          setUser({
            id: u?.id || u?._id || u?.uid || "",
            name: u?.name,
            displayName: u?.displayName,
            username: u?.username,
            email: u?.email,
          })
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load posts")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function handleCreatePost() {
    if (!content.trim() && !file) return
    try {
      setUploading(true)
      let attachmentUrl: string | undefined
      let attachmentType: string | undefined

      let attachmentPublicId: string | undefined
      if (file) {
        const { signature, timestamp } = await getCloudinarySignatureApi()
        const formData = new FormData()
        formData.append("file", file)
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "")
        formData.append("timestamp", String(timestamp))
        formData.append("signature", signature)
        if (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
          formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
        }
        if (process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER) {
          formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER)
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const resp = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        })
        const upload = await resp.json()
        attachmentUrl = upload.secure_url
        attachmentType = file.type.startsWith("image/") ? "image" : "file"
        // Store publicId for potential future use
        attachmentPublicId = upload.public_id
      }

      const created = await createPostApi({
        authorId: user?.id || "",
        displayName: user?.displayName || user?.name || user?.username || user?.email,
        content,
        attachmentUrl,
        attachmentType,
        attachmentPublicId,
        subjectTag: subjectTag || undefined,
      })

      // Optimistic refresh
      const newPosts = await listPosts()
      setPosts(newPosts as Post[])
      setContent("")
      setFile(null)
      setSubjectTag("")
    } catch (e: any) {
      setError(e?.message ?? "Failed to post")
    } finally {
      setUploading(false)
    }
  }

  async function handleUpvote(postId: string) {
    try {
      if (!user?.id) return
      await upvote(postId, user.id)
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? ({ ...p, upvoteCount: (p as any).upvoteCount + 1 } as any) : p)),
      )
      const refreshed = await listPosts()
      setPosts(refreshed as Post[])
    } catch {}
  }

  async function handleDownvote(postId: string) {
    try {
      if (!user?.id) return
      await downvote(postId, user.id)
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? ({ ...p, downvoteCount: (p as any).downvoteCount + 1 } as any) : p)),
      )
      const refreshed = await listPosts()
      setPosts(refreshed as Post[])
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Community Q&A
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Ask questions, share knowledge, and learn together with your peers
          </p>

          <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <span>{posts.length} discussions</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Active community</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span>Growing daily</span>
            </div>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Start a Discussion</h3>
          </div>

          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ask a question, share a doubt, or help a fellow student..."
              className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/50"
              rows={4}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={subjectTag}
                    onChange={(e) => setSubjectTag(e.target.value)}
                    placeholder="Subject tag (optional)"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                  />
                </div>

                <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Image</span>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={uploading || (!content.trim() && !file)}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium disabled:opacity-60 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:active:scale-100"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post
                  </>
                )}
              </button>
            </div>

            {file && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-2">
                <ImageIcon className="w-4 h-4" />
                <span>{file.name}</span>
                <button onClick={() => setFile(null)} className="ml-auto text-red-500 hover:text-red-700">
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No discussions yet</h3>
              <p className="text-gray-500">
                Be the first to start a conversation and help build our learning community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} className="block group">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 group-hover:border-blue-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      {post.authorPhotoURL ? (
                        <Image
                          src={post.authorPhotoURL || "/placeholder.svg"}
                          alt="avatar"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {(post.authorDisplayName || post.authorName || "A").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {post.authorDisplayName || post.authorName || "Anonymous"}
                        </span>
                        {post.subjectTag && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            <Hash className="w-3 h-3" />
                            {post.subjectTag}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>

                      {post.attachmentUrl && post.attachmentType === "image" && (
                        <div className="mt-4 relative w-full h-48 overflow-hidden rounded-xl">
                          <Image
                            src={post.attachmentUrl || "/placeholder.svg"}
                            alt="attachment"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {post.attachmentUrl && post.attachmentType !== "image" && (
                        <a
                          className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                          href={post.attachmentUrl}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                          rel="noreferrer"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View attachment
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleUpvote(post.id)
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group/btn"
                      >
                        <div className="p-1 rounded-lg group-hover/btn:bg-green-100 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{post.upvoteCount || 0}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDownvote(post.id)
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group/btn"
                      >
                        <div className="p-1 rounded-lg group-hover/btn:bg-red-100 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{post.downvoteCount || 0}</span>
                      </button>

                      <div className="flex items-center gap-2 text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{post.replyCount || 0} replies</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">Click to view discussion</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Community Guidelines</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Be respectful and helpful to fellow students</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Share knowledge and learn from others</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Use subject tags to organize discussions</span>
            </div>
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Ask clear questions with context</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
