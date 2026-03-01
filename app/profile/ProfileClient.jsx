"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import BackButton from "@/Components/BackButton";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");

  const [form, setForm] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");

    if (status === "authenticated") {
      setForm((prev) => ({
        ...prev,
        username: session.user.username || "",
        email: session.user.email || "",
      }));
      setLoading(false);
    }
  }, [status, session, router]);

  if (status === "loading" || loading)
    return <div className="p-10">Loading...</div>;

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword) {
      toast.error("Enter current password");
      return;
    }

    if (form.newPassword || form.confirmNewPassword) {
      if (form.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }
      if (form.newPassword !== form.confirmNewPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await axios.patch("/api/user/profile", {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        currentPassword: form.currentPassword,
        newPassword: form.newPassword || undefined,
      });

      if (!res.data.success) {
        toast.error("Update failed");
        return;
      }

      toast.success("Profile updated");
      await update({
        username: res.data.user.username,
        email: res.data.user.email,
      });

      setForm((p) => ({
        ...p,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));

      // setTimeout(() => router.push("/dashboard"), 1000);
      setTimeout(() => {
        if (returnTo) {
          router.push(decodeURIComponent(returnTo));
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-amber-50">
      <div className="w-full max-w-md border border-black bg-white dark:bg-amber-50 shadow-[6px_6px_0px_#000] p-6 sm:p-8">
        <h1 className="text-center text-3xl font-bold mb-2">Profile</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Update your account information
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm font-medium block mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="w-full border border-black px-3 py-2 bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border border-black px-3 py-2 bg-white"
            />
          </div>

          {/* Current password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium block mb-1">
                Current Password
              </label>
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="text-sm underline cursor-pointer"
              >
                {show.current ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={show.current ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={onChange}
              className="w-full border border-black px-3 py-2 bg-white"
            />
          </div>

          {/* New password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium block mb-1">
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
                className="text-sm underline cursor-pointer"
              >
                {show.new ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={show.new ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={onChange}
              className="w-full border border-black px-3 py-2 bg-white"
              placeholder="Leave blank to keep current password"
            />
          </div>

          {/* Confirm new password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium block mb-1">
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                className="text-sm underline cursor-pointer"
              >
                {show.confirm ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={onChange}
              className="w-full border border-black px-3 py-2 bg-white"
              placeholder="Repeat new password"
            />
          </div>

          <button
            disabled={saving}
            className="w-full bg-black text-white py-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {/* <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-3 py-2 border border-black bg-white dark:bg-amber-50 cursor-pointer"
          >
            ← Back
          </button> */}
          <BackButton from={returnTo ? decodeURIComponent(returnTo) : null} />
        </form>
      </div>
    </div>
  );
}
