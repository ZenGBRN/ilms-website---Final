import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getAnalytics } from "@/actions/get-analytics";
import { DataCard } from "./_components/data-card";


const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { data } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Student Count</h1> {/* Updated title styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {data.map((course) => (
          <DataCard
            key={course.name}
            label={`Students in ${course.name}`}
            value={course.students}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
