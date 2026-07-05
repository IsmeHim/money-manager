import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Tv,
  Activity,
  GraduationCap,
  HelpCircle,
  Briefcase,
  Store,
  TrendingUp,
  Gift,
  Coins,
} from "lucide-react";

export const CATEGORY_MAP = {
  // Expenses
  "อาหาร": {
    icon: Utensils,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
  },
  "เดินทาง": {
    icon: Car,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  "ช้อปปิ้ง": {
    icon: ShoppingBag,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
  },
  "ค่าบ้าน/บิล": {
    icon: Receipt,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
  "ความบันเทิง": {
    icon: Tv,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
  },
  "สุขภาพ": {
    icon: Activity,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  "การศึกษา": {
    icon: GraduationCap,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
  },
  "อื่นๆ": {
    icon: HelpCircle,
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },

  // Incomes
  "เงินเดือน": {
    icon: Briefcase,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  "ธุรกิจ": {
    icon: Store,
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400",
  },
  "ลงทุน": {
    icon: TrendingUp,
    color: "bg-teal-100 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
  },
  "ของขวัญ": {
    icon: Gift,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
  },
  "รายรับอื่นๆ": {
    icon: Coins,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  },
};

export default function CategoryIcon({ name, className = "w-10 h-10" }) {
  const category = CATEGORY_MAP[name] || {
    icon: HelpCircle,
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };

  const IconComponent = category.icon;

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${category.color} ${className}`}
    >
      <IconComponent className="w-5.5 h-5.5" />
    </div>
  );
}
