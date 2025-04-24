"use client"

import { useState, useEffect } from "react"
import PostFeed from "@/components/tweet-feed"
import SearchBar from "@/components/search-bar"
import FilterBar from "@/components/filter-bar"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [minLikes, setMinLikes] = useState(0)
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [selectedAuthors, setSelectedAuthors] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(9) // Changed to multiple of 3
  const [paginatedPosts, setPaginatedPosts] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // Load data from public/data.json and show loading screen for exactly 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/posts.json")
        const data = await response.json()

        // Extract unique tags
        const uniqueTags = [...new Set(data.map(item => item.tag).filter(Boolean))]
        setAvailableTags(uniqueTags)

        // Map posts.json structure to post format (simpler structure)
        const mappedPosts = data.map((item, index) => ({
          id: String(index + 1),
          content: item.content,
          tag: item.tag,
          comments_count: item.comments_count,
          likes: item.likes
        }))

        setPosts(mappedPosts)
        setFilteredPosts(mappedPosts)
      } catch (error) {
        console.error("Error loading posts:", error)
      }
      
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }

    fetchData()
  }, [])

  // Handle search and filtering
  useEffect(() => {
    setIsFiltering(true)
    
    const applyFilters = () => {
      let result = [...posts]

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (post) =>
            post.content.toLowerCase().includes(query) ||
            (post.tag && post.tag.toLowerCase().includes(query))
        )
      }

      if (minLikes > 0) {
        result = result.filter(post => post.likes >= minLikes)
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        result = result.filter(post => 
          post.tag && selectedTags.includes(post.tag)
        )
      }

      // Only keep the filters that match the new data structure
      if (activeFilter !== "all") {
        switch (activeFilter) {
          case "popular":
            result = result.sort((a, b) => b.likes - a.likes)
            break
          case "discussed":
            result = result.sort((a, b) => b.comments_count - a.comments_count)
            break
          default:
            break
        }
      }

      setFilteredPosts(result)
      setCurrentPage(1)
      setIsFiltering(false)
    }

    const timeoutId = setTimeout(applyFilters, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, activeFilter, posts, minLikes, selectedTags])

  // Apply pagination to filtered posts
  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setPaginatedPosts(filteredPosts.slice(indexOfFirstPost, indexOfLastPost));
  }, [filteredPosts, currentPage, postsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredPosts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-mono font-bold tracking-tight text-center sm:text-left">Sales-101</h1>
            <div className="text-center sm:text-right text-sm text-white/70 font-mono space-y-1.5">
              <p>a collection of posts from <a href="https://www.linkedin.com/in/chrisorlob/recent-activity/all/" className="text-cyan-300">@chrisorlob</a></p>
              <p>made by <a href="https://x.com/realhardik18" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors">@realhardik18</a></p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FilterBar 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              minLikes={minLikes} 
              setMinLikes={setMinLikes} 
              dateRange={dateRange} 
              setDateRange={setDateRange}
              selectedAuthors={selectedAuthors}
              setSelectedAuthors={setSelectedAuthors}
              availableTags={availableTags}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              resultsCount={filteredPosts.length}
              totalCount={posts.length}
              isFiltering={isFiltering}
            />
          </div>
        </header>
        
        {isFiltering ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-white/70 font-mono">Updating results...</div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <>
            <PostFeed posts={paginatedPosts} />
            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center space-x-1 text-sm font-mono">
                <p className="text-white/70">
                  Showing {((currentPage - 1) * postsPerPage) + 1} - {Math.min(currentPage * postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
                </p>
              </div>
              <div className="mt-4 flex items-center space-x-3">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 text-sm font-mono border border-white/20 rounded-md ${currentPage === 1 ? 'text-white/40 cursor-not-allowed' : 'text-white hover:bg-white/5'} transition-colors`}
                >
                  ← Prev
                </button>
                <div className="flex space-x-1.5">
                  {Array.from({ length: Math.min(5, Math.ceil(filteredPosts.length / postsPerPage)) }, (_, i) => {
                    // Show a window of pages around current page
                    let pageNum;
                    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                    
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return pageNum <= totalPages ? (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`w-8 h-8 text-sm flex items-center justify-center rounded-md font-mono
                          ${currentPage === pageNum ? 'bg-white text-black' : 'text-white border border-white/20 hover:bg-white/10'} transition-colors`}
                      >
                        {pageNum}
                      </button>
                    ) : null;
                  })}
                </div>
                <button 
                  onClick={nextPage} 
                  disabled={currentPage >= Math.ceil(filteredPosts.length / postsPerPage)}
                  className={`px-3 py-1.5 text-sm font-mono border border-white/20 rounded-md ${
                    currentPage >= Math.ceil(filteredPosts.length / postsPerPage) 
                      ? 'text-white/40 cursor-not-allowed' 
                      : 'text-white hover:bg-white/5'
                  } transition-colors`}
                >
                  Next →
                </button>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <label className="text-white/70 text-xs font-mono">Posts per page:</label>
                <select 
                  value={postsPerPage}
                  onChange={(e) => {
                    setPostsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing items per page
                  }}
                  className="bg-black text-white border border-white/20 rounded-md px-2 py-1 text-xs font-mono focus:outline-none focus:border-white/50"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={15}>15</option>
                  <option value={21}>21</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-white/70 font-mono text-lg mb-2">No matching posts found</p>
            <p className="text-white/50 font-mono text-sm">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </main>
  )
}