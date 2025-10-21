import { Profile } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Upload, Download, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSelectorProps {
  profiles: Profile[];
  currentProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: (name: string) => void;
  onDeleteProfile: (id: string) => void;
  onExportProfile: (profile: Profile) => void;
  onImportProfile: (file: File) => Promise<void>;
}

export const ProfileSelector = ({
  profiles,
  currentProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onExportProfile,
  onImportProfile,
}: ProfileSelectorProps) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleCreate = () => {
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName.trim());
      setNewProfileName('');
      setIsCreateOpen(false);
      toast({ title: 'Profile created successfully' });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImportProfile(file);
        toast({ title: 'Profile imported successfully' });
      } catch {
        toast({ title: 'Failed to import profile', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Profiles</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Profile Name</Label>
                  <Input
                    id="profile-name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="e.g., Personal, Work"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Create Profile
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-3">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className={`p-4 cursor-pointer transition-colors ${
              currentProfile?.id === profile.id
                ? 'border-primary bg-accent'
                : 'hover:border-muted-foreground'
            }`}
            onClick={() => onSelectProfile(profile)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.personal.firstName} {profile.personal.lastName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExportProfile(profile);
                    toast({ title: 'Profile exported' });
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Delete this profile?')) {
                      onDeleteProfile(profile.id);
                      toast({ title: 'Profile deleted' });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
