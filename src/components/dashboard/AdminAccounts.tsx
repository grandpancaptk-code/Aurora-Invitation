import { useState } from "react";
import type { AdminRole, AdminSession, AdminUser } from "@/types/invitation";

type Props = {
  admins: AdminUser[];
  session: AdminSession;
  onAdd: (email: string, password: string, role: AdminRole) => boolean;
  onDelete: (id: string) => void;
  onUpdatePassword: (id: string, password: string) => boolean;
  onUpdateOwnPassword: (oldPass: string, newPass: string, confirmPass: string) => boolean;
};

export function AdminAccounts({
  admins,
  session,
  onAdd,
  onDelete,
  onUpdatePassword,
  onUpdateOwnPassword,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("Admin");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPass, setEditingPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  return (
    <div className="border border-brand-gold/20 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="font-serif text-[16px]">Kelola Akun Admin</h4>
        <span className="border border-brand-gold/30 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-[#8a6a3f]">
          {admins.length} akun
        </span>
      </div>

      <div className="mb-6 space-y-3 border border-brand-gold/20 bg-brand-cream p-3.5">
        <div className="mb-1 text-[11px] uppercase tracking-[0.18em] opacity-70">Tambah Akun Baru</div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email admin baru"
          className="min-h-[42px] w-full border border-brand-gold/30 bg-white px-3 text-[13px] outline-none focus:border-brand-gold"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password minimal 6 karakter"
          className="min-h-[42px] w-full border border-brand-gold/30 bg-white px-3 text-[13px] outline-none focus:border-brand-gold"
        />
        <div className="flex gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="min-h-[42px] flex-1 border border-brand-gold/30 bg-white px-3 text-[13px] outline-none"
          >
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>
          <button
            onClick={() => {
              if (onAdd(email, password, role)) {
                setEmail("");
                setPassword("");
              }
            }}
            className="min-h-[42px] bg-brand-forest px-5 text-[11px] uppercase tracking-[0.16em] text-brand-cream transition hover:bg-black"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="max-h-[320px] space-y-2.5 overflow-auto pr-1">
        {admins.map((u) => (
          <div key={u.id} className="border border-brand-gold/20 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 truncate text-[12.5px] font-medium">
                  {u.email}
                  {session.id === u.id && (
                    <span className="bg-brand-forest px-1.5 py-0.5 text-[8px] uppercase tracking-[0.16em] text-brand-cream">
                      You
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] opacity-60">
                  <span
                    className={`border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] ${
                      u.role === "Super Admin" ? "border-brand-gold bg-brand-gold/10 text-[#8a6a3f]" : "border-black/10"
                    }`}
                  >
                    {u.role}
                  </span>
                  {new Date(u.createdAt).toLocaleDateString("id-ID")}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => {
                    setEditingId(editingId === u.id ? null : u.id);
                    setEditingPass("");
                  }}
                  className="grid h-7 w-7 place-items-center border border-brand-gold/30 text-[12px] hover:bg-brand-cream"
                >
                  ✎
                </button>
                <button
                  onClick={() => onDelete(u.id)}
                  className="grid h-7 w-7 place-items-center border border-red-200 text-[12px] text-red-600 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            </div>
            {editingId === u.id && (
              <div className="mt-3 flex gap-2">
                <input
                  value={editingPass}
                  onChange={(e) => setEditingPass(e.target.value)}
                  type="password"
                  placeholder="Password baru"
                  className="min-h-[38px] flex-1 border border-brand-gold/30 bg-white px-3 text-[12px] outline-none"
                />
                <button
                  onClick={() => {
                    if (onUpdatePassword(u.id, editingPass)) {
                      setEditingId(null);
                      setEditingPass("");
                    }
                  }}
                  className="min-h-[38px] bg-brand-gold px-3 text-[10px] uppercase tracking-[0.16em] text-brand-forest"
                >
                  Simpan
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-brand-gold/15 pt-5">
        <div className="mb-3 text-[11px] uppercase tracking-[0.18em] opacity-70">Update Password Saya</div>
        <div className="space-y-2.5">
          <input
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            type="password"
            placeholder="Password lama"
            className="min-h-[42px] w-full border border-brand-gold/30 bg-white px-3 text-[13px] outline-none focus:border-brand-gold"
          />
          <input
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            type="password"
            placeholder="Password baru"
            className="min-h-[42px] w-full border border-brand-gold/30 bg-white px-3 text-[13px] outline-none focus:border-brand-gold"
          />
          <input
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            type="password"
            placeholder="Konfirmasi password baru"
            className="min-h-[42px] w-full border border-brand-gold/30 bg-white px-3 text-[13px] outline-none focus:border-brand-gold"
          />
          <button
            onClick={() => {
              if (onUpdateOwnPassword(oldPass, newPass, confirmPass)) {
                setOldPass("");
                setNewPass("");
                setConfirmPass("");
              }
            }}
            className="min-h-[44px] w-full border border-brand-forest text-[11px] uppercase tracking-[0.18em] text-brand-forest transition hover:bg-brand-forest hover:text-brand-cream"
          >
            Perbarui Password
          </button>
        </div>
      </div>
    </div>
  );
}
