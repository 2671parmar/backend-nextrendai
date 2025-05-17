import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Download, Trash2, PenLine } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 10;

const MortgageTerms = () => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [form, setForm] = useState({ term: "", definition: "", mortgage_relevance: "" });

  useEffect(() => {
    const fetchTerms = async () => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from("mortgage_terms")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      if (!error && data) {
        setTerms(data);
        setTotalCount(count || 0);
      }
    };
    fetchTerms();
  }, [page]);

  const handleAdd = () => {
    setIsEdit(false);
    setForm({ term: "", definition: "", mortgage_relevance: "" });
    setSelectedTerm(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setForm({
      term: row.term,
      definition: row.definition,
      mortgage_relevance: row.mortgage_relevance,
    });
    setSelectedTerm(row);
    setIsFormOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedTerm(row);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedTerm) {
      const { error } = await supabase
        .from("mortgage_terms")
        .delete()
        .eq("id", selectedTerm.id);
      if (!error) {
        setTerms(terms.filter((t) => t.id !== selectedTerm.id));
        toast.success("Term deleted successfully");
      } else {
        toast.error("Failed to delete term");
      }
      setIsDeleteDialogOpen(false);
      setSelectedTerm(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEdit && selectedTerm) {
      const { error } = await supabase
        .from("mortgage_terms")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", selectedTerm.id);
      if (!error) {
        setTerms(
          terms.map((t) =>
            t.id === selectedTerm.id ? { ...t, ...form, updated_at: new Date().toISOString() } : t
          )
        );
        toast.success("Term updated successfully");
      } else {
        toast.error("Failed to update term");
      }
    } else {
      const { data: inserted, error } = await supabase
        .from("mortgage_terms")
        .insert({ ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select()
        .single();
      if (!error && inserted) {
        setTerms([inserted, ...terms]);
        toast.success("Term added successfully");
      } else {
        toast.error("Failed to add term");
      }
    }
    setIsFormOpen(false);
  };

  const columns = [
    { header: "Term", accessorKey: "term", sortable: true },
    { header: "Definition", accessorKey: "definition", sortable: false },
    { header: "Mortgage Relevance", accessorKey: "mortgage_relevance", sortable: false },
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
        title="Mortgage Terms Management"
        description="Create and manage mortgage terms"
        action={{ label: "Add Term", onClick: handleAdd, icon: <Plus className="h-4 w-4" /> }}
      />
      <DataTable columns={columns} data={terms} searchField="term" onRowClick={handleEdit} />
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
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit" : "Add"} Mortgage Term</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Term</label>
                <input className="w-full border rounded px-3 py-2" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Definition</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Mortgage Relevance</label>
                <textarea className="w-full border rounded px-3 py-2" value={form.mortgage_relevance} onChange={e => setForm({ ...form, mortgage_relevance: e.target.value })} />
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
        title="Delete Mortgage Term"
        description={`Are you sure you want to delete the term "${selectedTerm?.term}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default MortgageTerms; 