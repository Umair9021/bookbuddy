import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LoadingSkeleton() {
  return (
    <>
    <Navbar />
    <div className="grid grid-cols-3 gap-6 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-40 w-full rounded-xl" /> {/* Image */}
          <Skeleton className="h-4 w-3/4" />              {/* Title */}
          <Skeleton className="h-4 w-1/2" />              {/* Seller */}
        </div>
      ))}
    </div>
    <Footer/>
    </>
  );
}