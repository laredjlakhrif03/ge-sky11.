import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpLeft,
  ArrowUpDown,
  Bell,
  Bot,
  Boxes,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  CircleHelp,
  Command,
  FileText,
  FileSpreadsheet,
  Download,
  Filter,
  Gauge,
  LayoutDashboard,
  Loader2,
  Megaphone,
  MoreHorizontal,
  PackageCheck,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WalletCards,
  X,
  CheckCircle2,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Section = "overview" | "products" | "customers" | "campaigns" | "analytics" | "agents";
type Product = { id: number; name: string; sku: string; category: string; price: number; stock: number; state: "نشط" | "منخفض" | "مسودة" };

type NavItem = { id: Section; label: string; icon: LucideIcon; badge?: string };

const navItems: NavItem[] = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "products", label: "المنتجات والكتالوج", icon: PackageCheck, badge: "128" },
  { id: "customers", label: "العملاء و CRM", icon: Users },
  { id: "campaigns", label: "التسويق والحملات", icon: Megaphone, badge: "4" },
  { id: "analytics", label: "التحليلات والتقارير", icon: TrendingUp },
  { id: "agents", label: "وكلاء الذكاء الاصطناعي", icon: Bot, badge: "جديد" },
];

const initialProducts: Product[] = [
  { id: 1, name: "حذاء رياضي Urban X", sku: "URB-2048", category: "الأحذية", price: 12900, stock: 42, state: "نشط" },
  { id: 2, name: "حقيبة ظهر Atlas", sku: "ATL-1104", category: "الإكسسوارات", price: 8600, stock: 8, state: "منخفض" },
  { id: 3, name: "سماعات AirBeat Pro", sku: "AIR-3902", category: "الإلكترونيات", price: 15500, stock: 23, state: "نشط" },
  { id: 4, name: "قميص كتان صيفي", sku: "LIN-7781", category: "الأزياء", price: 4900, stock: 0, state: "مسودة" },
];

const formatDZD = (value: number) => `${new Intl.NumberFormat("ar-DZ").format(value)} دج`;
const formatNumber = (value: number) => new Intl.NumberFormat("ar-DZ").format(value);

function downloadCsv(filename: string, rows: string[][]) {
  const csv = "\uFEFF" + rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadExcel(filename: string, rows: string[][]) {
  const table = rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${cell}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("");
  const html = `<html><head><meta charset="utf-8"></head><body><table>${table}</table></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "application/vnd.ms-excel" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function openPdfReport(title: string, rows: string[][]) {
  const reportWindow = window.open("", "_blank", "width=900,height=700");
  if (!reportWindow) return false;
  const table = rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${cell}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("");
  reportWindow.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:36px;color:#102b4a}h1{color:#0f2747}p{color:#718096}table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border:1px solid #dce6ed;padding:12px;text-align:right}th{background:#e8f5fb}@media print{button{display:none}}</style></head><body><h1>${title}</h1><p>تقرير GE_Sky — ${new Date().toLocaleDateString("ar-DZ")}</p><table>${table}</table><button onclick="window.print()">طباعة / حفظ كـ PDF</button><script>window.onload=()=>window.print()</script></body></html>`);
  reportWindow.document.close();
  return true;
}

function ExportActions({ compact = false, onNotice }: { compact?: boolean; onNotice?: (message: string, tone?: "success" | "error") => void }) {
  const rows = [["المؤشر", "القيمة", "التفاصيل"], ["نمو الإيرادات", "+24.8%", "مقارنة بالفترة السابقة"], ["متوسط قيمة الطلب", "10,294 دج", "جميع القنوات"], ["صافي الربح", "384,200 دج", "بعد التكاليف"]];
  const exportCsv = () => { downloadExcel(`ge-sky-report-${Date.now()}.xls`, rows); onNotice?.("تم تنزيل التقرير بصيغة Excel بنجاح"); };
  const exportPdf = () => { const opened = openPdfReport("تقرير أداء GE_Sky", rows); onNotice?.(opened ? "تم فتح تقرير PDF؛ اختر حفظ كـ PDF من نافذة الطباعة" : "تعذر فتح نافذة PDF، تحقق من السماح بالنوافذ المنبثقة", opened ? "success" : "error"); };
  return <div className="flex flex-wrap items-center gap-2"><button onClick={exportCsv} className={compact ? "ghost-button" : "secondary-button"} title="تصدير متوافق مع Excel"><FileSpreadsheet size={15} /> {!compact && "Excel"}</button><button onClick={exportPdf} className={compact ? "ghost-button" : "secondary-button"} title="فتح نسخة للطباعة والحفظ كـ PDF"><FileText size={15} /> {!compact && "PDF"}</button></div>;
}

function MetricCard({ icon: Icon, label, value, detail, trend, tone = "blue" }: { icon: LucideIcon; label: string; value: string; detail: string; trend: string; tone?: "blue" | "green" | "amber" | "violet" }) {
  const tones = {
    blue: "bg-[#e8f5fb] text-[#1286aa]",
    green: "bg-[#e8f8f0] text-[#0c9c62]",
    amber: "bg-[#fff5e2] text-[#cc8111]",
    violet: "bg-[#f1edff] text-[#7655d9]",
  };
  return (
    <article className="metric-card group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#718096]">{label}</p>
          <p className="mt-2 text-[26px] font-bold tracking-tight text-[#102b4a]">{value}</p>
        </div>
        <div className={`icon-box ${tones[tone]}`}><Icon size={19} strokeWidth={2.2} /></div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#e9f9f0] px-2 py-1 font-bold text-[#119661]"><ArrowUpLeft size={12} />{trend}</span>
        <span className="text-[#8793a4]">{detail}</span>
      </div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1b9bc0]">{eyebrow}</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#102b4a]">{title}</h1>
        <p className="mt-2 text-sm text-[#718096]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (section: Section) => void }) {
  const chart = [42, 52, 48, 68, 62, 76, 71, 86, 82, 92, 88, 98];
  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeading eyebrow="مركز القيادة" title="صباح الخير، فريق GE_Sky" description="هذه صورة موحّدة لأداء متجرك خلال آخر 30 يوماً." action={<button className="primary-button"><CalendarDays size={16} /> آخر 30 يوماً <ChevronDown size={15} /></button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CircleDollarSign} label="إجمالي المبيعات" value="1,284,600 دج" detail="مقارنة بالشهر السابق" trend="18.6%" tone="blue" />
        <MetricCard icon={ShoppingBag} label="الطلبات" value="1,248" detail="منذ بداية الشهر" trend="12.4%" tone="green" />
        <MetricCard icon={Users} label="العملاء النشطون" value="8,642" detail="عملاء متفاعلون" trend="8.2%" tone="violet" />
        <MetricCard icon={Target} label="معدل التحويل" value="4.82%" detail="من زيارات المتجر" trend="0.8%" tone="amber" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <section className="panel-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#edf1f5] px-6 py-5"><div><h2 className="font-bold text-[#193957]">اتجاه المبيعات</h2><p className="mt-1 text-xs text-[#8a97a8]">الإيرادات اليومية بالدينار الجزائري</p></div><button className="ghost-button">تصدير التقرير <ArrowDownLeft size={15} /></button></div>
          <div className="px-6 pb-5 pt-7">
            <div className="flex items-end justify-between"><p className="text-3xl font-bold text-[#102b4a]">42,860 <span className="text-sm font-medium text-[#8a97a8]">دج / اليوم</span></p><span className="rounded-full bg-[#e9f9f0] px-2 py-1 text-xs font-bold text-[#119661]">+18.6%</span></div>
            <div className="relative mt-8 h-52"><div className="chart-grid absolute inset-0" /> <div className="relative flex h-full items-end gap-2 sm:gap-3">{chart.map((height, index) => <div key={index} className="group relative flex h-full flex-1 items-end"><div className="chart-bar w-full" style={{ height: `${height}%`, animationDelay: `${index * 40}ms` }} /><span className="absolute -bottom-6 w-full text-center text-[10px] text-[#99a4b2]">{index + 1}</span></div>)}</div></div>
            <div className="mt-9 flex items-center justify-between text-xs text-[#8a97a8]"><span>منذ 12 أغسطس</span><span>اليوم</span></div>
          </div>
        </section>
        <section className="panel-card">
          <div className="flex items-start justify-between px-6 py-5"><div><h2 className="font-bold text-[#193957]">أداء القنوات</h2><p className="mt-1 text-xs text-[#8a97a8]">من أين تأتي مبيعاتك؟</p></div><button className="icon-button"><MoreHorizontal size={18} /></button></div>
          <div className="space-y-5 px-6 pb-6">{[["متجر الويب", "52%", "#1b9bc0"], ["Instagram", "26%", "#7655d9"], ["Facebook", "14%", "#3f7ee8"], ["أخرى", "8%", "#e5b24d"]].map(([label, percentage, color]) => <div key={label}><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium text-[#42566e]">{label}</span><span className="font-bold text-[#193957]">{percentage}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#eef2f6]"><div className="h-full rounded-full" style={{ width: percentage, background: color }} /></div></div>)}</div>
          <div className="mx-6 mb-6 rounded-2xl bg-[#f5fbfd] p-4"><div className="flex items-center gap-2 text-sm font-bold text-[#193957]"><Sparkles size={16} className="text-[#1b9bc0]" /> توصية GE_Sky AI</div><p className="mt-2 text-xs leading-6 text-[#718096]">حملة إعادة الاستهداف على Instagram تحقق أفضل عائد. اقترح زيادة الميزانية بنسبة 15%.</p><button onClick={() => onNavigate("campaigns")} className="mt-3 text-xs font-bold text-[#1286aa]">مراجعة التوصية ←</button></div>
        </section>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <section className="panel-card"><div className="flex items-center justify-between border-b border-[#edf1f5] px-6 py-5"><h2 className="font-bold text-[#193957]">صحة العمليات</h2><span className="status-pill status-active"><Activity size={12} /> مستقر</span></div><div className="grid grid-cols-2 gap-3 p-5">{[["معدل تنفيذ الطلبات", "96.4%", "green"], ["رضا العملاء", "4.7 / 5", "blue"], ["زمن الاستجابة", "14 دقيقة", "violet"], ["مخزون منخفض", "8 منتجات", "amber"]].map(([label, value, tone]) => <div key={label} className="rounded-2xl bg-[#f8fafc] p-4"><p className="text-xs text-[#8793a4]">{label}</p><p className={`mt-2 text-lg font-bold ${tone === "green" ? "text-[#0c9c62]" : tone === "amber" ? "text-[#cc8111]" : "text-[#193957]"}`}>{value}</p></div>)}</div></section>
        <section className="panel-card"><div className="flex items-center justify-between border-b border-[#edf1f5] px-6 py-5"><div><h2 className="font-bold text-[#193957]">آخر النشاطات</h2><p className="mt-1 text-xs text-[#8a97a8]">تحديثات مباشرة من مساحة العمل</p></div><button onClick={() => onNavigate("analytics")} className="text-xs font-bold text-[#1286aa]">عرض الكل</button></div><div className="divide-y divide-[#edf1f5]">{[["تم شحن الطلب #GE-10482", "منذ 8 دقائق", "#e8f8f0", PackageCheck], ["تم إنشاء حملة رمضان المبكر", "منذ 32 دقيقة", "#e8f5fb", Megaphone], ["انضمام عميل جديد: سارة بن عمر", "منذ ساعة", "#f1edff", Users]].map(([title, time, bg, Icon]) => <div key={title as string} className="flex items-center gap-3 px-6 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: bg as string }}><Icon size={16} className="text-[#2182a2]" /></div><div className="flex-1"><p className="text-sm font-bold text-[#42566e]">{title as string}</p><p className="mt-1 text-xs text-[#9aa5b1]">{time as string}</p></div><MoreHorizontal size={17} className="text-[#aeb8c4]" /></div>)}</div></section>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [status, setStatus] = useState("الكل");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const categories = useMemo(() => ["الكل", ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const activeFilters = [category !== "الكل", status !== "الكل", Boolean(minPrice), Boolean(maxPrice), stockOnly].filter(Boolean).length;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 260);
    return () => window.clearTimeout(timer);
  }, [query, category, status, sortBy, minPrice, maxPrice, stockOnly]);

  const filtered = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesQuery = !lowerQuery || `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(lowerQuery);
      const matchesCategory = category === "الكل" || product.category === category;
      const matchesStatus = status === "الكل" || product.state === status;
      const matchesMin = !minPrice || product.price >= Number(minPrice);
      const matchesMax = !maxPrice || product.price <= Number(maxPrice);
      const matchesStock = !stockOnly || product.stock > 0;
      return matchesQuery && matchesCategory && matchesStatus && matchesMin && matchesMax && matchesStock;
    });
    return result.sort((a, b) => sortBy === "priceAsc" ? a.price - b.price : sortBy === "priceDesc" ? b.price - a.price : sortBy === "stockAsc" ? a.stock - b.stock : sortBy === "name" ? a.name.localeCompare(b.name, "ar") : b.id - a.id);
  }, [products, query, category, status, minPrice, maxPrice, stockOnly, sortBy]);

  const addProduct = () => {
    if (!newName.trim()) { setToast({ message: "اكتب اسم المنتج قبل حفظ المسودة", tone: "error" }); return; }
    setProducts((items) => [{ id: Date.now(), name: newName.trim(), sku: "NEW-0001", category: "عام", price: 0, stock: 0, state: "مسودة" }, ...items]);
    setNewName("");
    setShowForm(false);
    setToast({ message: "تمت إضافة مسودة المنتج بنجاح إلى الكتالوج", tone: "success" });
  };
  const resetFilters = () => { setCategory("الكل"); setStatus("الكل"); setMinPrice(""); setMaxPrice(""); setStockOnly(false); setQuery(""); setSortBy("newest"); };
  const skeletonRows = Array.from({ length: 3 });
  return <div className="space-y-6 animate-fade-in">
    <SectionHeading eyebrow="التجارة الإلكترونية" title="المنتجات والكتالوج" description="ابحث، صفِّ وفرز المنتجات بسرعة للوصول إلى العنصر المحدد." action={<button onClick={() => setShowForm((value) => !value)} className="primary-button"><Plus size={17} /> إضافة منتج</button>} />
    {toast && <div className={`toast-message ${toast.tone === "error" ? "toast-error" : "toast-success"}`}><CheckCircle2 size={18} /><span>{toast.message}</span><button onClick={() => setToast(null)} className="mr-auto"><X size={15} /></button></div>}
    {showForm && <div className="panel-card flex flex-col gap-3 p-5 sm:flex-row"><input autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addProduct()} className="field flex-1" placeholder="اسم المنتج الجديد" /><button onClick={addProduct} className="primary-button"><CheckCircle2 size={16} /> حفظ المسودة</button><button onClick={() => setShowForm(false)} className="secondary-button">إلغاء</button></div>}
    <div className="grid gap-4 sm:grid-cols-3"><div className="stat-strip"><Boxes size={18} className="text-[#1b9bc0]" /><div><p className="text-xs text-[#8793a4]">إجمالي المنتجات</p><strong>{products.length + 124}</strong></div></div><div className="stat-strip"><PackageCheck size={18} className="text-[#0c9c62]" /><div><p className="text-xs text-[#8793a4]">نتائج العرض الحالي</p><strong>{filtered.length}</strong></div></div><div className="stat-strip"><Zap size={18} className="text-[#cc8111]" /><div><p className="text-xs text-[#8793a4]">تحتاج إعادة تخزين</p><strong>8</strong></div></div></div>
    <section className="panel-card overflow-hidden"><div className="flex flex-col gap-3 border-b border-[#edf1f5] px-5 py-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="relative flex-1"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="field w-full pr-10" placeholder="ابحث بالاسم أو SKU أو التصنيف" /></div><button onClick={() => setShowFilters((value) => !value)} className={`secondary-button ${showFilters ? "filter-active" : ""}`}><SlidersHorizontal size={15} /> تصفية متقدمة {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}</button><label className="flex items-center gap-2 text-xs font-semibold text-[#718096]"><ArrowUpDown size={15} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="sort-select"><option value="newest">الأحدث أولاً</option><option value="name">الاسم أبجدياً</option><option value="priceAsc">السعر: الأقل</option><option value="priceDesc">السعر: الأعلى</option><option value="stockAsc">المخزون: الأقل</option></select></label></div>{showFilters && <div className="filter-panel"><div><label className="filter-label">التصنيف</label><select value={category} onChange={(event) => setCategory(event.target.value)} className="field w-full">{categories.map((item) => <option key={item}>{item}</option>)}</select></div><div><label className="filter-label">الحالة</label><select value={status} onChange={(event) => setStatus(event.target.value)} className="field w-full"><option>الكل</option><option>نشط</option><option>منخفض</option><option>مسودة</option></select></div><div><label className="filter-label">السعر الأدنى</label><input value={minPrice} onChange={(event) => setMinPrice(event.target.value.replace(/\D/g, ""))} className="field w-full" inputMode="numeric" placeholder="0 دج" /></div><div><label className="filter-label">السعر الأعلى</label><input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))} className="field w-full" inputMode="numeric" placeholder="∞" /></div><label className="flex items-center gap-2 self-end pb-2 text-xs font-semibold text-[#53667b]"><input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} className="accent-[#1b9bc0]" /> متوفر في المخزون فقط</label><button onClick={resetFilters} className="ghost-button self-end">مسح الفلاتر</button></div>}</div><div className="relative overflow-x-auto"><table className="data-table"><thead><tr><th>المنتج</th><th>التصنيف</th><th>السعر</th><th>المخزون</th><th>الحالة</th><th /></tr></thead><tbody>{isFiltering ? skeletonRows.map((_, index) => <tr key={index} className="skeleton-row"><td colSpan={6}><div className="skeleton-line" /></td></tr>) : filtered.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><Search size={24} /><p>لا توجد منتجات مطابقة للفلاتر الحالية</p><button onClick={resetFilters} className="text-xs font-bold text-[#1286aa]">مسح الفلاتر وعرض الكل</button></div></td></tr> : filtered.map((product) => <tr key={product.id}><td><div><p className="font-bold text-[#193957]">{product.name}</p><p className="mt-1 text-xs text-[#9aa5b1]">{product.sku}</p></div></td><td>{product.category}</td><td className="font-bold">{formatDZD(product.price)}</td><td><span className={product.stock < 10 ? "font-bold text-[#cc8111]" : "font-semibold text-[#42566e]"}>{product.stock} وحدة</span></td><td><span className={`status-pill ${product.state === "نشط" ? "status-active" : product.state === "منخفض" ? "status-warning" : "status-draft"}`}>{product.state}</span></td><td><button className="icon-button"><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></section>
  </div>;
}

function Customers() {
  const customers = [["سارة بن عمر", "sara.benomar@email.com", "18,400 دج", "عميل مميز", "#e8f5fb"], ["ياسين قادري", "yacine.q@email.com", "12,850 دج", "نشط", "#e8f8f0"], ["مريم عيساوي", "maryem.a@email.com", "8,210 دج", "في المتابعة", "#fff5e2"], ["أمين بلحاج", "amine.b@email.com", "6,940 دج", "نشط", "#e8f8f0"]];
  return <div className="space-y-6 animate-fade-in"><SectionHeading eyebrow="علاقات العملاء" title="العملاء و CRM" description="افهم جمهورك، قسّم الشرائح وابنِ رحلات أكثر ذكاءً." action={<button className="primary-button"><Plus size={17} /> عميل جديد</button>} /><div className="grid gap-4 sm:grid-cols-3"><MetricCard icon={Users} label="قاعدة العملاء" value="8,642" detail="إجمالي المسجلين" trend="8.2%" tone="blue" /><MetricCard icon={CircleDollarSign} label="القيمة الدائمة" value="24,680 دج" detail="متوسط لكل عميل" trend="11.8%" tone="green" /><MetricCard icon={Zap} label="معدل التفاعل" value="68.4%" detail="آخر 30 يوماً" trend="4.6%" tone="violet" /></div><section className="panel-card overflow-hidden"><div className="flex items-center justify-between border-b border-[#edf1f5] px-5 py-4"><div className="relative w-full max-w-sm"><Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa5b1]" /><input className="field w-full pr-10" placeholder="ابحث عن عميل" /></div><button className="secondary-button"><Filter size={15} /> الشرائح</button></div><div className="divide-y divide-[#edf1f5]">{customers.map(([name, email, value, segment, bg]) => <div key={name} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"><div className="avatar" style={{ background: bg }}>{name.slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="font-bold text-[#193957]">{name}</p><p className="mt-1 truncate text-xs text-[#8a97a8]">{email}</p></div><div className="sm:w-32"><p className="text-xs text-[#9aa5b1]">القيمة الدائمة</p><p className="mt-1 text-sm font-bold text-[#42566e]">{value}</p></div><span className="status-pill status-active w-fit">{segment}</span><button className="icon-button"><MoreHorizontal size={17} /></button></div>)}</div></section></div>;
}

function Campaigns() {
  const [activeCampaign, setActiveCampaign] = useState<number | null>(2);
  const campaigns = [[1, "عودة المدارس 2026", "Instagram + Facebook", "42,600 دج", "3.84x", "نشطة", "#f1edff"], [2, "إعادة استهداف الزوار", "إعلانات الويب", "18,200 دج", "5.12x", "نشطة", "#e8f5fb"], [3, "رسالة العملاء القدامى", "Email / CRM", "0 دج", "—", "مسودة", "#fff5e2"]];
  return <div className="space-y-6 animate-fade-in"><SectionHeading eyebrow="النمو والتسويق" title="الحملات التسويقية" description="خطط، نفّذ وقِس أثر كل قناة تسويقية في مكان واحد." action={<button className="primary-button"><Plus size={17} /> حملة جديدة</button>} /><div className="grid gap-4 sm:grid-cols-3"><div className="dark-stat"><Megaphone size={18} /><p>الحملات النشطة</p><strong>4</strong></div><div className="stat-strip"><CircleDollarSign size={18} className="text-[#0c9c62]" /><div><p className="text-xs text-[#8793a4]">الإنفاق هذا الشهر</p><strong>68,400 دج</strong></div></div><div className="stat-strip"><TrendingUp size={18} className="text-[#7655d9]" /><div><p className="text-xs text-[#8793a4]">متوسط العائد ROAS</p><strong>4.24x</strong></div></div></div><section className="panel-card overflow-hidden"><div className="border-b border-[#edf1f5] px-5 py-4"><h2 className="font-bold text-[#193957]">مصفوفة الحملات</h2><p className="mt-1 text-xs text-[#8a97a8]">اضغط على المفتاح لتشغيل أو إيقاف حملة</p></div><div className="divide-y divide-[#edf1f5]">{campaigns.map(([id, name, channel, spend, roas, state, bg]) => <div key={id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center"><div className="campaign-mark" style={{ background: bg as string }}><Megaphone size={18} /></div><div className="min-w-0 flex-1"><p className="font-bold text-[#193957]">{name as string}</p><p className="mt-1 text-xs text-[#8a97a8]">{channel as string}</p></div><div className="grid grid-cols-2 gap-8 sm:w-48"><div><p className="text-xs text-[#9aa5b1]">الإنفاق</p><p className="mt-1 text-sm font-bold text-[#42566e]">{spend as string}</p></div><div><p className="text-xs text-[#9aa5b1]">العائد</p><p className="mt-1 text-sm font-bold text-[#0c9c62]">{roas as string}</p></div></div><span className={`status-pill ${state === "نشطة" ? "status-active" : "status-warning"}`}>{state as string}</span><button onClick={() => setActiveCampaign(activeCampaign === id ? null : id as number)} className={`toggle ${activeCampaign === id ? "toggle-on" : ""}`} aria-label="تبديل الحملة"><span /></button><button className="icon-button"><MoreHorizontal size={17} /></button></div>)}</div></section></div>;
}

function Analytics() {
  const [notice, setNotice] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(null), 3600); return () => window.clearTimeout(timer); }, [notice]);
  return <div className="space-y-6 animate-fade-in"><SectionHeading eyebrow="ذكاء الأعمال" title="التحليلات والتقارير" description="حوّل بياناتك اليومية إلى قرارات واضحة قابلة للتنفيذ." action={<ExportActions onNotice={(message, tone = "success") => setNotice({ message, tone })} />} />{notice && <div className={`toast-message ${notice.tone === "error" ? "toast-error" : "toast-success"}`}><Download size={18} /><span>{notice.message}</span><button onClick={() => setNotice(null)} className="mr-auto"><X size={15} /></button></div>}<div className="grid gap-4 sm:grid-cols-3"><MetricCard icon={TrendingUp} label="نمو الإيرادات" value="+24.8%" detail="مقارنة بالفترة السابقة" trend="6.2%" tone="green" /><MetricCard icon={Activity} label="متوسط قيمة الطلب" value="10,294 دج" detail="جميع القنوات" trend="3.7%" tone="blue" /><MetricCard icon={WalletCards} label="صافي الربح" value="384,200 دج" detail="بعد التكاليف" trend="16.1%" tone="violet" /></div><div className="grid gap-6 lg:grid-cols-2"><section className="panel-card p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-[#193957]">مؤشر النمو الشهري</h2><p className="mt-1 text-xs text-[#8a97a8]">الأداء مقابل الهدف</p></div><span className="rounded-full bg-[#e9f9f0] px-2 py-1 text-xs font-bold text-[#119661]">فوق الهدف</span></div><div className="flex items-center gap-6"><div className="ring-chart"><div><strong>78%</strong><span>من الهدف</span></div></div><div className="space-y-4 text-sm"><div><p className="text-xs text-[#9aa5b1]">الهدف الشهري</p><p className="mt-1 font-bold text-[#193957]">1,600,000 دج</p></div><div><p className="text-xs text-[#9aa5b1]">المحقق حتى الآن</p><p className="mt-1 font-bold text-[#0c9c62]">1,284,600 دج</p></div></div></div></section><section className="panel-card p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-[#193957]">أفضل المنتجات</h2><p className="mt-1 text-xs text-[#8a97a8]">حسب الإيرادات</p></div><ExportActions compact onNotice={(message, tone = "success") => setNotice({ message, tone })} /></div><div className="space-y-4">{[["حذاء Urban X", "284,400 دج", "82%"], ["سماعات AirBeat Pro", "198,200 دج", "61%"], ["حقيبة Atlas", "144,800 دج", "48%"]].map(([name, value, width], index) => <div key={name}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-[#42566e]">{index + 1}. {name}</span><span className="font-bold text-[#193957]">{value}</span></div><div className="h-2 rounded-full bg-[#eef2f6]"><div className="h-full rounded-full bg-[#1b9bc0]" style={{ width }} /></div></div>)}</div></section></div></div>;
}

function Agents() {
  const agents = [["مستشار النمو", "يحلل المبيعات ويقترح فرص النمو", "نشط الآن", "#e8f5fb", TrendingUp], ["كاتب المحتوى", "ينشئ نصوص الحملات ووصف المنتجات", "جاهز للعمل", "#f1edff", Sparkles], ["مراقب العمليات", "يتابع المخزون والطلبات والتنبيهات", "نشط الآن", "#e8f8f0", Activity]];
  return <div className="space-y-6 animate-fade-in"><SectionHeading eyebrow="ذكاء GE_Sky" title="وكلاء الذكاء الاصطناعي" description="فريق رقمي يعمل خلف الكواليس ليمنحك وقتاً أكبر للقرارات المهمة." action={<button className="primary-button"><Bot size={17} /> إعداد وكيل</button>} /><div className="agent-hero"><div className="relative z-10 max-w-xl"><span className="eyebrow-light"><Sparkles size={13} /> نظام متعدد الوكلاء</span><h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">ذكاء عملي،<br /><span className="text-[#83d7ec]">يعمل لصالح تجارتك.</span></h2><p className="mt-4 max-w-md text-sm leading-7 text-[#c7deea]">تعاون بين وكلاء متخصصين يتعلمون من بياناتك ويحولون الإشارات المبعثرة إلى خطوات واضحة.</p><button className="mt-6 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#102b4a] transition hover:bg-[#e8f5fb]">عرض سجل القرارات ←</button></div><div className="agent-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="orbit-core"><Bot size={28} /></div><div className="orbit-node node-one"><TrendingUp size={15} /></div><div className="orbit-node node-two"><Sparkles size={15} /></div><div className="orbit-node node-three"><Activity size={15} /></div></div></div><div className="grid gap-4 lg:grid-cols-3">{agents.map(([name, description, state, bg, Icon]) => <section key={name as string} className="panel-card p-5"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: bg as string }}><Icon size={21} className="text-[#1286aa]" /></div><span className="status-pill status-active">{state as string}</span></div><h3 className="mt-5 font-bold text-[#193957]">{name as string}</h3><p className="mt-2 text-sm leading-6 text-[#718096]">{description as string}</p><button className="mt-5 text-xs font-bold text-[#1286aa]">فتح مساحة الوكيل ←</button></section>)}</div></div>;
}

export default function Home() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionContent = { overview: <Overview onNavigate={setSection} />, products: <Products />, customers: <Customers />, campaigns: <Campaigns />, analytics: <Analytics />, agents: <Agents /> };
  const currentLabel = navItems.find((item) => item.id === section)?.label ?? "نظرة عامة";
  return <div className="app-shell" dir="rtl">
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}><div className="brand"><div className="brand-mark"><span>G</span></div><div><p className="brand-name">GE_Sky</p><p className="brand-subtitle">نظام تشغيل التجارة</p></div><button onClick={() => setSidebarOpen(false)} className="sidebar-close"><X size={18} /></button></div><div className="workspace-switcher"><div className="workspace-avatar">أ</div><div className="min-w-0 flex-1"><p className="truncate text-xs text-[#8fa0b1]">مساحة العمل</p><p className="truncate text-sm font-bold text-white">أطلس للتجارة</p></div><ChevronDown size={15} className="text-[#87a1b5]" /></div><nav className="mt-7 flex-1"><p className="nav-label">مساحة العمل</p><div className="space-y-1">{navItems.map(({ id, label, icon: Icon, badge }) => <button key={id} onClick={() => { setSection(id); setSidebarOpen(false); }} className={`nav-item ${section === id ? "nav-item-active" : ""}`}><Icon size={18} /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</button>)}</div><p className="nav-label mt-8">النظام</p><button className="nav-item"><Settings2 size={18} /><span>الإعدادات</span></button><button className="nav-item"><CircleHelp size={18} /><span>مركز المساعدة</span></button></nav><div className="sidebar-footer"><div className="ai-status"><span className="pulse-dot" /><div><p className="text-xs font-bold text-white">GE_Sky AI متصل</p><p className="mt-1 text-[11px] text-[#89a5b8]">يراقب عملياتك الآن</p></div></div><div className="user-row"><div className="avatar avatar-dark">م</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">محمد بن سالم</p><p className="truncate text-[11px] text-[#89a5b8]">مالك الحساب</p></div><MoreHorizontal size={16} className="text-[#89a5b8]" /></div></div></aside>
    {sidebarOpen && <button aria-label="إغلاق القائمة" onClick={() => setSidebarOpen(false)} className="mobile-overlay" />}
    <main className="main-content"><header className="topbar"><div className="flex items-center gap-3"><button onClick={() => setSidebarOpen(true)} className="menu-button"><Command size={18} /></button><div><p className="text-xs text-[#8a97a8]">مساحة العمل / <span className="font-bold text-[#42566e]">{currentLabel}</span></p><p className="mt-1 hidden text-sm font-bold text-[#193957] sm:block">الاثنين، 07 سبتمبر 2026</p></div></div><div className="flex items-center gap-2 sm:gap-3"><button className="icon-button top-icon"><Search size={18} /></button><button className="icon-button top-icon relative"><Bell size={18} /><span className="notification-dot" /></button><div className="top-avatar">م</div></div></header><div className="content-wrap">{sectionContent[section]}</div></main>
  </div>;
}
