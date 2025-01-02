import { Loader2, Lock } from "lucide-react";
import React from "react";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  title: string;
  videoUrl: string;
}

export const VideoPlayer = ({
  isLocked,
  title,
  videoUrl,
}: VideoPlayerProps) => {
  
  // Function to convert the watch URL to the embed URL
  const convertToEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*[?&]v=|.*\/)([a-zA-Z0-9-_]+))(?:[?&].*)?/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  // Convert the video URL to an embeddable YouTube URL
  const embedUrl = videoUrl ? convertToEmbedUrl(videoUrl) : null;

  console.log("VideoPlayer Props:", { isLocked, videoUrl, embedUrl });

  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && embedUrl ? (
        <div className="aspect-video">
          <iframe
            width="560"
            height="315"
            src={embedUrl} // Use the embeddable URL
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          <p className="text-sm">No video available for this chapter.</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
