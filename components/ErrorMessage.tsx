import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ error }: { error: string }) {
  if (error === "") {
    return null;
  }
  return (
    <div className="error-message text-red-500 inline-flex flex-row gap-3 bg-red-100 rounded-md p-3 m-3 text-sm w-fit self-start animate-fadeIn">
      <AlertTriangle />
      <span className="flex shrink min-w-0">{error}</span>
    </div>
  );
}
