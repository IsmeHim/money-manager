"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { createAdminUser, updateAdminUser, deleteAdminUser } from "@/app/adminActions";
import { AddUserModal, EditUserModal } from "./UserFormModals";

export default function UserManagementTab({
  users,
  usersLoading,
  currentUser,
  onRefreshUsers,
  showToast,
}) {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    role: "member",
    accountType: "family",
    status: "active",
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const res = await createAdminUser(userFormData);
    if (res.success) {
      showToast("เพิ่มผู้ใช้งานเรียบร้อยแล้ว");
      setIsAddUserModalOpen(false);
      setUserFormData({
        username: "",
        password: "",
        displayName: "",
        role: "member",
        accountType: "family",
        status: "active",
      });
      onRefreshUsers();
    } else {
      setFormError(res.error || "ไม่สามารถเพิ่มผู้ใช้งานได้");
    }
    setFormLoading(false);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setUserFormData({
      username: user.username,
      displayName: user.displayName || "",
      role: user.role || "member",
      accountType: user.accountType || (user.familyGroup ? "family" : "personal"),
      status: user.status || "active",
      password: "",
    });
    setFormError("");
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError("");
    setFormLoading(true);

    const updatePayload = {
      displayName: userFormData.displayName,
      role: userFormData.role,
      accountType: userFormData.accountType,
      status: userFormData.status,
    };
    if (userFormData.password && userFormData.password.trim()) {
      updatePayload.password = userFormData.password.trim();
    }

    const res = await updateAdminUser(selectedUser._id, updatePayload);
    if (res.success) {
      showToast("อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว");
      setIsEditUserModalOpen(false);
      onRefreshUsers();
    } else {
      setFormError(res.error || "ไม่สามารถอัปเดตข้อมูลได้");
    }
    setFormLoading(false);
  };

  const handleDeleteUser = async (user) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ '${user.username}'?`)) {
      const res = await deleteAdminUser(user._id);
      if (res.success) {
        showToast(`ลบผู้ใช้ '${user.username}' เรียบร้อยแล้ว`);
        onRefreshUsers();
      } else {
        showToast(res.error || "ไม่สามารถลบผู้ใช้ได้", "error");
      }
    }
  };

  return (
    <main className="px-6 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
            สมาชิกครอบครัว & ผู้ใช้งานทั้งหมด
          </h2>
          <p className="text-[11px] text-zinc-400">
            เพิ่มสมาชิกครอบครัวเพื่อใช้กระเป๋าเงินร่วมกัน หรือจัดการบัญชีผู้ใช้ในระบบ
          </p>
        </div>

        <button
          onClick={() => {
            setUserFormData({
              username: "",
              password: "",
              displayName: "",
              role: "member",
              accountType: "family",
              status: "active",
            });
            setFormError("");
            setIsAddUserModalOpen(true);
          }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มสมาชิกครอบครัว / ผู้ใช้</span>
        </button>
      </div>

      {/* Users List */}
      {usersLoading ? (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
          ยังไม่มีผู้ใช้งานในระบบ
        </div>
      ) : (
        <div className="space-y-2.5">
          {users.map((u) => (
            <div
              key={u._id}
              className="p-3.5 bg-zinc-50/70 dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center uppercase">
                  {u.username[0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                      {u.displayName || u.username}
                    </span>
                    <span className="text-[10px] text-zinc-400">(@{u.username})</span>
                    {u.role === "admin" && (
                      <span className="text-[9px] font-black bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded-md uppercase">
                        Admin
                      </span>
                    )}
                    {u.username === "him" || u.accountType === "family" || u.familyGroup === "him" ? (
                      <span className="text-[9px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-md">
                        👨‍👩‍👧‍👦 กระเป๋าครอบครัว (him)
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-md">
                        👤 บัญชีส่วนตัวแยกอิสระ
                      </span>
                    )}
                    {u.status === "inactive" && (
                      <span className="text-[9px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-md">
                        ปิดใช้งาน
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-2 pt-0.5">
                    <span>
                      สร้างเมื่อ: {u.createdAt ? new Date(u.createdAt).toLocaleDateString("th-TH") : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(u)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                  title="แก้ไขข้อมูล / รีเซ็ตรหัสผ่าน"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {u.username !== "him" && u.username !== currentUser?.username && (
                  <button
                    onClick={() => handleDeleteUser(u)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="ลบผู้ใช้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleCreateUser}
        userFormData={userFormData}
        setUserFormData={setUserFormData}
        formLoading={formLoading}
        formError={formError}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        selectedUser={selectedUser}
        onClose={() => setIsEditUserModalOpen(false)}
        onSubmit={handleUpdateUser}
        userFormData={userFormData}
        setUserFormData={setUserFormData}
        formLoading={formLoading}
        formError={formError}
      />
    </main>
  );
}
