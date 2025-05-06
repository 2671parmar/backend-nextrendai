
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Book, 
  Linkedin, 
  BookText, 
  Video, 
  Mail, 
  MessageSquare, 
  Twitter, 
  MessageCircle, 
  Star 
} from "lucide-react";
import { MasterPrompt } from "@/types";

const promptTypes = [
  "Master Prompt",
  "LinkedIn Prompt",
  "Blog Post Prompt",
  "Video Script Prompt",
  "Email Prompt",
  "Social Prompt", 
  "X/Twitter Prompt",
  "SMS Client Prompt",
  "SMS Realtor Prompt",
  "Motivational Quote Prompt"
];

const promptTypeIcons: Record<string, React.ReactNode> = {
  "Master Prompt": <Book className="h-4 w-4" />,
  "LinkedIn Prompt": <Linkedin className="h-4 w-4" />,
  "Blog Post Prompt": <BookText className="h-4 w-4" />,
  "Video Script Prompt": <Video className="h-4 w-4" />,
  "Email Prompt": <Mail className="h-4 w-4" />,
  "Social Prompt": <MessageSquare className="h-4 w-4" />,
  "X/Twitter Prompt": <Twitter className="h-4 w-4" />,
  "SMS Client Prompt": <MessageCircle className="h-4 w-4" />,
  "SMS Realtor Prompt": <MessageCircle className="h-4 w-4" />,
  "Motivational Quote Prompt": <Star className="h-4 w-4" />
};

const promptFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  content: z.string().min(10, "Prompt content is required"),
  type: z.string().min(1, "Prompt type is required"),
});

type PromptFormValues = z.infer<typeof promptFormSchema>;

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromptFormValues) => void;
  defaultValues?: Partial<MasterPrompt>;
  isEdit?: boolean;
}

export const PromptForm = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isEdit = false,
}: PromptFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      content: defaultValues?.content || "",
      type: defaultValues?.type || promptTypes[0],
    },
  });

  const handleSubmit = async (data: PromptFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Prompt" : "Create New Prompt"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Master Prompt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prompt type">
                          {field.value && (
                            <div className="flex items-center gap-2">
                              {promptTypeIcons[field.value]}
                              <span>{field.value}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {promptTypes.map((type) => (
                        <SelectItem key={type} value={type} className="flex items-center gap-2">
                          <span className="mr-2">{promptTypeIcons[type]}</span>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the full prompt text..."
                      className="min-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="nextrend-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : isEdit ? "Update Prompt" : "Create Prompt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PromptForm;
