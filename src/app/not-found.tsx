import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 bg-white rounded-[3rem] p-12 shadow-2xl border border-sky-50">
          <div className="relative">
            <h1 className="text-9xl font-black text-sky-100">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-24 h-24 text-sky-500 animate-spin" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-black text-slate-800">Magic Path Not Found</h2>
            <p className="text-slate-500 font-medium">This corner of our studio hasn't been crafted yet, or it has moved elsewhere.</p>
          </div>
          <Button asChild className="w-full h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-sky-500/20">
            <Link href="/"><Home className="w-5 h-5" /> Back to Studio</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
