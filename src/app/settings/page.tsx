
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-provider"; 
import { useChat } from "@/contexts/chat-context";
import { useLanguage } from "@/contexts/language-context"; 
import type { LanguageCode } from "@/lib/translations"; 
import { Loader2, Sun, Moon, Laptop, ALargeSmall, BellRing, Globe, Settings as SettingsIconLucide, MessageSquareHeart, DatabaseZap, HelpCircleIcon, Info, Heart, ShieldCheck, Baseline, Repeat2, PenTool, Milestone, CalendarDays } from "lucide-react"; // Corrected SettingsIcon alias and added other icons
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const knowledgeDomains = [
  { value: "general", label: "General" },
  { value: "tasawwuf", label: "Tasawwuf" },
  { value: "kalam", label: "Ilm-e-Kalam (Aqeedah)" },
  { value: "nahw", label: "Ilm-e-Nahw (Arabic Grammar)" },
  { value: "sarf", label: "Ilm-e-Sarf (Arabic Morphology)" },
  { value: "adab", label: "Adab (Islamic Etiquette/Literature)" },
  { value: "seerat", label: "Seerat (Prophetic Biography)" },
  { value: "tareekh", label: "Tareekh (Islamic History)" },
];

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { theme, setTheme, fontSizeMultiplier, setFontSizeMultiplier, actualTheme } = useTheme();
  const { chatMode: currentChatMode, setChatMode: setContextChatMode, selectedDomain: currentSelectedDomain, setSelectedDomain: setContextSelectedDomain } = useChat();
  const { currentLanguage, setLanguage, t } = useLanguage(); 

  const router = useRouter();
  const { toast } = useToast();
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  
  const [defaultChatMode, setDefaultChatMode] = useState(currentChatMode);
  const [defaultDomain, setDefaultDomain] = useState(currentSelectedDomain);

  const [quranReminders, setQuranReminders] = useState(false);
  const [hadithReminders, setHadithReminders] = useState(true);
  const [tasawwufReminders, setTasawwufReminders] = useState(false);

  useEffect(() => {
    const savedDefaultChatMode = localStorage.getItem('tahqeeqDefaultChatMode');
    if (savedDefaultChatMode) setDefaultChatMode(savedDefaultChatMode as "student" | "scholar");
    
    const savedDefaultDomain = localStorage.getItem('tahqeeqDefaultDomain');
    if (savedDefaultDomain) setDefaultDomain(savedDefaultDomain);

  }, []);
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setDefaultChatMode(currentChatMode);
    setDefaultDomain(currentSelectedDomain);
  }, [currentChatMode, currentSelectedDomain]);


  const handlePreferencesSave = () => {
    setIsSavingPreferences(true);
     setTimeout(() => {
      localStorage.setItem('fontSizeMultiplier', fontSizeMultiplier.toString()); 
      
      localStorage.setItem('tahqeeqDefaultChatMode', defaultChatMode);
      setContextChatMode(defaultChatMode); // Also update context for immediate effect

      localStorage.setItem('tahqeeqDefaultDomain', defaultDomain);
      setContextSelectedDomain(defaultDomain); // Also update context

      console.log("Saving Notification Preferences (Conceptual):", { quranReminders, hadithReminders, tasawwufReminders });

      toast({
        title: t('settings.saveToast.title', {defaultValue: "Preferences Saved"}),
        description: t('settings.saveToast.description', {defaultValue: "Your application preferences have been updated."}),
      });
      setIsSavingPreferences(false);
    }, 1000);
  };

  const handleExportHistory = () => {
    toast({ title: t('settings.data.exportChatHistory.toastTitle', {defaultValue: "Export Chat History (Conceptual)"}), description: t('settings.data.exportChatHistory.toastDescription', {defaultValue: "This feature will allow you to download your chat history as a file."}) });
  };

  const handleClearAllData = () => {
     toast({ title: t('settings.data.clearAllData.toastTitle', { defaultValue: "Clear All App Data (Conceptual)"}), description: t('settings.data.clearAllData.toastDescription', {defaultValue: "This feature will clear all locally stored application data. Use with caution."}) });
  };

  if (authLoading || !user) {
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
            <CardTitle className="text-2xl flex items-center"><SettingsIconLucide className="mr-2 h-6 w-6 text-primary" />{t('settings.general.title')}</CardTitle>
            <CardDescription>{t('settings.general.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-3">
                <Label className="text-lg font-medium flex items-center">
                {actualTheme === "dark" ? <Moon className="mr-2 h-5 w-5 text-accent" /> : <Sun className="mr-2 h-5 w-5 text-accent" />}
                {t('settings.general.theme')}
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-2 rounded-lg border p-3 bg-background/50">
                  <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} size="sm" className="w-full sm:flex-1">
                      <Sun className="mr-2 h-4 w-4" /> {t('theme.light')}
                  </Button>
                  <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} size="sm" className="w-full sm:flex-1">
                      <Moon className="mr-2 h-4 w-4" /> {t('theme.dark')}
                  </Button>
                  <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')} size="sm" className="w-full sm:flex-1">
                      <Laptop className="mr-2 h-4 w-4" /> {t('theme.system')}
                  </Button>
                </div>
            </div>
            <Separator />
            <div className="space-y-3">
                <Label htmlFor="font-size" className="text-lg font-medium flex items-center">
                <ALargeSmall className="mr-2 h-5 w-5 text-accent" />
                {t('settings.general.fontSize')}
                </Label>
                <Select value={fontSizeMultiplier.toString()} onValueChange={(value) => setFontSizeMultiplier(parseFloat(value))}>
                <SelectTrigger id="font-size" className="w-full bg-background/80">
                    <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0.8">{t('fontSize.small_80')}</SelectItem>
                    <SelectItem value="0.9">{t('fontSize.medium_small_90')}</SelectItem>
                    <SelectItem value="1">{t('fontSize.default_100')}</SelectItem>
                    <SelectItem value="1.1">{t('fontSize.medium_large_110')}</SelectItem>
                    <SelectItem value="1.2">{t('fontSize.large_120')}</SelectItem>
                    <SelectItem value="1.3">{t('fontSize.extra_large_130')}</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <Separator />
            <div className="space-y-3">
                <Label htmlFor="ui-language" className="text-lg font-medium flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-accent" />
                    {t('settings.general.uiLanguage')}
                </Label>
                <Select value={currentLanguage} onValueChange={(value) => setLanguage(value as LanguageCode)}>
                    <SelectTrigger id="ui-language" className="w-full bg-background/80">
                        <SelectValue placeholder="Select UI language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">{t('language.en')}</SelectItem>
                        <SelectItem value="ur">{t('language.ur')}</SelectItem>
                        <SelectItem value="ar">{t('language.ar')}</SelectItem>
                        <SelectItem value="hi">{t('language.hi')}</SelectItem>
                        <SelectItem value="roman-ur">{t('language.roman-ur')}</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{t('settings.general.uiLanguage.description')}</p>
            </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center"><MessageSquareHeart className="mr-2 h-6 w-6 text-primary" />{t('settings.chat.title')}</CardTitle>
            <CardDescription>{t('settings.chat.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="default-chat-mode" className="text-lg font-medium">{t('settings.chat.defaultMode')}</Label>
                <Select value={defaultChatMode} onValueChange={(value) => setDefaultChatMode(value as "student" | "scholar")}>
                    <SelectTrigger id="default-chat-mode" className="w-full bg-background/80">
                        <SelectValue placeholder="Select default mode" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">{t('chatMode.student')}</SelectItem>
                        <SelectItem value="scholar">{t('chatMode.scholar')}</SelectItem>
                    </SelectContent>
                </Select>
                 <p className="text-xs text-muted-foreground">{t('settings.chat.defaultMode.description')}</p>
            </div>
            <Separator/>
            <div className="space-y-3">
                <Label htmlFor="default-knowledge-domain" className="text-lg font-medium">{t('settings.chat.defaultDomain')}</Label>
                 <Select value={defaultDomain} onValueChange={setDefaultDomain}>
                    <SelectTrigger id="default-knowledge-domain" className="w-full bg-background/80">
                        <SelectValue placeholder="Select default domain" />
                    </SelectTrigger>
                    <SelectContent>
                        {knowledgeDomains.map(domain => (
                            <SelectItem key={domain.value} value={domain.value}>{domain.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{t('settings.chat.defaultDomain.description')}</p>
            </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><BellRing className="mr-2 h-6 w-6 text-primary" />{t('settings.notifications.title')}</CardTitle>
          <CardDescription>{t('settings.notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-md border bg-background/50">
                <Label htmlFor="quran-reminders" className="flex flex-col gap-1">
                  <span>{t('settings.notifications.quranReminders')}</span>
                  <span className="text-xs text-muted-foreground">{t('settings.notifications.quranReminders.description')}</span>
                </Label>
                <Switch
                  id="quran-reminders"
                  checked={quranReminders}
                  onCheckedChange={setQuranReminders}
                  aria-label={t('settings.notifications.quranReminders')}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-background/50">
                <Label htmlFor="hadith-reminders" className="flex flex-col gap-1">
                  <span>{t('settings.notifications.hadithReminders')}</span>
                   <span className="text-xs text-muted-foreground">{t('settings.notifications.hadithReminders.description')}</span>
                </Label>
                <Switch
                  id="hadith-reminders"
                  checked={hadithReminders}
                  onCheckedChange={setHadithReminders}
                  aria-label={t('settings.notifications.hadithReminders')}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-background/50">
                <Label htmlFor="tasawwuf-reminders" className="flex flex-col gap-1">
                  <span>{t('settings.notifications.tasawwufReminders')}</span>
                  <span className="text-xs text-muted-foreground">{t('settings.notifications.tasawwufReminders.description')}</span>
                </Label>
                <Switch
                  id="tasawwuf-reminders"
                  checked={tasawwufReminders}
                  onCheckedChange={setTasawwufReminders}
                  aria-label={t('settings.notifications.tasawwufReminders')}
                />
              </div>
            </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center"><DatabaseZap className="mr-2 h-6 w-6 text-primary" />{t('settings.data.title')}</CardTitle>
            <CardDescription>{t('settings.data.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button onClick={handleExportHistory} variant="outline" className="w-full sm:w-auto">{t('settings.data.exportChatHistory')}</Button>
            <p className="text-xs text-muted-foreground">{t('settings.data.exportChatHistory.description')}</p>
            <Button onClick={handleClearAllData} variant="destructive" className="w-full sm:w-auto">{t('settings.data.clearAllData')}</Button>
            <p className="text-xs text-muted-foreground">{t('settings.data.clearAllData.description')}</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center"><HelpCircleIcon className="mr-2 h-6 w-6 text-primary" />{t('settings.support.title')}</CardTitle>
            <CardDescription>{t('settings.support.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            <Button variant="link" className="p-0 h-auto text-base text-accent hover:underline" asChild>
                <a href="#" onClick={(e) => {e.preventDefault(); toast({title: "Conceptual Link", description: "This would lead to a Help/FAQ page."})}}>{t('settings.support.help')}</a>
            </Button>
            <br />
            <Button variant="link" className="p-0 h-auto text-base text-accent hover:underline" asChild>
                <a href="#" onClick={(e) => {e.preventDefault(); toast({title: "Conceptual Link", description: "This would open a form or mailto link to report an issue."})}}>{t('settings.support.reportIssue')}</a>
            </Button>
             <br />
            <Button variant="link" className="p-0 h-auto text-base text-accent hover:underline" asChild>
                <a href="#" onClick={(e) => {e.preventDefault(); toast({title: "Conceptual Link", description: "This would lead to a Privacy Policy page."})}}>{t('settings.support.privacyPolicy')}</a>
            </Button>
             <br />
            <Button variant="link" className="p-0 h-auto text-base text-accent hover:underline" asChild>
                <a href="#" onClick={(e) => {e.preventDefault(); toast({title: "Conceptual Link", description: "This would lead to a Terms of Service page."})}}>{t('settings.support.termsOfService')}</a>
            </Button>
        </CardContent>
      </Card>

       <CardFooter className="flex justify-center pt-4">
          <Button onClick={handlePreferencesSave} disabled={isSavingPreferences} className="min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground">
            {isSavingPreferences && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('settings.saveButton')}
          </Button>
      </CardFooter>
    </div>
  );
}
