"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from 'lucide-react'

interface TrailerModalProps {
  isOpen: boolean
  onClose: () => void
  movieTitle: string
  youtubeVideoId: string
}

export function TrailerModal({ isOpen, onClose, movieTitle, youtubeVideoId }: TrailerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 border-0 bg-background">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <DialogHeader className="sr-only">
          <DialogTitle>{movieTitle} Trailer</DialogTitle>
        </DialogHeader>
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
            title={`${movieTitle} Trailer`}
            allowFullScreen
            className="border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
