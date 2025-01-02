"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";

import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player"; // Import React Player

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

// Zod schema to only accept youtube.com URLs (long URL format)
const formSchema = z.object({
  videoUrl: z
    .string()
    .url("Invalid URL")
    .min(1, "Video URL is required")
    .refine((url) => url.includes("youtube.com"), {
      message: "Only YouTube URLs (youtube.com) are allowed.",
    }),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [videoUrl, setVideoUrl] = useState(initialData.videoUrl || "");
  const [error, setError] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async () => {
    try {
      // Validate video URL with the Zod schema
      const validationResult = formSchema.safeParse({ videoUrl });
      if (!validationResult.success) {
        setError(validationResult.error.errors[0].message);
        return;
      }

      setError(null); // Clear any previous error

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, { videoUrl });
      toast.success("Chapter updated successfully");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video link from Youtube
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && !initialData.videoUrl && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <Video className="h-10 w-10 text-slate-500" />
        </div>
      )}
      {!isEditing && initialData.videoUrl && (
        <div className="relative aspect-video mt-2">
          <ReactPlayer url={initialData.videoUrl} controls={true} width="100%" height="100%" />
        </div>
      )}
      {isEditing && (
        <div>
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
          <Button onClick={onSubmit} className="mt-2">
            Save Video
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter's video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the video does not appear.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
