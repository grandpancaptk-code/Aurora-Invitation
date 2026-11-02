// import { createClient } from "@supabase/supabase-js";

// const env = import.meta as unknown as { env: Record<string, string> };

// const supabaseUrl =
//   env.env["VITE_SUPABASE_URL"] ||
//   "https://odpfmnhagploznbtpuop.supabase.co";

// const supabaseAnonKey =
//   env.env["VITE_SUPABASE_ANON_KEY"] ||
//   "sb_publishable_m0ThjX7I1KfpHsyGEtZunw_YwOZHnRw";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// import { createClient } from "@supabase/supabase-js";

// // Vite wajib membaca properti import.meta.env secara eksplisit & langsung
// const supabaseUrl =
//   import.meta.env.VITE_SUPABASE_URL ||
//   "https://odpfmnhagploznbtpuop.supabase.co";

// const supabaseAnonKey =
//   import.meta.env.VITE_SUPABASE_ANON_KEY ||
//   "sb_publishable_m0ThjX7I1KfpHsyGEtZunw_YwOZHnRw";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

// Gunakan URL dan Publishable Key asli dari project Supabase kamu
const supabaseUrl = "https://odpfmnhagploznbtpuop.supabase.co";

const supabaseAnonKey = "sb_publishable_m0ThjX7I1KfpHsyGEtZunw_YwOZHnRw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);