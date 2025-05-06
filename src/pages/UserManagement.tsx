
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Download, Plus, Trash2, PenLine } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import UserForm from "@/components/users/UserForm";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/data/mockData";
import { User } from "@/types";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleAddUser = () => {
    setIsEdit(false);
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsEdit(true);
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success(`User ${selectedUser.name} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUserSubmit = (data: Partial<User>) => {
    if (isEdit && selectedUser) {
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...data,
                updatedAt: new Date(),
              }
            : user
        )
      );
      toast.success(`User ${data.name} updated successfully`);
    } else {
      const newUser: User = {
        id: `${users.length + 1}`,
        name: data.name!,
        email: data.email!,
        phone: data.phone!,
        company: data.company!,
        nmls: data.nmls,
        brandVoice: data.brandVoice!,
        role: data.role!,
        createdAt: new Date(),
      };
      setUsers([...users, newUser]);
      toast.success(`User ${data.name} added successfully`);
    }
    setIsUserFormOpen(false);
  };

  const exportUsersToCsv = () => {
    const headers = ["Name", "Email", "Phone", "Company", "NMLS", "Brand Voice", "Role", "Created At"];
    const usersData = users.map(user => [
      user.name,
      user.email,
      user.phone,
      user.company,
      user.nmls || "",
      user.brandVoice,
      user.role,
      format(user.createdAt, "yyyy-MM-dd")
    ]);
    
    const csvContent = [
      headers.join(","),
      ...usersData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nextrend_users_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Users exported to CSV successfully");
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof User,
      sortable: true,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof User,
      sortable: true,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof User,
    },
    {
      header: "Company",
      accessorKey: "company" as keyof User,
      sortable: true,
    },
    {
      header: "Role",
      accessorKey: "role" as keyof User,
      cell: (user: User) => (
        <span className="capitalize">{user.role}</span>
      ),
      sortable: true,
    },
    {
      header: "Created At",
      accessorKey: "createdAt" as keyof User,
      cell: (user: User) => format(user.createdAt, "MMM d, yyyy"),
      sortable: true,
    },
    {
      header: "Brand Voice",
      accessorKey: "brandVoice" as keyof User,
      cell: (user: User) => (
        <div className="max-w-xs">
          {user.brandVoice ? (
            <p className="text-sm truncate" title={user.brandVoice}>
              {user.brandVoice.length > 0 ? user.brandVoice.substring(0, 250) : "DEFAULT"}
            </p>
          ) : (
            <span className="text-muted-foreground">DEFAULT</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof User,
      cell: (user: User) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(user);
            }}
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user);
            }}
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
        title="User Management"
        description="Manage user profiles for NEXTREND.AI team and clients"
        action={{
          label: "Add User",
          onClick: handleAddUser,
          icon: <Plus className="h-4 w-4" />,
        }}
      />
      
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={exportUsersToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={users}
        searchField="name"
        onRowClick={(user) => handleEditUser(user)}
      />
      
      {/* User form dialog */}
      <UserForm
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmit={handleUserSubmit}
        defaultValues={selectedUser || undefined}
        isEdit={isEdit}
      />
      
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={() => setIsDeleteDialogOpen(false)}
        variant="destructive"
      />
    </MainLayout>
  );
};

export default UserManagement;
