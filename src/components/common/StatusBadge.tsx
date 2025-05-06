
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: boolean;
  labels?: {
    active: string;
    inactive: string;
  };
  className?: string;
}

export const StatusBadge = ({
  status,
  labels = { active: "Published", inactive: "Draft" },
  className,
}: StatusBadgeProps) => {
  return (
    <Badge
      className={cn(
        status
          ? "bg-green-100 text-green-800 hover:bg-green-100"
          : "bg-gray-100 text-gray-800 hover:bg-gray-100",
        className
      )}
    >
      {status ? labels.active : labels.inactive}
    </Badge>
  );
};

export default StatusBadge;
