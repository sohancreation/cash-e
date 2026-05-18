import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  name: string;
  phone: string;
  avatar_seed: string;
  persona: string;
  xp: number;
  balance_cents: number;
  level: number;
  tier: string;
  streak: number;
  last_active_date: string | null;
  district: string | null;
  division: string | null;
  nid: string | null;
  dob: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    staleTime: Infinity,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase.from("profiles").select("*").single();
      if (error) throw error;
      return data as Profile;
    },
  });
}

export function useTransactions(limit = 20) {
  return useQuery({
    queryKey: ["transactions", limit],
    staleTime: Infinity,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}
