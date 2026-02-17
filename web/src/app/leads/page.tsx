import { Suspense } from "react";
import { LeadsPage } from "@/src/components/pages/leads/LeadsPage";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

function LeadsPageSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

const page = () => {
  return (
    <Suspense fallback={<LeadsPageSkeleton />}>
      <LeadsPage />
    </Suspense>
  );
};

export default page;
