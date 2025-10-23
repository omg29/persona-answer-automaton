import { Profile } from '@/types/profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Briefcase, Users, DollarSign } from 'lucide-react';

interface ProfileFormProps {
  profile: Profile;
  onUpdate: (updates: Partial<Profile>) => void;
}

export const ProfileForm = ({ profile, onUpdate }: ProfileFormProps) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="personal">
          <User className="w-4 h-4 mr-2" />
          Personal
        </TabsTrigger>
        <TabsTrigger value="contact">
          <Mail className="w-4 h-4 mr-2" />
          Contact
        </TabsTrigger>
        <TabsTrigger value="work">
          <Briefcase className="w-4 h-4 mr-2" />
          Work
        </TabsTrigger>
        <TabsTrigger value="family">
          <Users className="w-4 h-4 mr-2" />
          Family
        </TabsTrigger>
        <TabsTrigger value="financial">
          <DollarSign className="w-4 h-4 mr-2" />
          Financial
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.personal.firstName}
                  onChange={(e) => onUpdate({
                    personal: { ...profile.personal, firstName: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={profile.personal.middleName || ''}
                  onChange={(e) => onUpdate({
                    personal: { ...profile.personal, middleName: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.personal.lastName}
                  onChange={(e) => onUpdate({
                    personal: { ...profile.personal, lastName: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile.personal.dateOfBirth || ''}
                  onChange={(e) => onUpdate({
                    personal: { ...profile.personal, dateOfBirth: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profile.personal.gender || ''}
                  onValueChange={(value) => onUpdate({
                    personal: { ...profile.personal, gender: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ssn">SSN</Label>
                <Input
                  id="ssn"
                  value={profile.personal.ssn || ''}
                  onChange={(e) => onUpdate({
                    personal: { ...profile.personal, ssn: e.target.value }
                  })}
                  placeholder="XXX-XX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="dl">Driver's License</Label>
                <Input
                  id="dl"
                  value={profile.personal.driversLicense || ''}
                  onChange={(e) => onUpdate({
                    personal: { ...profile.personal, driversLicense: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.contact.email}
                  onChange={(e) => onUpdate({
                    contact: { ...profile.contact, email: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.contact.phone}
                  onChange={(e) => onUpdate({
                    contact: { ...profile.contact, phone: e.target.value }
                  })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.contact.address}
                onChange={(e) => onUpdate({
                  contact: { ...profile.contact, address: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={profile.contact.address2 || ''}
                onChange={(e) => onUpdate({
                  contact: { ...profile.contact, address2: e.target.value }
                })}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profile.contact.city}
                  onChange={(e) => onUpdate({
                    contact: { ...profile.contact, city: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profile.contact.state}
                  onChange={(e) => onUpdate({
                    contact: { ...profile.contact, state: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={profile.contact.zipCode}
                  onChange={(e) => onUpdate({
                    contact: { ...profile.contact, zipCode: e.target.value }
                  })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profile.contact.country}
                onChange={(e) => onUpdate({
                  contact: { ...profile.contact, country: e.target.value }
                })}
                placeholder="United States"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="work" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  value={profile.work.employer || ''}
                  onChange={(e) => onUpdate({
                    work: { ...profile.work, employer: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={profile.work.jobTitle || ''}
                  onChange={(e) => onUpdate({
                    work: { ...profile.work, jobTitle: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.work.industry || ''}
                  onChange={(e) => onUpdate({
                    work: { ...profile.work, industry: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="yearsEmployed">Years Employed</Label>
                <Input
                  id="yearsEmployed"
                  value={profile.work.yearsEmployed || ''}
                  onChange={(e) => onUpdate({
                    work: { ...profile.work, yearsEmployed: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workEmail">Work Email</Label>
                <Input
                  id="workEmail"
                  type="email"
                  value={profile.work.workEmail || ''}
                  onChange={(e) => onUpdate({
                    work: { ...profile.work, workEmail: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input
                  id="workPhone"
                  value={profile.work.workPhone || ''}
                  onChange={(e) => onUpdate({
                    work: { ...profile.work, workPhone: e.target.value }
                  })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="annualIncome">Annual Income</Label>
              <Input
                id="annualIncome"
                value={profile.work.annualIncome || ''}
                onChange={(e) => onUpdate({
                  work: { ...profile.work, annualIncome: e.target.value }
                })}
                placeholder="$"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="family" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="relationshipStatus">Relationship Status</Label>
                <Select
                  value={profile.family.relationshipStatus}
                  onValueChange={(value) => onUpdate({
                    family: { ...profile.family, relationshipStatus: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="partnered">Partnered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="spouseName">Spouse/Partner Name</Label>
                <Input
                  id="spouseName"
                  value={profile.family.spouseName || ''}
                  onChange={(e) => onUpdate({
                    family: { ...profile.family, spouseName: e.target.value }
                  })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="numberOfKids">Number of Children</Label>
              <Input
                id="numberOfKids"
                type="number"
                value={profile.family.numberOfKids || 0}
                onChange={(e) => onUpdate({
                  family: { ...profile.family, numberOfKids: parseInt(e.target.value) || 0 }
                })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={profile.family.emergencyContact || ''}
                  onChange={(e) => onUpdate({
                    family: { ...profile.family, emergencyContact: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={profile.family.emergencyPhone || ''}
                  onChange={(e) => onUpdate({
                    family: { ...profile.family, emergencyPhone: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="financial" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={profile.financial.bankName || ''}
                  onChange={(e) => onUpdate({
                    financial: { ...profile.financial, bankName: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Select
                  value={profile.financial.accountType || ''}
                  onValueChange={(value) => onUpdate({
                    financial: { ...profile.financial, accountType: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="creditScore">Credit Score</Label>
                <Input
                  id="creditScore"
                  value={profile.financial.creditScore || ''}
                  onChange={(e) => onUpdate({
                    financial: { ...profile.financial, creditScore: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  value={profile.financial.monthlyIncome || ''}
                  onChange={(e) => onUpdate({
                    financial: { ...profile.financial, monthlyIncome: e.target.value }
                  })}
                  placeholder="$"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses</Label>
                <Input
                  id="monthlyExpenses"
                  value={profile.financial.monthlyExpenses || ''}
                  onChange={(e) => onUpdate({
                    financial: { ...profile.financial, monthlyExpenses: e.target.value }
                  })}
                  placeholder="$"
                />
              </div>
              <div>
                <Label htmlFor="assets">Total Assets</Label>
                <Input
                  id="assets"
                  value={profile.financial.assets || ''}
                  onChange={(e) => onUpdate({
                    financial: { ...profile.financial, assets: e.target.value }
                  })}
                  placeholder="$"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="debts">Total Debts</Label>
              <Input
                id="debts"
                value={profile.financial.debts || ''}
                onChange={(e) => onUpdate({
                  financial: { ...profile.financial, debts: e.target.value }
                })}
                placeholder="$"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
