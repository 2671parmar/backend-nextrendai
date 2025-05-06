
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  PenLine, 
  Clock, 
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
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import PromptForm from "@/components/prompts/PromptForm";
import PromptHistory from "@/components/prompts/PromptHistory";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { mockPrompts } from "@/data/mockData";
import { MasterPrompt } from "@/types";

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

const MasterPrompts = () => {
  const [prompts, setPrompts] = useState<MasterPrompt[]>(mockPrompts);
  const [selectedPrompt, setSelectedPrompt] = useState<MasterPrompt | null>(null);
  const [isPromptFormOpen, setIsPromptFormOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleAddPrompt = () => {
    setIsEdit(false);
    setSelectedPrompt(null);
    setIsPromptFormOpen(true);
  };

  const handleEditPrompt = (prompt: MasterPrompt) => {
    setIsEdit(true);
    setSelectedPrompt(prompt);
    setIsPromptFormOpen(true);
  };

  const handleViewHistory = (prompt: MasterPrompt) => {
    setSelectedPrompt(prompt);
    setIsHistoryDialogOpen(true);
  };

  const handleDeletePrompt = (prompt: MasterPrompt) => {
    setSelectedPrompt(prompt);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePrompt = () => {
    if (selectedPrompt) {
      setPrompts(prompts.filter((p) => p.id !== selectedPrompt.id));
      toast.success(`Prompt ${selectedPrompt.name} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedPrompt(null);
    }
  };

  const handlePromptSubmit = (data: { name: string; content: string; type: string }) => {
    if (isEdit && selectedPrompt) {
      // Create new version with incremented version number
      const versionParts = selectedPrompt.version.split('v')[1].split('.');
      const majorVersion = parseInt(versionParts[0]);
      const minorVersion = parseInt(versionParts[1]);
      const newVersion = `v${majorVersion}.${minorVersion + 1}`;
      
      const updatedPrompt = {
        ...selectedPrompt,
        name: data.name,
        content: data.content,
        type: data.type,
        version: newVersion,
        updatedAt: new Date(),
        history: [
          {
            version: newVersion,
            content: data.content,
            updatedAt: new Date(),
          },
          ...selectedPrompt.history,
        ],
      };
      
      setPrompts(
        prompts.map((prompt) =>
          prompt.id === selectedPrompt.id ? updatedPrompt : prompt
        )
      );
      
      toast.success(`Prompt ${data.name} updated successfully to version ${newVersion}`);
    } else {
      const newPrompt: MasterPrompt = {
        id: `${prompts.length + 1}`,
        name: data.name,
        content: data.content,
        type: data.type,
        version: "v1.0",
        updatedAt: new Date(),
        history: [
          {
            version: "v1.0",
            content: data.content,
            updatedAt: new Date(),
          },
        ],
      };
      
      setPrompts([...prompts, newPrompt]);
      toast.success(`Prompt ${data.name} created successfully`);
    }
    
    setIsPromptFormOpen(false);
  };

  const handleRestoreVersion = (version: string) => {
    if (selectedPrompt) {
      const versionData = selectedPrompt.history.find(h => h.version === version);
      
      if (versionData) {
        // Create new version with incremented version number
        const versionParts = selectedPrompt.version.split('v')[1].split('.');
        const majorVersion = parseInt(versionParts[0]);
        const minorVersion = parseInt(versionParts[1]);
        const newVersion = `v${majorVersion}.${minorVersion + 1}`;
        
        const updatedPrompt = {
          ...selectedPrompt,
          content: versionData.content,
          version: newVersion,
          updatedAt: new Date(),
          history: [
            {
              version: newVersion,
              content: versionData.content,
              updatedAt: new Date(),
            },
            ...selectedPrompt.history,
          ],
        };
        
        setPrompts(
          prompts.map((prompt) =>
            prompt.id === selectedPrompt.id ? updatedPrompt : prompt
          )
        );
        
        toast.success(`Prompt restored to version ${version} as a new version ${newVersion}`);
        setIsHistoryDialogOpen(false);
      }
    }
  };

  const columns = [
    {
      header: "Prompt Name",
      accessorKey: "name" as keyof MasterPrompt,
      sortable: true,
    },
    {
      header: "Prompt Type",
      accessorKey: "type" as keyof MasterPrompt,
      sortable: true,
      cell: (prompt: MasterPrompt) => (
        <div className="flex items-center gap-2">
          {promptTypeIcons[prompt.type] || null}
          <span>{prompt.type}</span>
        </div>
      ),
    },
    {
      header: "Version",
      accessorKey: "version" as keyof MasterPrompt,
      sortable: true,
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt" as keyof MasterPrompt,
      cell: (prompt: MasterPrompt) => format(prompt.updatedAt, "MMM d, yyyy"),
      sortable: true,
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof MasterPrompt,
      cell: (prompt: MasterPrompt) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleViewHistory(prompt);
            }}
            title="View history"
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditPrompt(prompt);
            }}
            title="Edit prompt"
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePrompt(prompt);
            }}
            title="Delete prompt"
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
        title="Master Prompt Management"
        description="Create and manage AI system master prompts"
        action={{
          label: "Create Prompt",
          onClick: handleAddPrompt,
          icon: <Plus className="h-4 w-4" />,
        }}
      />
      
      <DataTable
        columns={columns}
        data={prompts}
        searchField="name"
        onRowClick={(prompt) => handleEditPrompt(prompt)}
      />
      
      {/* Prompt form dialog */}
      <PromptForm
        isOpen={isPromptFormOpen}
        onClose={() => setIsPromptFormOpen(false)}
        onSubmit={handlePromptSubmit}
        defaultValues={selectedPrompt || undefined}
        isEdit={isEdit}
      />
      
      {/* Prompt history dialog */}
      <PromptHistory
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        prompt={selectedPrompt}
        onRestore={handleRestoreVersion}
      />
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Prompt"
        description={`Are you sure you want to delete the prompt "${selectedPrompt?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeletePrompt}
        onCancel={() => setIsDeleteDialogOpen(false)}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default MasterPrompts;
