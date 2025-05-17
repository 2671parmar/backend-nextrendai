import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';

const Profile = () => {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwLoading, setPwLoading] = useState(false);

  // Fetch latest profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (data) setForm(f => ({ ...f, full_name: data.full_name }));
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    setLoading(false);
    if (error) toast.error('Failed to update profile');
    else toast.success('Profile updated');
  };

  // Change password logic
  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handlePwSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPwLoading(true);
    // Supabase does not require current password for update, but you can optionally re-authenticate
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPassword });
    setPwLoading(false);
    if (error) toast.error('Failed to change password');
    else {
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
        <p className="mb-8 text-gray-500">Manage your account preferences</p>

        {/* Profile Information */}
        <h2 className="text-xl font-bold mb-2 mt-8">Profile Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input name="full_name" value={form.full_name} onChange={handleChange} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <Input name="email" value={form.email} disabled className="bg-gray-100" />
            <span className="text-xs text-gray-400">Email cannot be changed</span>
          </div>
          <Button type="submit" className="mt-2 bg-green-400 hover:bg-green-500" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>

        {/* Change Password */}
        <h2 className="text-xl font-bold mb-2 mt-8">Change Password</h2>
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Current Password</label>
            <Input name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} autoComplete="current-password" />
          </div>
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <Input name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} autoComplete="new-password" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <Input name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange} autoComplete="new-password" />
          </div>
          <Button type="submit" className="mt-2 bg-green-400 hover:bg-green-500" disabled={pwLoading}>
            {pwLoading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default Profile; 