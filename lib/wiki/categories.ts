import { BookOpen, Coins, Factory, Truck, ShieldCheck } from "lucide-react";
import { WikiCategory } from "./types";

export const WIKI_CATEGORIES: WikiCategory[] = [
  { id: "basics", title: "Основы системы", icon: BookOpen },
  { id: "finance", title: "Экономика и Финансы", icon: Coins },
  { id: "production", title: "Производство", icon: Factory },
  { id: "inventory", title: "Склад и Закупки", icon: Truck },
  { id: "admin", title: "Администрирование", icon: ShieldCheck },
];
