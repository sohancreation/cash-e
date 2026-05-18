import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PERSONAS = ["student", "farmer", "merchant", "gig", "homemaker", "freelancer", "service"] as const;

const SignupSchema = z.object({
  phone: z.string().min(10).max(20),
  pin: z.string().regex(/^\d{6}$/),
  name: z.string().min(1).max(80),
  nid: z.string().min(6).max(30).optional().nullable(),
  dob: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other"]).optional().nullable(),
  district: z.string().max(60).optional().nullable(),
  division: z.string().max(60).optional().nullable(),
  referral: z.string().max(30).optional().nullable(),
  persona: z.enum(PERSONAS).optional().nullable(),
});

export const signupWithPhone = createServerFn({ method: "POST" })
  .inputValidator((input) => SignupSchema.parse(input))
  .handler(async ({ data }) => {
    const email = `${data.phone}@cashe.app`;
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.pin,
      email_confirm: true,
      user_metadata: { phone: data.phone, name: data.name },
    });
    if (error) throw new Error(error.message);
    const userId = created.user?.id;
    if (userId) {
      await supabaseAdmin
        .from("profiles")
        .update({
          nid: data.nid ?? null,
          dob: data.dob || null,
          gender: data.gender ?? null,
          district: data.district ?? null,
          division: data.division ?? null,
          referral_code: data.referral ?? null,
          persona: (data.persona as any) ?? "student",
        })
        .eq("id", userId);
    }
    return { userId };
  });

export const checkPhoneExists = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ phone: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { data: rows } = await supabaseAdmin
      .from("profiles")
      .select("id, name")
      .eq("phone", data.phone)
      .limit(1);
    return { exists: !!rows && rows.length > 0, name: rows?.[0]?.name ?? null };
  });

export const updatePersona = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ userId: z.string().uuid(), persona: z.enum(PERSONAS) }).parse(input))
  .handler(async ({ data }) => {
    await supabaseAdmin.from("profiles").update({ persona: data.persona as any }).eq("id", data.userId);
    return { ok: true };
  });
