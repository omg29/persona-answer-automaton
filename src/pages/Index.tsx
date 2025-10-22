import { useEffect } from 'react';
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileSelector } from '@/components/ProfileSelector';
import { ProfileForm } from '@/components/ProfileForm';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const {
    profiles,
    currentProfile,
    setCurrentProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    exportProfile,
    importProfile,
  } = useProfiles();

  // Sync profiles with extension
  useEffect(() => {
    // Send profiles to Chrome extension if available
    if (typeof window !== 'undefined' && (window as any).chrome?.runtime?.sendMessage) {
      try {
        (window as any).chrome.runtime.sendMessage(
          { action: 'syncProfiles', profiles },
          (response: any) => {
            // Ignore errors if extension is not installed
            if ((window as any).chrome.runtime.lastError) {
              console.log('Extension not available');
            }
          }
        );
      } catch (error) {
        // Extension not installed or not accessible
        console.log('Extension sync not available');
      }
    }
  }, [profiles]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AutoFill Profile Manager</h1>
          <p className="text-muted-foreground">
            Manage profiles for automated form filling across websites
          </p>
        </div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          <div>
            <ProfileSelector
              profiles={profiles}
              currentProfile={currentProfile}
              onSelectProfile={setCurrentProfile}
              onCreateProfile={createProfile}
              onDeleteProfile={deleteProfile}
              onExportProfile={exportProfile}
              onImportProfile={importProfile}
            />
          </div>

          <div>
            {currentProfile ? (
              <ProfileForm
                profile={currentProfile}
                onUpdate={(updates) => updateProfile(currentProfile.id, updates)}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <p className="text-xl text-muted-foreground">
                      No profile selected
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create or select a profile to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
