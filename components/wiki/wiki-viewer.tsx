"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, ChevronRight, Book } from "lucide-react"
import { WIKI_ARTICLES, WIKI_CATEGORIES, WikiArticle } from "@/lib/wiki"
import { cn } from "@/lib/utils"

interface NavigationContentProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  selectedArticleId: string
  setSelectedArticleId: (v: string) => void
  groupedArticles: Record<string, WikiArticle[]>
  setMobileMenuOpen: (v: boolean) => void
}

/**
 * Вспомогательный компонент навигации (вынесен за пределы основного для сохранения фокуса ввода)
 */
function NavigationContent({ 
  searchTerm, 
  setSearchTerm, 
  selectedArticleId, 
  setSelectedArticleId, 
  groupedArticles,
  setMobileMenuOpen
}: NavigationContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск по справочнику..." 
            className="pl-9 bg-background" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {WIKI_CATEGORIES.map(cat => {
          const articles = groupedArticles[cat.id]
          if (!articles || articles.length === 0) return null

          return (
            <div key={cat.id} className="mb-6">
              <h4 className="mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <cat.icon className="w-3 h-3" />
                {cat.title}
              </h4>
              <div className="space-y-1">
                {articles.map(article => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setSelectedArticleId(article.id)
                      setMobileMenuOpen(false)
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group",
                      selectedArticleId === article.id 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {article.title}
                    {selectedArticleId === article.id && <ChevronRight className="w-3 h-3 opacity-50" />}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
        {Object.keys(groupedArticles).length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
                Ничего не найдено
            </div>
        )}
      </ScrollArea>
    </div>
  )
}

/**
 * Основной компонент WikiViewer
 */
export function WikiViewer() {
  const [selectedArticleId, setSelectedArticleId] = useState<string>("getting-started")
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const selectedArticle = WIKI_ARTICLES.find(a => a.id === selectedArticleId) || WIKI_ARTICLES[0]

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return WIKI_ARTICLES
    const lower = searchTerm.toLowerCase()
    return WIKI_ARTICLES.filter(a => 
      a.title.toLowerCase().includes(lower) || 
      a.content.toLowerCase().includes(lower)
    )
  }, [searchTerm])

  const groupedArticles = useMemo(() => {
    const groups: Record<string, WikiArticle[]> = {}
    filteredArticles.forEach(a => {
      if (!groups[a.categoryId]) groups[a.categoryId] = []
      groups[a.categoryId].push(a)
    })
    return groups
  }, [filteredArticles])

  const navProps = {
    searchTerm,
    setSearchTerm,
    selectedArticleId,
    setSelectedArticleId,
    groupedArticles,
    setMobileMenuOpen
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[600px] overflow-hidden bg-background rounded-xl border shadow-sm">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 lg:w-96 border-r bg-muted/10">
          <NavigationContent {...navProps} />
        </aside>

        {/* Mobile Header & Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-background">
          <header className="md:hidden flex items-center p-4 border-b bg-background">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <NavigationContent {...navProps} />
              </SheetContent>
            </Sheet>
            <span className="font-bold truncate">Справочник: {selectedArticle.title}</span>
          </header>

          <ScrollArea className="flex-1">
            <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2">
              <div className="space-y-4 border-b pb-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <Book className="w-4 h-4" />
                    <span>/</span>
                    <span>{WIKI_CATEGORIES.find(c => c.id === selectedArticle.categoryId)?.title}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary">
                  {selectedArticle.title}
                </h1>
              </div>
              
              <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7">
                {selectedArticle.render()}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  )
}
