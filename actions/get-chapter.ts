import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        videoUrl: true, 
        position: true,
        isPublished: true,
        isFree: true,
      },
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let attachments: Attachment[] = [];

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }

    let nextChapter: Chapter | null = null;

    if (chapter.isFree || purchase) {
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    

    return {
      chapter,
      course,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,

    };
  }
};
