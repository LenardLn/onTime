import { Skeleton } from "../shadcn/skeleton";

const PageLoader = () => {
  return (
    <div className="flex w-full flex-col gap-3 p-6">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};

export default PageLoader;
