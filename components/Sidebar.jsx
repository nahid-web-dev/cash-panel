"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  LayoutDashboard,
  SidebarIcon,
  SquareArrowOutUpRight,
  Users,
  Wallet2,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Sidebar() {
  const [isOpened, setIsOpened] = useState(true);

  const [me, setMe] = useState({
    id: null,
    username: null,
    role: null,
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axios.get("/api/me");
        if (response.data.success) {
          setMe((prevMe) => {
            return { ...response.data.data };
          });
        }
      } catch (error) {
        console.log(error?.message);
      }
    };
    fetchMe();
  }, []);

  const currentPath = usePathname();

  return (
    <>
      {isOpened ? (
        <X
          height={40}
          width={40}
          className="rounded-lg bg-[#00d632] p-1 text-white fixed top-3 right-3 md:hidden z-40 border border-white/20 shadow-md cursor-pointer"
          onClick={() => {
            setIsOpened(false);
          }}
        />
      ) : (
        <SidebarIcon
          height={40}
          width={40}
          className="rounded-lg bg-[#00d632] p-1 text-white fixed top-3 right-3 md:hidden z-40 border border-white/20 shadow-md cursor-pointer"
          onClick={() => {
            setIsOpened(true);
          }}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed h-dvh translate-y-0 z-30 w-60 bg-[#02aa29] text-white transition-transform duration-300 ease-in-out border-r border-white/10 ${
          isOpened ? "translate-x-0" : "-translate-x-full"
        } `}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div>
            {/* Header / Logo */}
            <div className="flex items-center justify-between px-3 py-4">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#00d632] font-extrabold text-xl shadow-lg shadow-black/10">
                  <DollarSign />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  {`${process.env.NEXT_PUBLIC_OWNER}'s Panel` || "PANEL"}
                </span>
              </Link>
            </div>

            {/* Nav Links with Actual Anchors */}
            <nav className="mt-8 space-y-1.5">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  currentPath === "/dashboard"
                    ? "bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/25"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href="/dashboard/links"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  currentPath === "/dashboard/links"
                    ? "bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/25"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <SquareArrowOutUpRight className="h-5 w-5" />
                Links
              </Link>

              {me.role === "admin" ? (
                <>
                  <Link
                    href="/dashboard/users"
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      currentPath === "/dashboard/users"
                        ? "bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/25"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    Users
                  </Link>
                  <Link
                    href="/dashboard/wallet"
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      currentPath === "/dashboard/wallet"
                        ? "bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/25"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Wallet2 className="h-5 w-5" />
                    Wallet
                  </Link>
                </>
              ) : null}
            </nav>
          </div>

          {/*
          <div className="border-t border-white/20 px-2 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 font-bold text-white shadow-inner">
                AD
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white">Alex Admin</span>
                <span className="text-xs text-white/70">alex@greendash.io</span>
              </div>
            </div>
          </div> */}
        </div>
      </aside>
    </>
  );
}
