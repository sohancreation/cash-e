import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCasheI18n } from "@/lib/cashe-i18n";
import { ArrowLeft, Bell, CheckCheck, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  component: Notifications,
});

type Notif = {
  id: string;
  title: string;
  body: string | null;
  icon: string | null;
  read: boolean;
  created_at: string;
};

function useNotifications() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notif[]> => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as Notif[];
    },
  });
  useEffect(() => {
    const ch = supabase
      .channel("notif-watch")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
        qc.invalidateQueries({ queryKey: ["notifications"] });
        qc.invalidateQueries({ queryKey: ["notifications-unread"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  return q;
}

function timeAgo(iso: string, isBn: boolean) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return isBn ? "এইমাত্র" : "just now";
  if (d < 3600) return `${Math.floor(d / 60)}${isBn ? "মি" : "m"}`;
  if (d < 86400) return `${Math.floor(d / 3600)}${isBn ? "ঘ" : "h"}`;
  return `${Math.floor(d / 86400)}${isBn ? "দি" : "d"}`;
}

function Notifications() {
  const { tr, isBn } = useCasheI18n();
  const qc = useQueryClient();
  const { data: notifs = [], isLoading } = useNotifications();

  const seed = useMutation({
    mutationFn: async () => {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user.id;
      if (!uid) throw new Error("no user");
      const samples = [
        { title: "Welcome to CASh-E", body: "Explore Sanchay, Bima, and more.", icon: "sparkles" },
        { title: "Daily Streak +1", body: "You're on a roll! Keep it up.", icon: "trophy" },
        { title: "New Mission", body: "Complete 3 transfers to earn 50 XP.", icon: "target" },
      ];
      const rows = samples.map((s) => ({ ...s, user_id: uid, read: false }));
      const { error } = await supabase.from("notifications").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(tr("Sample notifications added"));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const ids = notifs.filter((n) => !n.read).map((n) => n.id);
      if (!ids.length) return;
      const { error } = await supabase.from("notifications").update({ read: true }).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const toggleRead = useMutation({
    mutationFn: async (n: Notif) => {
      const { error } = await supabase.from("notifications").update({ read: !n.read }).eq("id", n.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-full bg-background">
      <div className="px-5 pt-6 pb-3 flex items-center gap-3 border-b border-white/5">
        <Link to="/app" className="w-9 h-9 rounded-full glass flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="text-sm font-semibold">{tr("Notifications")}</div>
          <div className="text-[11px] text-muted-foreground">
            {unread > 0 ? `${unread} ${tr("unread")}` : tr("All caught up")}
          </div>
        </div>
        <button
          onClick={() => markAllRead.mutate()}
          disabled={unread === 0}
          className="text-[11px] flex items-center gap-1 px-2.5 py-1.5 rounded-full glass disabled:opacity-40"
        >
          <CheckCheck className="w-3.5 h-3.5" /> {tr("Mark all")}
        </button>
      </div>

      <div className="p-4 space-y-2">
        {isLoading && <div className="text-center text-muted-foreground text-sm py-8">{tr("Loading...")}</div>}
        {!isLoading && notifs.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Bell className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <div className="text-sm text-muted-foreground">{tr("No notifications yet")}</div>
            <button
              onClick={() => seed.mutate()}
              className="text-xs px-3 py-2 rounded-full bg-gradient-to-br from-primary to-accent text-white inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> {tr("Add sample notifications")}
            </button>
          </div>
        )}
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl p-3 flex gap-3 border ${n.read ? "border-white/5 bg-white/[0.02]" : "border-primary/30 bg-primary/5"}`}
          >
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold truncate">{tr(n.title)}</div>
                <div className="text-[10px] text-muted-foreground shrink-0">{timeAgo(n.created_at, isBn)}</div>
              </div>
              {n.body && <div className="text-[12px] text-muted-foreground mt-0.5">{tr(n.body)}</div>}
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => toggleRead.mutate(n)} className="text-[11px] text-primary">
                  {n.read ? tr("Mark unread") : tr("Mark read")}
                </button>
                <button onClick={() => remove.mutate(n.id)} className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> {tr("Delete")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
