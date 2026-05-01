
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context"; // Import useLanguage
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, loading: authLoading, login } = useAuth();
  const { t } = useLanguage(); // Use language context
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, authLoading, router]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      if (user) {
        login(email, name); 
      }
      toast({
        title: t('profile.saveToast.title', {defaultValue: "Profile Updated"}),
        description: t('profile.saveToast.description', {defaultValue: "Your profile information has been saved."}),
      });
      setIsSavingProfile(false);
    }, 1500);
  };

  if (!mounted || authLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">{t('profile.title')}</CardTitle>
          <CardDescription>{t('profile.description')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSave}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.name')}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('profile.namePlaceholder', {defaultValue: "Your Name"})} className="bg-background/80"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('profile.email')}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('profile.emailPlaceholder', {defaultValue: "your@email.com"})} className="bg-background/80"/>
            </div>
             <div className="space-y-2">
              <Label htmlFor="password">{t('profile.password')}</Label>
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => toast({title: "Conceptual", description: "Password change functionality would be here."})}>
                {t('profile.changePassword')}
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSavingProfile} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('profile.saveButton')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
