import { Heart, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

// No author, no avatar, no handle, no timestamp, no tweet_url, no retweets

export default function TweetCard({ tweet }) {
  const [expanded, setExpanded] = useState(false)
  const maxChars = 100
  const isLongTweet = tweet.content.length > maxChars
  const displayContent = !isLongTweet 
    ? tweet.content 
    : `${tweet.content.substring(0, maxChars)}...`

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [expanded])

  return (
    <>
      <div className="border border-white/20 rounded-lg p-4 bg-black hover:bg-black hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tweet.tag && (
              <Badge variant="outline" className="text-xs bg-black hover:bg-white/10 border-white/30 text-white">
                #{tweet.tag}
              </Badge>
            )}
          </div>
          <div className="mb-4">
            <p className="font-mono text-white leading-relaxed whitespace-pre-wrap">{displayContent}</p>
            {isLongTweet && (
              <button 
                onClick={() => setExpanded(true)} 
                className="text-blue-400 hover:text-blue-500 text-sm font-mono mt-2 inline-block"
              >
                click to read more
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/20">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-white/70 tweet-interact">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-mono">{tweet.comments_count}</span>
              </span>
              <span className="flex items-center space-x-1 text-white/70 tweet-interact">
                <Heart className="h-4 w-4" />
                <span className="text-xs font-mono">{tweet.likes}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for expanded tweet */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]" 
          onClick={() => setExpanded(false)}
          style={{
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          <div 
            className="bg-black border border-white/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              transformOrigin: "center"
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {tweet.tag && (
                <Badge variant="outline" className="text-xs bg-black hover:bg-white/10 border-white/30 text-white">
                  #{tweet.tag}
                </Badge>
              )}
            </div>
            <p className="font-mono text-white text-lg leading-relaxed whitespace-pre-wrap mb-6">{tweet.content}</p>
            <div className="flex items-center gap-8 pt-4 border-t border-white/20">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-white/70 tweet-interact">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-mono">{tweet.comments_count}</span>
                </span>
                <span className="flex items-center space-x-1 text-white/70 tweet-interact">
                  <Heart className="h-5 w-5" />
                  <span className="text-sm font-mono">{tweet.likes}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .tweet-interact {
          transition: transform 0.2s ease;
        }
        .tweet-interact:hover {
          transform: scale(1.15);
        }
      `}</style>
    </>
  )
}