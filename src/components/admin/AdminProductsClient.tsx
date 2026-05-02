'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  price: number;
  salePrice?: number;
  brand: string;
  images: string[];
  category: string;
  stockCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}

const CATEGORIES = ['women', 'men', 'kids', 'shoes', 'accessories', 'beauty'];

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', nameAr: '', description: '', descriptionAr: '', category: 'women',
    brand: '', price: '', salePrice: '', stockCount: '100',
    isFeatured: false, isNew: false, isBestSeller: false,
    sizes: '', colors: '', images: '',
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ name: '', nameAr: '', description: '', descriptionAr: '', category: 'women', brand: '', price: '', salePrice: '', stockCount: '100', isFeatured: false, isNew: false, isBestSeller: false, sizes: '', colors: '', images: '' });
    setSheetOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, nameAr: product.nameAr || '', description: product.description, descriptionAr: '',
      category: product.category, brand: product.brand, price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : '', stockCount: String(product.stockCount),
      isFeatured: product.isFeatured, isNew: product.isNew, isBestSeller: product.isBestSeller,
      sizes: '', colors: '', images: product.images?.[0] || '',
    });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name, nameAr: form.nameAr || undefined, description: form.description,
        descriptionAr: form.descriptionAr || undefined, category: form.category,
        brand: form.brand, price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        stockCount: parseInt(form.stockCount), inStock: parseInt(form.stockCount) > 0,
        isFeatured: form.isFeatured, isNew: form.isNew, isBestSeller: form.isBestSeller,
        sizes: JSON.stringify(form.sizes.split(',').map(s => s.trim()).filter(Boolean)),
        colors: JSON.stringify(form.colors.split(',').map(s => s.trim()).filter(Boolean)),
        images: JSON.stringify(form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : []),
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      if (res.ok) {
        setSheetOpen(false);
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#C9A96E]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#C9A96E] px-4 py-2.5 text-sm font-semibold text-[#0F0F0F]">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border/50 hover:bg-accent/30 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                      ) : (
                        <Image src="/images/placeholder-product.svg" alt="No image" fill className="object-cover p-1" sizes="40px" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize">{product.category}</td>
                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3">{product.stockCount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {product.inStock ? 'Active' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(product)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50" onClick={() => setSheetOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed inset-y-0 end-0 z-50 w-full max-w-lg overflow-y-auto bg-background p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setSheetOpen(false)} className="rounded-full p-1.5 hover:bg-accent"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div><label className="mb-1 block text-sm font-medium">Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                <div><label className="mb-1 block text-sm font-medium">Name (Arabic)</label><input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" dir="rtl" /></div>
                <div><label className="mb-1 block text-sm font-medium">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="mb-1 block text-sm font-medium">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]">{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div><label className="mb-1 block text-sm font-medium">Brand</label><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="mb-1 block text-sm font-medium">Price</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                  <div><label className="mb-1 block text-sm font-medium">Sale Price</label><input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                  <div><label className="mb-1 block text-sm font-medium">Stock</label><input type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                </div>
                <div><label className="mb-1 block text-sm font-medium">Sizes (comma-separated)</label><input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="XS, S, M, L, XL" className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                <div><label className="mb-1 block text-sm font-medium">Colors (comma-separated)</label><input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black, Navy, Beige" className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                <div><label className="mb-1 block text-sm font-medium">Image URLs (comma-separated)</label><input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]" /></div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded text-[#C9A96E]" />Featured</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="rounded text-[#C9A96E]" />New</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="rounded text-[#C9A96E]" />Best Seller</label>
                </div>
                <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="w-full rounded-full bg-[#C9A96E] py-3 font-semibold text-[#0F0F0F] disabled:opacity-50">
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
