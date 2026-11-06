"use client";

import React from "react";
import { X } from "lucide-react";

export function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  userFormData,
  setUserFormData,
  formLoading,
  formError,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
            เพิ่มผู้ใช้งานใหม่
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">ชื่อผู้ใช้ (Username)</label>
            <input
              type="text"
              required
              value={userFormData.username}
              onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
              placeholder="เช่น user1"
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">รหัสผ่าน (Password)</label>
            <input
              type="password"
              required
              value={userFormData.password}
              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">ชื่อที่แสดง (Display Name)</label>
            <input
              type="text"
              value={userFormData.displayName}
              onChange={(e) => setUserFormData({ ...userFormData, displayName: e.target.value })}
              placeholder="เช่น สมชาย ใจดี"
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">ประเภทกระเป๋าเงิน (Account Type)</label>
            <select
              value={userFormData.accountType}
              onChange={(e) => setUserFormData({ ...userFormData, accountType: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="family">👨‍👩‍👧‍👦 สมาชิกครอบครัว (ใช้กระเป๋าร่วมกับ him)</option>
              <option value="personal">👤 บัญชีส่วนตัว (แยกกระเป๋าอิสระ)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">สิทธิ์การใช้งาน (Role)</label>
            <select
              value={userFormData.role}
              onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="member">สมาชิกทั่วไป (Member)</option>
              <option value="admin">ผู้ดูแลระบบ (Admin)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
            >
              {formLoading ? "กำลังบันทึก..." : "เพิ่มผู้ใช้"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditUserModal({
  isOpen,
  selectedUser,
  onClose,
  onSubmit,
  userFormData,
  setUserFormData,
  formLoading,
  formError,
}) {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white">
            แก้ไขผู้ใช้: @{selectedUser.username}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">ชื่อที่แสดง (Display Name)</label>
            <input
              type="text"
              value={userFormData.displayName}
              onChange={(e) => setUserFormData({ ...userFormData, displayName: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">
              เปลี่ยนรหัสผ่านใหม่ (เว้นว่างไว้หากไม่ต้องการเปลี่ยน)
            </label>
            <input
              type="password"
              value={userFormData.password}
              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
              placeholder="กรอกรหัสใหม่ อย่างน้อย 6 ตัวอักษร"
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">ประเภทกระเป๋าเงิน (Account Type)</label>
            <select
              value={userFormData.accountType}
              onChange={(e) => setUserFormData({ ...userFormData, accountType: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="family">👨‍👩‍👧‍👦 สมาชิกครอบครัว (ใช้กระเป๋าร่วมกับ him)</option>
              <option value="personal">👤 บัญชีส่วนตัว (แยกกระเป๋าอิสระ)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">สิทธิ์การใช้งาน (Role)</label>
            <select
              value={userFormData.role}
              onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="member">สมาชิกทั่วไป (Member)</option>
              <option value="admin">ผู้ดูแลระบบ (Admin)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-500">สถานะบัญชี</label>
            <select
              value={userFormData.status}
              onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2 px-3 text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="active">เปิดใช้งาน (Active)</option>
              <option value="inactive">ปิดใช้งาน (Inactive)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
            >
              {formLoading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
