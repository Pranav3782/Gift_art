"use client";

import { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

const STATUS_MAP: any = {
  'Delivered': { color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
  'Shipped': { color: 'bg-blue-50 text-blue-600', icon: Truck },
  'Pending': { color: 'bg-amber-50 text-amber-600', icon: Clock },
  'RTO': { color: 'bg-rose-50 text-rose-600', icon: AlertCircle },
};

export default function OrdersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (!db) return;
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'Shipped') {
        updates.trackingStatus = 'Shipped';
      } else if (newStatus === 'Delivered') {
        updates.trackingStatus = 'Delivered';
      } else if (newStatus === 'Pending') {
        updates.trackingStatus = 'Order Placed';
      }
      await updateDoc(doc(db, 'orders', orderId), updates);
      toast({ title: "Status Updated", description: `Order status changed to ${newStatus}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update status." });
    }
  };

  const updateOrderTrackingStatus = async (orderId: string, newTrackingStatus: string) => {
    if (!db) return;
    try {
      const updates: any = { trackingStatus: newTrackingStatus };
      if (newTrackingStatus === 'Delivered') {
        updates.status = 'Delivered';
      } else if (newTrackingStatus === 'Shipped') {
        updates.status = 'Shipped';
      }
      await updateDoc(doc(db, 'orders', orderId), updates);
      toast({ title: "Tracking Stage Updated", description: `Order is now ${newTrackingStatus}` });
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update tracking stage." });
    }
  };
  
  const ordersQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  }, [db]);
  
  const { data: orders, loading } = useCollection<any>(ordersQuery);

  const filteredOrders = orders?.filter((o: any) => 
    o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-slate-800 uppercase tracking-tight">Orders Tracking</h1>
          <p className="text-sm text-slate-400 font-medium">Manage and track your customer orders globally.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 h-12 font-black uppercase text-[10px] tracking-widest gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
             <Input 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Search orders, customers..." 
               className="pl-11 h-12 rounded-xl border-slate-100 focus-visible:ring-indigo-500 bg-slate-50/50" 
             />
           </div>
        </div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Order ID</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Customer</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Date</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Total</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Status</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-14">Tracking Stage</TableHead>
                <TableHead className="px-8 text-right h-14"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order: any) => {
                const status = STATUS_MAP[order.status] || STATUS_MAP['Pending'];
                return (
                  <TableRow key={order.id} className="hover:bg-slate-50/30 transition-colors border-slate-50 group">
                    <TableCell className="px-8 font-black text-sm text-slate-800 uppercase">{order.id?.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="font-black text-sm text-slate-800">{order.customerName}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{order.email}</div>
                    </TableCell>
                    <TableCell className="text-sm font-bold text-slate-500">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm font-black text-slate-800">₹{order.total?.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight cursor-pointer hover:brightness-95 transition-all outline-none",
                            status.color
                          )}>
                            <status.icon className="h-3 w-3" />
                            {order.status || 'Pending'}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-xl border border-slate-100 shadow-xl bg-white p-1">
                          {Object.keys(STATUS_MAP).map((s) => (
                            <DropdownMenuItem 
                              key={s} 
                              onClick={() => updateOrderStatus(order.id, s)}
                              className="text-xs font-black uppercase tracking-tight text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-2"
                            >
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight bg-slate-50 text-slate-600 cursor-pointer hover:brightness-95 transition-all outline-none border border-slate-100 font-bold">
                            {order.trackingStatus || 'Order Placed'}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="rounded-xl border border-slate-100 shadow-xl bg-white p-1">
                          {['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((t) => (
                            <DropdownMenuItem 
                              key={t} 
                              onClick={() => updateOrderTrackingStatus(order.id, t)}
                              className="text-xs font-black uppercase tracking-tight text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-2"
                            >
                              {t}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl text-slate-300 hover:text-slate-800">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border border-slate-100 shadow-xl bg-white p-1">
                          <DropdownMenuItem onClick={() => {
                            navigator.clipboard.writeText(order.id);
                            toast({ title: "Copied", description: "Order ID copied to clipboard." });
                          }} className="text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-2">
                            Copy Order ID
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            const addr = `${order.shippingAddress?.line1 || ''}, ${order.shippingAddress?.line2 || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`;
                            navigator.clipboard.writeText(addr);
                            toast({ title: "Copied", description: "Shipping address copied to clipboard." });
                          }} className="text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-2">
                            Copy Address
                          </DropdownMenuItem>
                          {order.phone && (
                            <DropdownMenuItem onClick={() => {
                              window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`, '_blank');
                            }} className="text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer rounded-lg px-3 py-2">
                              WhatsApp Customer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={async () => {
                            if (!db) return;
                            if (confirm("Are you sure you want to delete this order?")) {
                              try {
                                await deleteDoc(doc(db, 'orders', order.id));
                                toast({ title: "Order Deleted", description: "The order has been removed." });
                              } catch (err) {
                                toast({ variant: "destructive", title: "Error", description: "Failed to delete order." });
                              }
                            }
                          }} className="text-xs font-bold text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50 cursor-pointer rounded-lg px-3 py-2">
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="py-32 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <ShoppingBag className="h-8 w-8" />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No orders found.</p>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl">
          <DialogHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-headline font-black text-slate-800 uppercase tracking-tight">
                  Order Details
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                  ID: {selectedOrder?.id}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-slate-100 text-slate-600">
                  {selectedOrder?.status || 'Pending'}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight bg-sky-50 text-sky-600">
                  {selectedOrder?.trackingStatus || 'Order Placed'}
                </span>
              </div>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Customer Info</h3>
                  <div className="space-y-1">
                    <div className="text-sm font-black text-slate-800">{selectedOrder.customerName}</div>
                    <div className="text-xs font-bold text-slate-500">{selectedOrder.email}</div>
                    <div className="text-xs font-bold text-slate-500">Phone: {selectedOrder.phone || 'N/A'}</div>
                    <div className="text-xs font-bold text-slate-500 mt-2 bg-indigo-50 text-indigo-700 px-2 py-1 rounded inline-block">
                      Payment: {selectedOrder.paymentMethod || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Shipping Address</h3>
                  <div className="space-y-1 text-xs text-slate-600 font-bold leading-relaxed">
                    <div>{selectedOrder.shippingAddress?.line1}</div>
                    {selectedOrder.shippingAddress?.line2 && <div>{selectedOrder.shippingAddress?.line2}</div>}
                    <div>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Order Items</h3>
                <div className="border border-slate-50 rounded-2xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-slate-50">
                        <TableHead className="font-black text-[9px] uppercase tracking-wider text-slate-400">Product</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-wider text-slate-400 text-center">Qty</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-wider text-slate-400 text-right">Price</TableHead>
                        <TableHead className="font-black text-[9px] uppercase tracking-wider text-slate-400 text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <TableRow key={item.id || idx} className="border-slate-50">
                          <TableCell className="py-3">
                            <div className="text-xs font-black text-slate-800">{item.name}</div>
                            {item.customization && (
                              <div className="text-[10px] font-black text-pink-600 uppercase tracking-tight mt-0.5 bg-pink-50 px-2 py-0.5 rounded-full inline-block">
                                Name: {item.customization}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-600 text-center py-3">{item.qty}</TableCell>
                          <TableCell className="text-xs font-bold text-slate-600 text-right py-3">₹{item.price}</TableCell>
                          <TableCell className="text-xs font-black text-slate-800 text-right py-3">₹{(item.price * item.qty).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Cost Breakdown Summary */}
              <div className="border-t border-slate-50 pt-4 flex flex-col items-end space-y-1.5 px-2">
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between w-64 text-xs font-bold text-slate-500">
                    <span>Discount:</span>
                    <span className="text-rose-600">-₹{selectedOrder.discountAmount}</span>
                  </div>
                )}
                {selectedOrder.couponCode && (
                  <div className="flex justify-between w-64 text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                    <span>Coupon:</span>
                    <span>{selectedOrder.couponCode}</span>
                  </div>
                )}
                <div className="flex justify-between w-64 text-sm font-black text-slate-800 pt-2 border-t border-slate-50/50">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-50 pt-6">
            <Button 
              onClick={() => setIsDetailsOpen(false)}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-widest px-6"
            >
              Close Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}