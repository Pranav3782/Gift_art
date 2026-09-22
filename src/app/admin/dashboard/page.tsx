
"use client";

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Sparkles,
  Loader2,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useMemo } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AdminDashboard() {
  const db = useFirestore();
  
  const ordersCol = useMemo(() => db ? collection(db, 'orders') : null, [db]);
  const usersCol = useMemo(() => db ? collection(db, 'users') : null, [db]);
  const productsCol = useMemo(() => db ? collection(db, 'products') : null, [db]);
  
  const recentOrdersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
  }, [db]);

  const { data: orders, loading: ordersLoading } = useCollection<any>(ordersCol);
  const { data: customers } = useCollection<any>(usersCol);
  const { data: products } = useCollection<any>(productsCol);
  const { data: recentActivities } = useCollection<any>(recentOrdersQuery);

  const stats = useMemo(() => {
    const totalRevenue = orders?.reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const totalCustomers = customers?.length || 0;
    
    return [
      { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: CreditCard, trend: '+12%', isUp: true },
      { label: 'Orders', value: totalOrders.toString(), icon: ShoppingBag, trend: '+5%', isUp: true },
      { label: 'Customers', value: totalCustomers.toString(), icon: Users, trend: '+18%', isUp: true },
      { label: 'Conversion', value: '3.2%', icon: TrendingUp, trend: 'Stable', isUp: true },
    ];
  }, [orders, customers]);

  const chartData = useMemo(() => {
    if (!orders) return [];
    // Groups orders by day for the last 7 entries
    return orders.slice(0, 7).map((o: any) => ({
      name: o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short' }) : 'Day',
      total: o.total || 0
    })).reverse();
  }, [orders]);

  const statusData = useMemo(() => {
    if (!orders) return [];
    const counts = orders.reduce((acc: any, curr: any) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Studio Overview</h1>
          <p className="text-sm text-slate-500 font-medium italic">Your business health at a glance.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sticky top-0 z-10 bg-white/80 backdrop-blur-xl py-4 -mx-4 px-4 rounded-b-3xl shadow-sm border-b border-slate-100/50">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all duration-500">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn("text-[10px] font-black px-2 py-1 rounded-full", stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
             <CardHeader className="p-8 pb-4">
               <CardTitle className="text-lg font-headline font-black text-slate-800 uppercase tracking-widest">Revenue Flow</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                     <YAxis hide />
                     <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                     <Bar dataKey="total" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                   </BarChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>

           <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
             <CardHeader className="p-8 pb-4 border-b border-slate-50">
               <CardTitle className="text-lg font-headline font-black text-slate-800 uppercase tracking-widest">Recent Sales</CardTitle>
             </CardHeader>
             <CardContent className="p-8">
                <div className="space-y-6">
                   {recentActivities?.map((order: any) => (
                     <div key={order.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center font-black text-indigo-600 shadow-inner">{order.customerName?.[0]}</div>
                           <div>
                              <p className="text-sm font-black text-slate-800">{order.customerName}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{order.email}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-slate-800">₹{order.total?.toLocaleString()}</p>
                           <p className="text-[9px] font-black uppercase text-indigo-500">{order.status}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-slate-900 text-white p-8">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-8">Order Status Distribution</h4>
             <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                       {statusData.map((_, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-4">
                {statusData.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{String(s.name)} ({String(s.value)})</span>
                  </div>
                ))}
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[2.5rem] p-8 bg-indigo-600 text-white relative overflow-hidden group">
             <Sparkles className="absolute top-4 right-4 text-indigo-400 opacity-50 h-8 w-8 animate-pulse" />
             <div className="relative z-10 space-y-6">
                <h4 className="text-lg font-headline font-black uppercase tracking-widest">Inventory Health</h4>
                <p className="text-indigo-100 font-medium text-sm italic">You have {products?.length || 0} products active in the studio catalog.</p>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-white transition-all duration-1000" style={{ width: '85%' }} />
                </div>
                <Link href="/admin/products" className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Manage Catalog</Link>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
