import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { authApi } from '../api/auth';
import Button from '../components/Button';

export const Profile: React.FC = () => {
  const { currentUser, setCurrentUser, showToast } = useApp();

  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [subsidiary, setSubsidiary] = useState(currentUser?.subsidiary || 'CIL');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await authApi.updateProfile({
        full_name: fullName,
        email,
        subsidiary,
        current_password: currentPassword || undefined,
        new_password: newPassword || undefined
      });
      setCurrentUser(updated);
      showToast('Profile credentials successfully updated.', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      console.error('Profile update error:', err);
      showToast(err.response?.data?.detail || 'Failed to update profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="text-left select-none flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Identity & Access Management</h1>
        <h2 className="text-2xl font-bold text-cortex-dark mt-1">User Account Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: User Card */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-cortex-border rounded-2xl p-6 shadow-premium flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gold-50 border-2 border-gold-300 flex items-center justify-center text-gold-800 font-bold text-2xl font-mono mb-4">
              {currentUser?.username.substring(0, 2).toUpperCase() || 'CC'}
            </div>
            <h3 className="font-bold text-cortex-dark text-base">{currentUser?.full_name || currentUser?.username}</h3>
            <span className="text-xs text-cortex-gray font-mono mt-0.5">{currentUser?.email}</span>
            
            <div className="mt-4 px-3 py-1 bg-gold-50 text-gold-900 border border-gold-200 rounded-full text-[10px] font-bold uppercase tracking-wider">
              ROLE: {currentUser?.role || 'VIEWER'}
            </div>

            <div className="w-full border-t border-cortex-border/60 mt-6 pt-4 text-xs flex flex-col gap-2 text-left">
              <div className="flex justify-between">
                <span className="text-cortex-gray">Affiliation:</span>
                <span className="font-semibold text-cortex-dark">{currentUser?.subsidiary || 'Coal India Limited'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cortex-gray">Security Clearance:</span>
                <span className="font-semibold text-emerald-700">LEVEL 3 ENCRYPTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Update Form */}
        <div className="md:col-span-8 bg-white border border-cortex-border rounded-2xl p-6 shadow-premium">
          <h3 className="text-sm font-bold text-cortex-dark uppercase tracking-wider pb-3 border-b border-cortex-border/60 mb-5">
            Modify Personnel Credentials
          </h3>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-cortex-gray block mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2 border border-cortex-border rounded-xl text-xs text-cortex-dark outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cortex-gray block mb-1">Official Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-cortex-border rounded-xl text-xs text-cortex-dark outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cortex-gray block mb-1">Operating Subsidiary</label>
              <input
                type="text"
                value={subsidiary}
                onChange={(e) => setSubsidiary(e.target.value)}
                className="w-full px-3.5 py-2 border border-cortex-border rounded-xl text-xs text-cortex-dark outline-none focus:border-gold-500"
              />
            </div>

            <div className="pt-3 border-t border-cortex-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cortex-gray block mb-3">
                Update Password (Optional)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-cortex-gray block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 border border-cortex-border rounded-xl text-xs text-cortex-dark outline-none focus:border-gold-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-cortex-gray block mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 border border-cortex-border rounded-xl text-xs text-cortex-dark outline-none focus:border-gold-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isUpdating}
              className="mt-3 py-2.5 font-bold text-xs"
            >
              {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
