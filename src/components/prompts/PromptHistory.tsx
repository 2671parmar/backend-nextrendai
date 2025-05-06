
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MasterPrompt } from "@/types";

interface PromptHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: MasterPrompt | null;
  onRestore: (version: string) => void;
}

export const PromptHistory = ({
  isOpen,
  onClose,
  prompt,
  onRestore,
}: PromptHistoryProps) => {
  if (!prompt) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prompt Version History</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h3 className="font-semibold">
              {prompt.name} (Current: {prompt.version})
            </h3>
            <p className="text-sm text-muted-foreground">
              Type: {prompt.type}
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {prompt.history.map((version, index) => (
              <AccordionItem key={index} value={version.version}>
                <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                  <div className="flex justify-between w-full pr-4">
                    <span>{version.version}</span>
                    <span className="text-muted-foreground text-sm">
                      {format(version.updatedAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-l-2 border-gray-200 pl-4 ml-2">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Content:</div>
                    <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap">
                      {version.content}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRestore(version.version)}
                      className="mt-2"
                    >
                      Restore This Version
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptHistory;
