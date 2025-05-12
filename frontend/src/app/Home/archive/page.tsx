import { ArrowLeft } from "lucide-react";

export default function ArchivePage() {
  return (
    <div className="w-screen flex flex-col items-center mt-6">
      <div className="w-[1125px]">
        <div className="flex gap-3">
          <ArrowLeft />
          <div>archive</div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
