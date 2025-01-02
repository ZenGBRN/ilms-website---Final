import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get the current user
    const user = await currentUser();

    // Check if user is authenticated
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the course by courseId, ensuring it is published
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    // Check if the course exists
    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Enroll the user in the course (create a new enrollment record)
    await db.purchase.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({ message: "Successfully enrolled in the course!" });
  } catch (error) {
    console.log("[COURSE_ID_ENROLLMENT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
