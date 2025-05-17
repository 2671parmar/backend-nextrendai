import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Eye } from "lucide-react";
import { ContentArticle, ContentCategory } from "@/types";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const trendingCategories = [
  "Trending",
  "Mortgage",
  "Housing",
  "Economy",
];
const mbsCategories = [
  "Daily",
  "Weekly",
  "Monthly",
];

const articleFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  brief: z
    .string()
    .min(10, "Brief must be at least 10 characters")
    .max(500, "Brief cannot exceed 500 characters"),
  content: z.string().min(10, "Article content is required"),
  category: z.string(),
  date: z.date(),
  published: z.boolean().default(false),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ArticleFormValues) => void;
  defaultValues?: any; // Accept any to allow description/is_generating
  isEdit?: boolean;
  contentType: "mbs" | "trending";
}

export const ArticleForm = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  isEdit = false,
  contentType,
}: ArticleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      brief: defaultValues?.brief || defaultValues?.description || "",
      content: defaultValues?.content || "",
      category: defaultValues?.category || (contentType === "mbs" ? mbsCategories[0] : trendingCategories[0]),
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      published: typeof defaultValues?.published === "boolean"
        ? defaultValues.published
        : (defaultValues?.is_generating === false),
    },
  });

  useEffect(() => {
    form.reset({
      title: defaultValues?.title || "",
      brief: defaultValues?.brief || defaultValues?.description || "",
      content: defaultValues?.content || "",
      category: defaultValues?.category || (contentType === "mbs" ? mbsCategories[0] : trendingCategories[0]),
      date: defaultValues?.date ? new Date(defaultValues.date) : new Date(),
      published: typeof defaultValues?.published === "boolean"
        ? defaultValues.published
        : (defaultValues?.is_generating === false),
    });
    // eslint-disable-next-line
  }, [defaultValues, contentType]);

  const contentValue = form.watch("content");

  const handleSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Create"} {contentType === "mbs" ? "MBS Commentary" : "Trending Topic"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(contentType === "mbs" ? mbsCategories : trendingCategories).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-2 p-4 pt-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="nextrend-checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Publish immediately</FormLabel>
                  </FormItem>
                )}
              />
              */}
            </div>

            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brief Summary (max 500 characters)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief summary"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                {activeTab === "preview" && (
                  <div className="text-sm text-muted-foreground">
                    <Eye className="inline-block w-4 h-4 mr-1" />
                    Preview Mode
                  </div>
                )}
              </div>

              <TabsContent value="edit" className="pt-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Article Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write the full article content here..."
                          className="min-h-[300px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="preview" className="pt-4">
                <div className="border rounded-md p-4 min-h-[300px] prose max-w-none">
                  {contentValue ? (
                    <div dangerouslySetInnerHTML={{ __html: contentValue.replace(/\n/g, '<br>') }} />
                  ) : (
                    <p className="text-muted-foreground italic">
                      No content to preview yet.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

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
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Article"
                  : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleForm;
