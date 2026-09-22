"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  Globe, 
  Type, 
  Save,
  RefreshCw,
  Sparkles,
  Link2,
  ShieldCheck,
  Search,
  Code,
  LineChart,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function SEOPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const seoRef = useMemo(() => db ? doc(db, 'settings', 'seo') : null, [db]);
  const { data: seoConfig, loading } = useDoc<any>(seoRef);
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  // Analysis State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);

  useEffect(() => {
    if (seoConfig) {
      setFormData(seoConfig);
    }
  }, [seoConfig]);

  const handleSave = async () => {
    if (!db) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'seo'), formData, { merge: true });
      toast({ title: "Settings Saved!", description: "Site-wide SEO configurations updated successfully." });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const runAudit = () => {
    setIsAuditing(true);
    setAuditResults(null);
    
    setTimeout(() => {
      const results = {
        score: 0,
        checks: [
          { name: 'Title Tag', status: !!formData.defaultTitle ? 'pass' : 'fail', desc: formData.defaultTitle ? 'Title is optimized.' : 'Missing global title.' },
          { name: 'Meta Description', status: (formData.defaultDescription?.length > 50) ? 'pass' : 'warn', desc: formData.defaultDescription?.length > 50 ? 'Description length is good.' : 'Description is too short or missing.' },
          { name: 'Open Graph Tags', status: !!formData.ogImage ? 'pass' : 'fail', desc: formData.ogImage ? 'OG Image detected.' : 'Missing social sharing image.' },
          { name: 'Robots.txt', status: !!formData.robotsTxt ? 'pass' : 'warn', desc: formData.robotsTxt ? 'Custom robots rules found.' : 'Using default robots.txt.' },
          { name: 'Canonical Link', status: !!formData.canonicalBase ? 'pass' : 'fail', desc: formData.canonicalBase ? 'Canonical base set.' : 'Missing canonical base URL.' },
          { name: 'Analytics', status: !!formData.gaId ? 'pass' : 'warn', desc: formData.gaId ? 'Google Analytics ID linked.' : 'Missing tracking ID.' }
        ]
      };
      
      const passes = results.checks.filter(c => c.status === 'pass').length;
      results.score = Math.round((passes / results.checks.length) * 100);
      
      setAuditResults(results);
      setIsAuditing(false);
    }, 1500);
  };

  if (loading) {
    return <div className="h-96 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">SEO Control Studio</h1>
          <p className="text-sm text-slate-400 font-medium italic">Optimize how GiftArtStudio appears on search engines and social media.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="rounded-2xl bg-slate-900 hover:bg-slate-800 h-14 px-8 font-black uppercase text-xs tracking-widest gap-2 shadow-xl shadow-slate-100"
        >
           {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} 
           Save Changes
        </Button>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="bg-white p-2 rounded-2xl h-auto border border-slate-100 flex-wrap justify-start gap-2 mb-8">
          <TabsTrigger value="global" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Global Meta</TabsTrigger>
          <TabsTrigger value="social" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Social Graph</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Tracking & Scripts</TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Advanced</TabsTrigger>
          <TabsTrigger value="analysis" className="rounded-xl px-6 py-3 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex items-center gap-2">
            <LineChart className="h-3.5 w-3.5" /> SEO Audit
          </TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TabsContent value="global" className="m-0 space-y-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white space-y-8">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                  <Globe className="h-6 w-6" />
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight text-slate-800">Site-Wide Meta Data</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Default Page Title</Label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        value={formData.defaultTitle || ''} 
                        onChange={e => setFormData({...formData, defaultTitle: e.target.value})}
                        placeholder="GiftArtStudio | Magical Personalized Gifts" 
                        className="pl-11 h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-700" 
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Default Meta Description</Label>
                    <Textarea 
                      value={formData.defaultDescription || ''} 
                      onChange={e => setFormData({...formData, defaultDescription: e.target.value})}
                      placeholder="Describe your studio's magic..." 
                      className="min-h-[120px] rounded-[1.5rem] bg-slate-50/50 border-slate-100 p-6 font-medium text-slate-600 leading-relaxed" 
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Keywords (Comma Separated)</Label>
                    <Input 
                      value={formData.keywords || ''} 
                      onChange={e => setFormData({...formData, keywords: e.target.value})}
                      placeholder="personalized gifts, kids backpacks, custom toys" 
                      className="h-14 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-700" 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="m-0 space-y-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white space-y-8">
                <div className="flex items-center gap-3 text-emerald-600 mb-2">
                  <Link2 className="h-6 w-6" />
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight text-slate-800">Social Graph (OG Tags)</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Twitter @Handle</Label>
                      <Input 
                        value={formData.twitterHandle || ''} 
                        onChange={e => setFormData({...formData, twitterHandle: e.target.value})}
                        placeholder="@giftartstudio" 
                        className="h-12 rounded-xl border-slate-100" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">OG Image URL</Label>
                      <Input 
                        value={formData.ogImage || ''} 
                        onChange={e => setFormData({...formData, ogImage: e.target.value})}
                        placeholder="https://..." 
                        className="h-12 rounded-xl border-slate-100" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">OG Image Preview</Label>
                    <div className="border-2 border-dashed border-slate-100 rounded-[2rem] aspect-video flex flex-col items-center justify-center bg-slate-50/30 group cursor-pointer overflow-hidden relative">
                      {formData.ogImage ? (
                        <img src={formData.ogImage} className="w-full h-full object-cover" alt="OG Preview" />
                      ) : (
                        <div className="text-center opacity-40">
                          <Sparkles className="h-8 w-8 mx-auto text-slate-300" />
                          <p className="text-[9px] font-black uppercase tracking-widest mt-2">No Image Linked</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="m-0 space-y-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white space-y-8">
                <div className="flex items-center gap-3 text-rose-500 mb-2">
                  <ShieldCheck className="h-6 w-6" />
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight text-slate-800">Analytics Integrations</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Google Analytics (G-ID)</Label>
                    <Input 
                      value={formData.gaId || ''} 
                      onChange={e => setFormData({...formData, gaId: e.target.value})}
                      placeholder="G-XXXXXXX" 
                      className="h-12 rounded-xl border-slate-100" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">FB Pixel ID</Label>
                    <Input 
                      value={formData.fbPixelId || ''} 
                      onChange={e => setFormData({...formData, fbPixelId: e.target.value})}
                      placeholder="123456789" 
                      className="h-12 rounded-xl border-slate-100" 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="m-0 space-y-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white space-y-8">
                <div className="flex items-center gap-3 text-slate-600 mb-2">
                  <Code className="h-6 w-6" />
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight text-slate-800">Advanced Crawler Config</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Canonical Base URL</Label>
                    <Input 
                      value={formData.canonicalBase || ''} 
                      onChange={e => setFormData({...formData, canonicalBase: e.target.value})}
                      placeholder="https://giftartstudio.com" 
                      className="h-12 rounded-xl border-slate-100" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Robots.txt</Label>
                    <Textarea 
                      value={formData.robotsTxt || ''} 
                      onChange={e => setFormData({...formData, robotsTxt: e.target.value})}
                      placeholder="User-agent: *..." 
                      className="min-h-[150px] font-mono text-xs p-6 bg-slate-900 text-sky-400 rounded-2xl" 
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="m-0 space-y-8">
              <Card className="border-none shadow-sm rounded-[2.5rem] p-10 bg-white">
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                  {!auditResults ? (
                    <>
                      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <Search className={cn("h-12 w-12", isAuditing && "animate-bounce")} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-headline font-black text-slate-800 uppercase tracking-tight">Real-Time SEO Auditor</h3>
                        <p className="text-sm text-slate-400 font-medium max-w-sm">Scan your global metadata and site configuration for critical SEO flaws.</p>
                      </div>
                      <Button 
                        onClick={runAudit} 
                        disabled={isAuditing}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-14 px-12 font-black uppercase tracking-widest text-xs gap-2"
                      >
                        {isAuditing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                        {isAuditing ? 'Auditing Studio...' : 'Run Analysis Now'}
                      </Button>
                    </>
                  ) : (
                    <div className="w-full space-y-10">
                       <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                          <div className="text-left">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis Result</h4>
                             <p className="text-xs font-bold text-slate-300">Generated just now</p>
                          </div>
                          <Button variant="ghost" onClick={runAudit} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Re-Run Audit</Button>
                       </div>

                       <div className="grid md:grid-cols-2 gap-12 items-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                             <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                  <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                  <circle 
                                    className={cn(auditResults.score > 80 ? "text-emerald-500" : "text-amber-500")} 
                                    strokeWidth="8" 
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * auditResults.score) / 100}
                                    strokeLinecap="round" 
                                    stroke="currentColor" 
                                    fill="transparent" 
                                    r="40" cx="50" cy="50" 
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                   <span className="text-4xl font-black text-slate-800">{auditResults.score}</span>
                                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Score</span>
                                </div>
                             </div>
                             <p className="text-sm font-bold text-slate-600 italic">"Your SEO Health is {auditResults.score > 80 ? 'Excellent' : 'Improving'}"</p>
                          </div>

                          <div className="space-y-4 text-left">
                             {auditResults.checks.map((check: any, i: number) => (
                               <div key={i} className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                  {check.status === 'pass' ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : 
                                   check.status === 'warn' ? <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" /> : 
                                   <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
                                  <div>
                                     <h5 className="font-black text-xs text-slate-800 uppercase tracking-tight">{check.name}</h5>
                                     <p className="text-[10px] text-slate-500 font-medium">{check.desc}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-slate-900 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full w-fit border border-white/10">
                     <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest">SEO Health Tip</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                    "Page titles should be between 50-60 characters for best Google visibility. Descriptions should be unique for every page."
                  </p>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] gap-2">
                     Learn Ranking Strategies
                  </Button>
               </div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
            </Card>

            <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-white space-y-6">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4">Live Preview</h4>
               <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
                     <div className="text-sky-600 text-sm font-medium truncate">{formData.canonicalBase || 'https://giftartstudio.com'}</div>
                     <div className="text-indigo-600 text-lg font-bold leading-tight line-clamp-2">{formData.defaultTitle || 'GiftArtStudio | Magical Personalized Gifts'}</div>
                     <div className="text-slate-500 text-xs leading-relaxed line-clamp-2">{formData.defaultDescription || 'Start typing a description to see how it looks on Google...'}</div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center">Google Search Mockup</p>
               </div>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}