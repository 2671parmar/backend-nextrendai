
import { useState } from "react";
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
import { mockMBSCommentary } from "@/data/mockData";
import { ContentArticle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MBSCommentary = () => {
  const [articles, setArticles] = useState<ContentArticle[]>(mockMBSCommentary);
  const [selectedArticle, setSelectedArticle] = useState<ContentArticle | null>(null);
  const [isArticleFormOpen, setIsArticleFormOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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

  const confirmDeleteArticle = () => {
    if (selectedArticle) {
      setArticles(articles.filter((a) => a.id !== selectedArticle.id));
      toast.success(`MBS Commentary deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedArticle(null);
    }
  };

  const handleArticleSubmit = (data: Partial<ContentArticle>) => {
    if (isEdit && selectedArticle) {
      setArticles(
        articles.map((article) =>
          article.id === selectedArticle.id
            ? {
                ...article,
                ...data,
                updatedAt: new Date(),
              }
            : article
        )
      );
      toast.success(`MBS Commentary updated successfully`);
    } else {
      const newArticle: ContentArticle = {
        id: `${articles.length + 1}`,
        date: data.date as Date,
        title: data.title as string,
        brief: data.brief as string,
        content: data.content as string,
        category: data.category as ContentArticle["category"],
        createdBy: "1", // Hardcoded for mock, would be current user ID
        updatedAt: new Date(),
        published: data.published as boolean,
      };
      setArticles([newArticle, ...articles]);
      toast.success(`MBS Commentary created successfully`);
    }
    setIsArticleFormOpen(false);
  };

  const exportArticlesToCsv = () => {
    const headers = ["Date", "Title", "Brief", "Category", "Status", "Last Updated"];
    const articlesData = articles.map(article => [
      format(article.date, "yyyy-MM-dd"),
      article.title,
      article.brief,
      article.category,
      article.published ? "Published" : "Draft",
      format(article.updatedAt, "yyyy-MM-dd")
    ]);
    
    const csvContent = [
      headers.join(","),
      ...articlesData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nextrend_mbs_commentary_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("MBS Commentaries exported to CSV successfully");
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
      accessorKey: "published" as keyof ContentArticle,
      cell: (article: ContentArticle) => (
        <StatusBadge status={article.published} />
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
        title="MBS Commentary Management"
        description="Create and manage MBS Commentary Today content"
        action={{
          label: "Add Commentary",
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
      />
      
      {/* Article form dialog */}
      <ArticleForm
        isOpen={isArticleFormOpen}
        onClose={() => setIsArticleFormOpen(false)}
        onSubmit={handleArticleSubmit}
        defaultValues={selectedArticle || undefined}
        isEdit={isEdit}
        contentType="mbs"
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
                <StatusBadge status={selectedArticle.published} />
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
        title="Delete MBS Commentary"
        description={`Are you sure you want to delete the commentary "${selectedArticle?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteArticle}
        onCancel={() => setIsDeleteDialogOpen(false)}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default MBSCommentary;
