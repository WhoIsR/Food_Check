// ================================
// FoodCheck — Core Type Definitions
// ================================

export interface IngredientResult {
  original_name: string;
  plain_name: string;
  category: string;
  status: "aman" | "waspada" | "hindari";
  explanation: string;
  flag_for: string[];
  adi?: string;
}

export interface AnalysisResult {
  clean_score: number;
  score_label: string;
  ingredients: IngredientResult[];
}

export type HealthCondition =
  | "diabetes"
  | "hipertensi"
  | "ibu_hamil"
  | "alergi_gluten"
  | "alergi_kacang"
  | "anak";

export interface HealthConditionOption {
  id: HealthCondition;
  label: string;
  icon: string;
}

export const HEALTH_CONDITIONS: HealthConditionOption[] = [
  { id: "diabetes", label: "Diabetes", icon: "drop" },
  { id: "hipertensi", label: "Hipertensi", icon: "heartbeat" },
  { id: "ibu_hamil", label: "Ibu Hamil", icon: "baby" },
  { id: "alergi_gluten", label: "Alergi Gluten", icon: "grain" },
  { id: "alergi_kacang", label: "Alergi Kacang", icon: "nut" },
  { id: "anak", label: "Bayi/Anak", icon: "smiley" },
];

export type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: AnalysisResult }
  | { status: "error"; message: string };
