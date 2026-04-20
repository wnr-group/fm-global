"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Pencil,
  Trash2,
  Loader2,
  Plus,
  Search,
  LayoutGrid
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PlacementClientProps {
  initialCategories: any[];
  fetchError: string | null;
}

export default function PlacementClient({ initialCategories, fetchError }: PlacementClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("order_asc");

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    roles: "",
    icon_name: "Briefcase",
    display_order: "0"
  });

  // --- Search & Sort Logic ---
  const filteredCategories = initialCategories
    .filter((cat) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesTitle = cat.title.toLowerCase().includes(searchLower);
      const matchesRoles = cat.roles.some((role: string) =>
        role.toLowerCase().includes(searchLower)
      );
      return matchesTitle || matchesRoles;
    })
    .sort((a, b) => {
      if (sortBy === "order_asc") return a.display_order - b.display_order;
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      return 0;
    });

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  const handleEdit = (cat: any) => {
    setFormData({
      id: cat.id,
      title: cat.title,
      roles: cat.roles.join(", "),
      icon_name: cat.icon_name,
      display_order: cat.display_order.toString()
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ id: "", title: "", roles: "", icon_name: "Briefcase", display_order: "0" });
    setIsEditing(false);
    setShowForm(false);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    const payload = {
      title: formData.title,
      roles: formData.roles.split(",").map(r => r.trim()).filter(r => r !== ""),
      icon_name: formData.icon_name,
      display_order: parseInt(formData.display_order)
    };

    const { error } = formData.id
      ? await supabase.from("placement_categories").update(payload).eq("id", formData.id)
      : await supabase.from("placement_categories").insert([payload]);

    setLoading(false);
    if (error) {
      showToast("error", `Save failed: ${error.message}`);
    } else {
      showToast("success", `Category ${formData.id ? "updated" : "created"} successfully.`);
      resetForm();
      router.refresh();
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete category "${title}"?`)) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("placement_categories").delete().eq("id", id);
    setLoading(false);
    if (error) {
      showToast("error", `Delete failed: ${error.message}`);
    } else {
      showToast("success", "Category deleted.");
      router.refresh();
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-medium text-white max-w-sm w-full ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => setToast(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground">Placement Roles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage the categories and roles on the Placement page</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#003d5b] text-white text-sm font-medium hover:bg-[#002d44] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Role Category
          </button>
        )}
      </div>

      {/* Search Bar - Matches your "Students" page style */}
      <div className="bg-background rounded-xl border border-border p-4 flex flex-wrap gap-3 items-center shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by category or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none cursor-pointer"
        >
          <option value="order_asc">Sort by: Order</option>
          <option value="title_asc">Sort by: Name A-Z</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-background rounded-xl border border-border p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[#003d5b] font-medium">
                <PlusCircle className="w-5 h-5" />
                {isEditing ? "Edit Category" : "New Category"}
              </div>
              <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Category Title</label>
              <input
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Skilled Workers" required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Icon Name (Lucide)</label>
              <input
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                value={formData.icon_name}
                onChange={e => setFormData({ ...formData, icon_name: e.target.value })}
                placeholder="Briefcase, Wrench, Shield..."
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Roles (Comma Separated)</label>
              <textarea
                className="w-full p-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 outline-none min-h-[80px]"
                value={formData.roles}
                onChange={e => setFormData({ ...formData, roles: e.target.value })}
                placeholder="Welder, Fabricator, Fitter..." required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Display Order</label>
              <input
                type="number"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                value={formData.display_order}
                onChange={e => setFormData({ ...formData, display_order: e.target.value })}
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-10 rounded-lg bg-[#003d5b] text-white text-sm font-medium hover:bg-[#002d44] disabled:opacity-50 transition-all flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? "Update" : "Save"} Category
              </button>
              <button type="button" onClick={resetForm} className="h-10 px-4 rounded-lg border border-border text-sm font-medium hover:bg-secondary/40 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roles</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3.5 text-muted-foreground w-16">{cat.display_order}</td>
                    <td className="px-4 py-3.5 font-medium text-foreground">{cat.title}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      <div className="flex flex-wrap gap-1">
                        {cat.roles.map((r: string) => (
                          <span key={r} className="px-2 py-0.5 bg-secondary/60 text-foreground rounded text-[10px] font-medium tracking-wide">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button onClick={() => handleEdit(cat)} className="text-xs font-semibold text-[#003d5b] hover:underline">Edit</button>
                        <span className="text-border select-none">|</span>
                        <button onClick={() => handleDelete(cat.id, cat.title)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground italic">
                    No categories found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}