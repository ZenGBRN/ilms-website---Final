import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { getChapter } from "@/actions/get-chapter";
import VideoPlayer from "./_components/video-player";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !purchase;

  return (
    <div className="relative">
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to Enroll this course to watch this chapter."
        />
      )}

      {/* Blur Container */}
      <div
        className={`flex flex-col max-w-4xl mx-auto pb-20 ${
          isLocked ? "filter blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            isLocked={isLocked}
            videoUrl={chapter.videoUrl}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : null}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enroll Button (Outside Blur) */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CourseEnrollButton courseId={params.courseId} />
        </div>
      )}
    </div>
  );
};

export default ChapterIdPage;
