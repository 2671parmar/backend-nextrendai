import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Download, Trash2, PenLine, Eye } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import ArticleForm from "@/components/content/ArticleForm";
import StatusBadge from "@/components/common/StatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ContentArticle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const PAGE_SIZE = 10;

const TrendingTopics = () => {
  const [articles, setArticles] = useState<ContentArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from("trending_articles")
        .select("id, title, description, content, category, date, last_scraped, status", { count: "exact" })
        .order("date", { ascending: false });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error, count } = await query.range(from, to);
      if (!error && data) {
        setArticles(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            brief: item.description,
            content: item.content,
            category: item.category,
            date: item.date ? new Date(item.date) : new Date(),
            createdBy: "",
            updatedAt: item.last_scraped ? new Date(item.last_scraped) : new Date(),
            status: item.status || 'draft',
          }))
        );
        setTotalCount(count || 0);
      }
    };
    fetchArticles();
  }, [page, searchQuery]);

  const handleAddArticle = () => {
    setIsEdit(false);
    setSelectedArticle(null);
    setIsArticleFormOpen(true);
  };

  const handleEditArticle = (article: ContentArticle) => {
    setIsEdit(true);
    setSelectedArticle(article);
    setIsArticleFormOpen(true);
  };

  const handlePreviewArticle = (article: ContentArticle) => {
    setSelectedArticle(article);
    setIsPreviewDialogOpen(true);
  };

  const handleDeleteArticle = (article: ContentArticle) => {
    setSelectedArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const handleArticleSubmit = async (data: Partial<ContentArticle>) => {
    if (isEdit && selectedArticle) {
      // Update in Supabase
      const { error } = await supabase
        .from("trending_articles")
        .update({
          title: data.title,
          description: data.brief,
          content: data.content,
          category: data.category,
          date: data.date,
          status: data.status || 'draft',
          last_scraped: new Date().toISOString(),
        })
        .eq("id", selectedArticle.id);
      if (!error) {
        setArticles(
          articles.map((article) =>
            article.id === selectedArticle.id
              ? {
                  ...article,
                  ...data,
                  brief: data.brief,
                  updatedAt: new Date(),
                  status: data.status || 'draft',
                }
              : article
          )
        );
        toast.success(`Trending Topic updated successfully`);
      } else {
        toast.error("Failed to update article");
      }
    } else {
      // Insert in Supabase
      const { data: inserted, error } = await supabase
        .from("trending_articles")
        .insert({
          title: data.title,
          description: data.brief,
          content: data.content,
          category: data.category,
          date: data.date,
          status: data.status || 'draft',
          last_scraped: new Date().toISOString(),
        })
        .select()
        .single();
      if (!error && inserted) {
        setArticles([
          {
            id: inserted.id,
            title: inserted.title,
            brief: inserted.description,
            content: inserted.content,
            category: inserted.category,
            date: inserted.date ? new Date(inserted.date) : new Date(),
            createdBy: "",
            updatedAt: inserted.last_scraped ? new Date(inserted.last_scraped) : new Date(),
            status: inserted.status || 'draft',
          },
          ...articles,
        ]);
        toast.success(`Trending Topic created successfully`);
      } else {
        toast.error("Failed to create article");
      }
    }
    setIsArticleFormOpen(false);
  };

  const confirmDeleteArticle = async () => {
    if (selectedArticle) {
      // Delete from Supabase
      const { error } = await supabase
        .from("trending_articles")
        .delete()
        .eq("id", selectedArticle.id);
      if (!error) {
        setArticles(articles.filter((a) => a.id !== selectedArticle.id));
        toast.success(`Trending Topic deleted successfully`);
      } else {
        toast.error("Failed to delete article");
      }
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
    }
  };

  const exportArticlesToCsv = async () => {
    // Fetch all articles for export
    const { data: allArticles, error } = await supabase
      .from("trending_articles")
      .select("id, title, description, content, category, date, last_scraped, status")
      .order("date", { ascending: false });

    if (error) {
      toast.error("Failed to export articles");
      return;
    }

    const headers = ["Date", "Title", "Brief", "Category", "Status", "Last Updated"];
    const articlesData = allArticles.map(article => [
      format(new Date(article.date), "yyyy-MM-dd"),
      article.title,
      article.description,
      article.category,
      article.status || 'draft',
      format(new Date(article.last_scraped), "yyyy-MM-dd")
    ]);
    
    const csvContent = [
      headers.join(","),
      ...articlesData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nextrend_trending_topics_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Trending Topics exported to CSV successfully");
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date" as keyof ContentArticle,
      cell: (article: ContentArticle) => format(article.date, "MMM d, yyyy"),
      sortable: true,
    },
    {
      header: "Title",
      accessorKey: "title" as keyof ContentArticle,
      sortable: true,
    },
    {
      header: "Category",
      accessorKey: "category" as keyof ContentArticle,
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof ContentArticle,
      cell: (article: ContentArticle) => (
        <StatusBadge status={article.status} />
      ),
      sortable: true,
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt" as keyof ContentArticle,
      cell: (article: ContentArticle) => format(article.updatedAt, "MMM d, yyyy"),
      sortable: true,
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof ContentArticle,
      cell: (article: ContentArticle) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handlePreviewArticle(article);
            }}
            title="Preview article"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditArticle(article);
            }}
            title="Edit article"
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteArticle(article);
            }}
            title="Delete article"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Trending Topics Management"
        description="Create and manage Trending Topics content"
        action={{
          label: "Add Trending Topic",
          onClick: handleAddArticle,
          icon: <Plus className="h-4 w-4" />,
        }}
      />
      
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={exportArticlesToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={articles}
        searchField="title"
        onRowClick={(article) => handleEditArticle(article)}
        onSearch={setSearchQuery}
      />
      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          className="mx-1"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span className="px-3 py-2 text-sm">Page {page} of {Math.max(1, Math.ceil(totalCount / PAGE_SIZE))}</span>
        <Button
          variant="outline"
          className="mx-1"
          disabled={page >= Math.ceil(totalCount / PAGE_SIZE)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
      
      {/* Article form dialog */}
      <ArticleForm
        isOpen={isArticleFormOpen}
        onClose={() => setIsArticleFormOpen(false)}
        onSubmit={handleArticleSubmit}
        defaultValues={selectedArticle || undefined}
        isEdit={isEdit}
        contentType="trending"
      />
      
      {/* Article preview dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article Preview</DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedArticle.date, "MMMM d, yyyy")} · {selectedArticle.category}
                  </p>
                </div>
                <StatusBadge status={selectedArticle.status} />
              </div>
              
              <div className="bg-muted p-4 rounded-md italic">
                {selectedArticle.brief}
              </div>
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Trending Topic"
        description={`Are you sure you want to delete the trending topic "${selectedArticle?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteArticle}
        onCancel={() => setIsDeleteDialogOpen(false)}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default TrendingTopics;
