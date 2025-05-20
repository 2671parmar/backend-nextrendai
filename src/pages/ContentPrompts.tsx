import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Trash2, PenLine, Download } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 10;

const ContentPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [form, setForm] = useState({ headline: "", hook: "", is_active: true });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPrompts = async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from("content_prompts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("headline", `%${searchQuery}%`);
      }

      const { data, error, count } = await query.range(from, to);
      if (!error && data) {
        setPrompts(data);
        setTotalCount(count || 0);
      }
    };
    fetchPrompts();
  }, [page, searchQuery]);

  const handleAdd = () => {
    setIsEdit(false);
    setForm({ headline: "", hook: "", is_active: true });
    setSelectedPrompt(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setForm({
      headline: row.headline,
      hook: row.hook,
      is_active: row.is_active,
    });
    setSelectedPrompt(row);
    setIsFormOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedPrompt(row);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPrompt) {
      const { error } = await supabase
        .from("content_prompts")
        .delete()
        .eq("id", selectedPrompt.id);
      if (!error) {
        setPrompts(prompts.filter((p) => p.id !== selectedPrompt.id));
        toast.success("Prompt deleted successfully");
      } else {
        toast.error("Failed to delete prompt");
      }
      setIsDeleteDialogOpen(false);
      setSelectedPrompt(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEdit && selectedPrompt) {
      const { error } = await supabase
        .from("content_prompts")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", selectedPrompt.id);
      if (!error) {
        setPrompts(
          prompts.map((p) =>
            p.id === selectedPrompt.id ? { ...p, ...form, updated_at: new Date().toISOString() } : p
          )
        );
        toast.success("Prompt updated successfully");
      } else {
        toast.error("Failed to update prompt");
      }
    } else {
      const { data: inserted, error } = await supabase
        .from("content_prompts")
        .insert({ ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
      if (!error && inserted) {
        setPrompts([inserted, ...prompts]);
        toast.success("Prompt added successfully");
      } else {
        toast.error("Failed to add prompt");
      }
    }
    setIsFormOpen(false);
  };

  const exportPromptsToCsv = async () => {
    // Fetch all prompts for export
    const { data: allPrompts, error } = await supabase
      .from("content_prompts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to export prompts");
      return;
    }

    const headers = ["Headline", "Hook", "Active", "Created At", "Updated At"];
    const promptsData = allPrompts.map(prompt => [
      prompt.headline,
      prompt.hook,
      prompt.is_active ? "Yes" : "No",
      format(new Date(prompt.created_at), "yyyy-MM-dd"),
      format(new Date(prompt.updated_at), "yyyy-MM-dd")
    ]);
    
    const csvContent = [
      headers.join(","),
      ...promptsData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nextrend_content_prompts_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Content Prompts exported to CSV successfully");
  };

  const columns = [
    { header: "Headline", accessorKey: "headline", sortable: true },
    { header: "Hook", accessorKey: "hook", sortable: false },
    { header: "Active", accessorKey: "is_active", cell: (row) => row.is_active ? "Yes" : "No", sortable: true },
    { header: "Created At", accessorKey: "created_at", cell: (row) => format(new Date(row.created_at), "MMM d, yyyy"), sortable: true },
    { header: "Updated At", accessorKey: "updated_at", cell: (row) => format(new Date(row.updated_at), "MMM d, yyyy"), sortable: true },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row)} title="Edit">
            <PenLine className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row)} title="Delete">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Content Prompts Management"
        description="Create and manage content prompts"
        action={{ label: "Add Prompt", onClick: handleAdd, icon: <Plus className="h-4 w-4" /> }}
      />
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={exportPromptsToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      <DataTable columns={columns} data={prompts} searchField="headline" onRowClick={handleEdit} onSearch={setSearchQuery} />
      <div className="flex justify-center mt-4">
        <Button variant="outline" className="mx-1" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span className="px-3 py-2 text-sm">Page {page} of {Math.max(1, Math.ceil(totalCount / PAGE_SIZE))}</span>
        <Button variant="outline" className="mx-1" disabled={page >= Math.ceil(totalCount / PAGE_SIZE)} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
      {/* Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit" : "Add"} Content Prompt</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Headline</label>
                <input className="w-full border rounded px-3 py-2" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Hook</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.hook} onChange={e => setForm({ ...form, hook: e.target.value })} required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <label>Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Content Prompt"
        description={`Are you sure you want to delete the prompt "${selectedPrompt?.headline}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default ContentPrompts; 