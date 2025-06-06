import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Download, Plus, Trash2, PenLine, Mail } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import UserForm from "@/components/users/UserForm";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { User } from "@/types";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [search, setSearch] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "team">("team");

  // Fetch users helper, used in useEffect and after update
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, company, nmls, is_admin, updated_at")
      .order("updated_at", { ascending: false });
    if (!error && data) {
      setUsers(
        data.map((item: any) => ({
          id: item.id,
          name: item.full_name || "",
          email: item.email || "",
          phone: item.phone || "",
          company: item.company || "",
          nmls: item.nmls || "",
          brandVoice: "DEFAULT",
          role: item.is_admin ? "admin" : "team",
          createdAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        }))
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setIsEdit(false);
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    if (user.id && user.id.length === 36) {
      setIsEdit(true);
      setSelectedUser(user);
      setIsUserFormOpen(true);
    } else {
      toast.error("Cannot edit users that are not saved in Supabase.");
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        // Delete from auth.users
        const { error: authError } = await supabase.auth.admin.deleteUser(selectedUser.id);
        if (authError) {
          console.error("Supabase auth delete error:", authError);
          toast.error(`Failed to delete user: ${authError.message}`);
          return;
        }

        // Delete from profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", selectedUser.id);

        if (profileError) {
          console.error("Supabase profile delete error:", profileError);
          toast.error(`Failed to delete user profile: ${profileError.message}`);
          return;
        }

        // Update local state
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        toast.success(`User ${selectedUser.name} deleted successfully`);
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleUserSubmit = async (data: Partial<User>) => {
    if (isEdit && selectedUser) {
      // Update existing user in profiles table
      console.log("Updating user in Supabase:", {
        id: selectedUser.id,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        nmls: data.nmls,
        is_admin: data.role === "admin",
        updated_at: new Date().toISOString(),
      });
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          nmls: data.nmls,
          is_admin: data.role === "admin",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedUser.id);
      if (error) {
        console.error("Supabase update error:", error);
        toast.error(`Failed to update user: ${error.message}`);
        return;
      }
      toast.success(`User ${data.name} updated successfully`);
      // Refetch users from Supabase
      await fetchUsers();
    } else {
      try {
        // Create the user in auth with the provided temporary password
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email!,
          email_confirm: true,
          user_metadata: {
            full_name: data.name,
            phone: data.phone,
            company: data.company,
            nmls: data.nmls,
            is_admin: data.role === "admin"
          },
          password: data.password // Use the password from the form
        });

        if (authError) {
          toast.error(`Failed to create user: ${authError.message}`);
          return;
        }

        // Create the profile record
        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: authData.user.id,
              email: data.email,
              full_name: data.name,
              phone: data.phone,
              company: data.company,
              nmls: data.nmls,
              is_admin: data.role === "admin",
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError) {
            toast.error(`Failed to create profile: ${profileError.message}`);
            return;
          }
        }

        toast.success(`User ${data.name} added successfully. They can log in with the temporary password: ${data.password}`);
        await fetchUsers();
      } catch (error) {
        toast.error("Failed to create user");
      }
    }
    setIsUserFormOpen(false);
  };

  const handleSendInvite = async (email: string) => {
    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: 'https://app.nextrend.ai/reset-password'
      });
      if (error) {
        toast.error(`Failed to send invitation email: ${error.message}`);
        return;
      }
      toast.success(`Invitation email sent to ${email}`);
    } catch (error) {
      toast.error("Failed to send invitation email");
    }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter users by search query (across all pages)
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.toLowerCase().includes(q) ||
      user.company.toLowerCase().includes(q) ||
      (user.nmls || "").toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://app.nextrend.ai/reset-password'
      });
      if (error) {
        toast.error(`Failed to send reset password email: ${error.message}`);
        return;
      }
      toast.success(`Reset password email sent to ${email}`);
    } catch (error) {
      toast.error("Failed to send reset password email");
    }
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
      header: "NMLS#",
      accessorKey: "nmls" as keyof User,
      cell: (user: User) => (
        <span>{user.nmls || "N/A"}</span>
      ),
      sortable: true,
    },
    {
      header: "User Type",
      accessorKey: "role" as keyof User,
      cell: (user: User) => (
        <span>{user.role === "admin" ? "Admin" : "Team"}</span>
      ),
      sortable: true,
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
            title="Edit User"
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleResetPassword(user.email);
            }}
            title="Send Password Recovery Email"
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user);
            }}
            title="Delete User"
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
        action={null}
      />
      
      {/* Align Add User and Send Invite buttons in one row */}
      <div className="flex justify-end items-center mb-4 gap-2">
        <Button
          variant="default"
          onClick={handleAddUser}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
        <Button
          variant="default"
          onClick={() => setIsInviteDialogOpen(true)}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white"
        >
          <Mail className="h-4 w-4 mr-2" /> Send Invite
        </Button>
      </div>
      
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={exportUsersToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex justify-end mb-2 space-x-2">
        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="self-center">Page {currentPage} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {/* Search input above table */}
      <div className="mb-4 max-w-xs">
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          placeholder="Search users..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <DataTable
        columns={columns}
        data={paginatedUsers}
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

      {/* Invite Dialog */}
      {isInviteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Send User Invitation</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSendInvite(inviteEmail);
                setIsInviteDialogOpen(false);
                setInviteEmail("");
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Invite</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default UserManagement;
