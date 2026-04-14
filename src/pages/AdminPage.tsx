import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  approved: boolean | null;
}

interface Subject {
  id: string;
  name: string | null;
}

interface Material {
  id: string;
  title: string | null;
  file_url: string | null;
  subject_id: string | null;
  subject?: Subject;
}

export default function AdminPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const fetchUsers = async () => {
    console.log('Fetching users');
    setLoading(true);
    let timeoutId: NodeJS.Timeout;
    try {
      timeoutId = setTimeout(() => {
        console.log('Users fetch timeout');
        setLoading(false);
      }, 5000);

      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        return;
      }
      console.log('Users fetched:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Exception fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  const fetchSubjects = async () => {
    console.log('Fetching subjects');
    try {
      const { data, error } = await supabase.from('subjects').select('id, name');
      if (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
        return;
      }
      console.log('Subjects fetched:', data);
      setSubjects(data || []);
    } catch (error) {
      console.error('Exception fetching subjects:', error);
      setSubjects([]);
    }
  };

  const fetchMaterials = async () => {
    console.log('Fetching materials');
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*, subject:subjects(id, name)')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching materials:', error);
        setMaterials([]);
        return;
      }
      console.log('Materials fetched:', data);
      setMaterials(data || []);
    } catch (error) {
      console.error('Exception fetching materials:', error);
      setMaterials([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSubjects();
    fetchMaterials();
  }, []);

  const toggleApproval = async (user: UserRow) => {
    const newVal = !user.approved;
    console.log('Toggling approval for user:', user.id, 'to:', newVal);
    try {
      const { error } = await supabase.from('users').update({ approved: newVal }).eq('id', user.id);
      if (error) {
        console.error('Error updating user:', error);
        toast.error('Failed to update: ' + error.message);
        return;
      }
      console.log('User updated successfully');
      toast.success(`${user.name} ${newVal ? 'approved' : 'rejected'}`);
      fetchUsers(); // Refetch to update the list
    } catch (error) {
      console.error('Exception updating user:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !subjectId) {
      toast.error('Please fill all fields and select a file');
      return;
    }

    setUploadLoading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(fileName, file);
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload file: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(fileName);

      if (!urlData.publicUrl) {
        toast.error('Failed to get file URL');
        return;
      }

      // Insert into materials table
      const { error: insertError } = await supabase.from('materials').insert({
        title,
        subject_id: subjectId,
        file_url: urlData.publicUrl,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        toast.error('Failed to save material: ' + insertError.message);
        return;
      }

      console.log('Material uploaded successfully');
      toast.success('Material uploaded successfully!');

      // Reset form
      setTitle('');
      setSubjectId('');
      setFile(null);

      // Refetch materials
      fetchMaterials();
    } catch (error) {
      console.error('Exception uploading file:', error);
      toast.error('An unexpected error occurred during upload.');
    } finally {
      setUploadLoading(false);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground animate-fade-in">
        <div className="text-5xl mb-4 opacity-50">🔒</div>
        <h3 className="font-syne text-lg font-bold text-foreground mb-2">Access Denied</h3>
        <p className="text-sm">Only admins can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-cci-accent" /></div>;
  }

  const pending = users.filter(u => !u.approved);
  const approved = users.filter(u => u.approved);

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="font-syne text-[26px] font-extrabold tracking-tight mb-1">Admin Panel ⚙️</h1>
        <p className="text-muted-foreground text-sm">Manage students and approve access.</p>
      </div>

      {/* File Upload */}
      <div className="bg-[#9ED3DC]/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-5">
        <h3 className="font-syne text-[17px] font-bold mb-4 pb-3.5 border-b border-border flex items-center gap-2.5">
          📁 Upload Study Material
        </h3>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Enter material title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
              required
            />
          </div>
          <button
            type="submit"
            disabled={uploadLoading}
            className="flex items-center gap-2 px-4 py-2 bg-cci-accent text-primary-foreground rounded-lg hover:bg-cci-accent/90 disabled:opacity-50"
          >
            {uploadLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadLoading ? 'Uploading...' : 'Upload Material'}
          </button>
        </form>
      </div>

      {/* Uploaded Materials */}
      {materials.length > 0 && (
        <div className="bg-[#9ED3DC]/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-5">
          <h3 className="font-syne text-[17px] font-bold mb-4 pb-3.5 border-b border-border flex items-center gap-2.5">
            📚 Uploaded Materials
          </h3>
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <FileText className="w-5 h-5 text-cci-accent" />
                <div className="flex-1">
                  <div className="font-medium">{material.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Subject: {material.subject?.name || 'Unknown'}
                  </div>
                </div>
                {material.file_url && (
                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cci-accent hover:underline text-sm"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger">
        <div className="bg-[#9ED3DC]/30 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Total Students</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-accent">{users.length}</div>
        </div>
        <div className="bg-[#9ED3DC]/30 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Pending Approvals</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-amber">{pending.length}</div>
        </div>
        <div className="bg-[#9ED3DC]/30 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Approved</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-green">{approved.length}</div>
        </div>
        <div className="bg-[#9ED3DC]/30 backdrop-blur-lg border border-white/20 rounded-2xl p-5">
          <div className="text-xs text-muted-foreground font-medium mb-2">Admin</div>
          <div className="font-syne text-[28px] font-extrabold tracking-tight text-cci-cyan">{users.filter(u => u.role === 'admin').length}</div>
        </div>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="bg-[#9ED3DC]/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-5">
          <h3 className="font-syne text-[17px] font-bold mb-4 pb-3.5 border-b border-border flex items-center gap-2.5">
            ⏳ Pending Approvals
          </h3>
          {pending.map(u => (
            <UserRow key={u.id} user={u} onToggle={toggleApproval} />
          ))}
        </div>
      )}

      {/* All Users */}
      <div className="bg-[#9ED3DC]/20 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
        <h3 className="font-syne text-[17px] font-bold mb-4 pb-3.5 border-b border-border flex items-center gap-2.5">
          👥 All Users
        </h3>
        {users.map(u => (
          <UserRow key={u.id} user={u} onToggle={toggleApproval} />
        ))}
      </div>
    </div>
  );
}

function UserRow({ user, onToggle }: { user: UserRow; onToggle: (u: UserRow) => void }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-border last:border-b-0">
      <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-cci-accent to-cci-cyan flex items-center justify-center font-bold text-sm flex-shrink-0 text-primary-foreground">
        {user.name?.[0]?.toUpperCase() || 'U'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{user.name || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground truncate">{user.email}</div>
      </div>
      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${user.approved ? 'bg-cci-green/10 text-cci-green' : 'bg-cci-amber/[.12] text-cci-amber'}`}>
        {user.approved ? 'Approved' : 'Pending'}
      </span>
      <button
        onClick={() => onToggle(user)}
        className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
          user.approved
            ? 'border-border text-muted-foreground hover:border-cci-rose hover:text-cci-rose'
            : 'border-cci-green text-cci-green bg-cci-green/10 hover:bg-cci-green hover:text-background'
        }`}
      >
        {user.approved ? 'Revoke' : '✓ Approve'}
      </button>
    </div>
  );
}
