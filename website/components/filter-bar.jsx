"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Tag, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FilterBar({ 
  activeFilter, 
  setActiveFilter, 
  minLikes, 
  setMinLikes,
  availableTags = [],
  selectedTags = [],
  setSelectedTags,
  resultsCount,
  totalCount,
  isFiltering 
}) {
  const [showTagsDropdown, setShowTagsDropdown] = useState(false)

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  return (
    <div className="w-full bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 text-white/70">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm font-mono">Filters</span>
          <span className="text-xs font-mono">
            {!isFiltering && (
              <>
                <span className="font-semibold text-white">{resultsCount}</span> of {totalCount} posts
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setActiveFilter("all")}
              className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                activeFilter === "all" 
                  ? "bg-white text-black" 
                  : "bg-black border border-white/30 text-white/70 hover:text-white/90 hover:bg-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("popular")}
              className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                activeFilter === "popular" 
                  ? "bg-white text-black" 
                  : "bg-black border border-white/30 text-white/70 hover:text-white/90 hover:bg-white/10"
              }`}
            >
              Most Liked
            </button>
            <button
              onClick={() => setActiveFilter("discussed")}
              className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                activeFilter === "discussed" 
                  ? "bg-white text-black" 
                  : "bg-black border border-white/30 text-white/70 hover:text-white/90 hover:bg-white/10"
              }`}
            >
              Most Discussed
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-xs text-white/70 font-mono">Min Likes</label>
            <input 
              type="number" 
              min="0"
              value={minLikes} 
              onChange={(e) => setMinLikes(parseInt(e.target.value) || 0)}
              className="w-16 px-2 py-1 bg-black border border-white/30 rounded-md text-white text-xs font-mono focus:outline-none focus:border-white/50"
            />
          </div>
        </div>
      </div>

      {/* Tags filter */}
      <div className="mt-2">
        <button 
          onClick={() => setShowTagsDropdown(!showTagsDropdown)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-mono py-1"
        >
          <Tag className="h-3.5 w-3.5" />
          <span>Filter by tags</span>
          {selectedTags.length > 0 && (
            <span className="bg-white/10 px-1.5 py-0.5 rounded-full text-xs">{selectedTags.length}</span>
          )}
          {showTagsDropdown ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {/* Selected tags display */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-white/10 hover:bg-white/20 border-white/30 text-white cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                #{tag} ×
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <button 
                className="text-xs text-white/60 hover:text-white underline"
                onClick={() => setSelectedTags([])}
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Tags dropdown */}
        {showTagsDropdown && (
          <div className="mt-2 p-2 border border-white/20 rounded-md bg-black/80 backdrop-blur-sm">
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {availableTags.length > 0 ? (
                availableTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`
                      text-xs cursor-pointer
                      ${selectedTags.includes(tag) 
                        ? "bg-white text-black hover:bg-white/80" 
                        : "bg-black hover:bg-white/10 border-white/30 text-white"}
                    `}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-white/50 italic">No tags available</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}