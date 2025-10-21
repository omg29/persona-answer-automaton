import { useState, useEffect } from 'react';
import { Profile } from '@/types/profile';

const STORAGE_KEY = 'autofill_profiles';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setProfiles(data);
      if (data.length > 0) {
        setCurrentProfile(data[0]);
      }
    }
  }, []);

  const saveProfiles = (newProfiles: Profile[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
    setProfiles(newProfiles);
  };

  const createProfile = (name: string): Profile => {
    const newProfile: Profile = {
      id: crypto.randomUUID(),
      name,
      personal: {
        firstName: '',
        lastName: '',
      },
      contact: {
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      work: {
        annualIncome: '',
      },
      family: {
        relationshipStatus: '',
        numberOfKids: 0,
      },
      financial: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    setCurrentProfile(newProfile);
    return newProfile;
  };

  const updateProfile = (profileId: string, updates: Partial<Profile>) => {
    const updated = profiles.map(p => 
      p.id === profileId 
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    );
    saveProfiles(updated);
    if (currentProfile?.id === profileId) {
      setCurrentProfile(updated.find(p => p.id === profileId) || null);
    }
  };

  const deleteProfile = (profileId: string) => {
    const updated = profiles.filter(p => p.id !== profileId);
    saveProfiles(updated);
    if (currentProfile?.id === profileId) {
      setCurrentProfile(updated[0] || null);
    }
  };

  const exportProfile = (profile: Profile) => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_profile.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProfile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string) as Profile;
          imported.id = crypto.randomUUID();
          imported.createdAt = new Date().toISOString();
          imported.updatedAt = new Date().toISOString();
          const updated = [...profiles, imported];
          saveProfiles(updated);
          setCurrentProfile(imported);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    profiles,
    currentProfile,
    setCurrentProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    exportProfile,
    importProfile,
  };
};
