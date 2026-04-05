"use client"
import { useEffect, useMemo, useState } from "react"
import { addReply, listReplies, upvote, downvote, getSession, getPostById } from "../../components/api"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, Send, Hash, Users, ImageIcon } from "lucide-react"

type Reply = {
  id: string
  authorId: string
  authorName?: string
  authorDisplayName?: string
  authorPhotoURL?: string
  content: string
  createdAt?: any
}
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

export default function PostDetailPage() {
  const params = useParams<{ postId: string }>()
  const postId = params?.postId as string
  const [post, setPost] = useState<Post | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)
  const [user, setUser] = useState<{
    id: string
    name?: string
    displayName?: string
    username?: string
    email?: string
  } | null>(null)

  const mockUser = useMemo(() => ({ id: "demo-user", name: "Demo User" }), [])

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      try {
        const postData = await getPostById(postId)
        setPost(postData as Post)
        const rr = await listReplies(postId)
        setReplies(rr as Reply[])
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
      } catch (error) {
        console.error("Failed to load post:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [postId])

  async function submitReply() {
    if (!replyText.trim()) return
    if (!user?.id) return

    try {
      setSubmittingReply(true)
      await addReply(postId, {
        authorId: user.id,
        authorName: user.displayName || user.name || user.username || user.email,
        content: replyText,
      })
      const rr = await listReplies(postId)
      setReplies(rr as Reply[])
      setReplyText("")
    } catch (error) {
      console.error("Failed to submit reply:", error)
    } finally {
      setSubmittingReply(false)
    }
  }

  async function handleUpvote() {
    if (!user?.id || !post) return
    await upvote(post.id, user.id)
    const updatedPost = await getPostById(postId)
    setPost(updatedPost as Post)
  }

  async function handleDownvote() {
    if (!user?.id || !post) return
    await downvote(post.id, user.id)
    const updatedPost = await getPostById(postId)
    setPost(updatedPost as Post)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded-xl w-32"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-24 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Community
          </Link>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Post not found</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Community
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                {post.authorPhotoURL ? (
                  <Image
                    src={post.authorPhotoURL || "/placeholder.svg"}
                    alt="avatar"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {(post.authorDisplayName || post.authorName || "A").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-gray-900 text-lg">
                    {post.authorDisplayName || post.authorName || "Anonymous"}
                  </span>
                  {post.subjectTag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <Hash className="w-3 h-3" />
                      {post.subjectTag}
                    </span>
                  )}
                </div>

                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{post.content}</p>

                {post.attachmentUrl && post.attachmentType === "image" && (
                  <div className="mt-6 relative w-full h-64 overflow-hidden rounded-xl">
                    <Image
                      src={post.attachmentUrl || "/placeholder.svg"}
                      alt="attachment"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {post.attachmentUrl && post.attachmentType !== "image" && (
                  <a
                    className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    href={post.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    View attachment
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleUpvote}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-green-100 transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <span className="font-semibold">{post.upvoteCount || 0} helpful</span>
              </button>

              <button
                onClick={handleDownvote}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-red-100 transition-colors">
                  <ThumbsDown className="w-5 h-5" />
                </div>
                <span className="font-semibold">{post.downvoteCount || 0}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">{replies.length} replies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Write a Reply</h3>
          </div>

          <div className="space-y-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your thoughts, provide an answer, or ask for clarification..."
              className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/50"
              rows={4}
            />

            <div className="flex justify-end">
              <button
                onClick={submitReply}
                disabled={submittingReply || !replyText.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium disabled:opacity-60 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:active:scale-100"
              >
                {submittingReply ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Reply
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {replies.length > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
              </span>
            </div>
          )}

          {replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  {reply.authorPhotoURL ? (
                    <Image
                      src={reply.authorPhotoURL || "/placeholder.svg"}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {(reply.authorDisplayName || reply.authorName || "P").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {reply.authorDisplayName || reply.authorName || "Peer"}
                    </span>
                    <span className="text-xs text-gray-500">replied</span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
                </div>
              </div>
            </div>
          ))}

          {replies.length === 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No replies yet. Be the first to help!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
