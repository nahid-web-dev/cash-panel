"use client";

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { LoaderCircle, Wallet } from "lucide-react";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const router = useRouter();

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  // Real-time verification status map: { [invoiceId]: { label: string, state: 'settled'|'pending'|'failed' } }
  const [statuses, setStatuses] = useState({});

  // Helper to verify Lightning payment status from statusLink
  const verifyAllInvoices = useCallback((invoiceList) => {
    invoiceList.forEach(async (inv) => {
      if (!inv.statusLink) {
        setStatuses((prev) => ({
          ...prev,
          [inv.id]: { label: "No Link", state: "unknown" },
        }));
        return;
      }

      try {
        setStatuses((prev) => ({
          ...prev,
          [inv.id]: { label: "Checking...", state: "loading" },
        }));

        const res = await axios.get(inv.statusLink);
        const data = res.data;

        let state = "";

        if (data?.settled === true) {
          state = "paid";
        } else {
          state = "unpaid";
        }

        setStatuses((prev) => ({
          ...prev,
          [inv.id]: { label: state },
        }));
      } catch (err) {
        console.error(`Failed to verify invoice ${inv.id}:`, err);
        setStatuses((prev) => ({
          ...prev,
          [inv.id]: { label: "Error Verifying", state: "failed" },
        }));
      }
    });
  }, []);

  // Fetch invoices with pagination
  const fetchInvoices = useCallback(
    async (currentPage) => {
      try {
        setLoading(true);
        setError(null);

        // Same project API route call
        const response = await axios.get("/api/invoices", {
          params: {
            page: currentPage,
            limit: limit,
          },
        });

        if (response.data.success) {
          const fetchedInvoices = response.data.invoices || [];
          setInvoices(fetchedInvoices);
          setTotalPages(response.data.totalPages || 1);
          setTotalItems(response.data.totalItems || 0);

          // Batch verify payment status for loaded invoices
          verifyAllInvoices(fetchedInvoices);
        } else {
          setError(response.data.message || "Failed to load invoices.");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    },
    [limit, verifyAllInvoices],
  );

  useEffect(() => {
    fetchInvoices(page);
  }, [page, fetchInvoices]);

  const fetchBalance = useCallback(async () => {
    setLoadingBalance(true);
    const response = await axios.get("/api/get-balance");
    if (response.data?.success) {
      setBalance(response?.data?.balance);
    } else {
      setBalance(0);
    }
    setLoadingBalance(false);
  });

  useEffect(() => {
    fetchBalance();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Status Badge Component
  const renderStatusBadge = (statusInfo) => {
    if (!statusInfo || statusInfo.state === "loading") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#00d632]/10 text-[#00a827] border border-[#00d632]/30 animate-pulse">
          Checking...
        </span>
      );
    }

    switch (statusInfo.label === "paid") {
      case "settled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00d632]/15 text-[#008a20] border border-[#00d632]/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d632]"></span>
            {statusInfo.label}
          </span>
        );
      case "unpaid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            {statusInfo.label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {statusInfo.label || "N/A"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Invoices Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track and monitor your generated Lightning invoices in real time.
            </p>
          </div>
          <button
            onClick={() => {
              fetchInvoices(page);
              fetchBalance();
            }}
            disabled={loading}
            className="px-4 py-2.5 bg-[#00d632] hover:bg-[#00b82b] active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#00d632]/20 border border-[#00d632]/30 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Refreshing..." : "Refresh List"}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-60">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Balance
              </p>
              {loadingBalance ? (
                <LoaderCircle className="w-6 h-6 text-green-500 animate-spin" />
              ) : (
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  ${balance}
                </h2>
              )}
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Table Container */}
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-4 px-6">Invoice ID</th>
                <th className="py-4 px-6">Generated By</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Created At</th>
                <th className="py-4 px-6">Paid Status</th>
                {/* <th className="py-4 px-6">Withdraw</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-slate-500 font-sans"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#00d632] animate-ping"></div>
                      Fetching invoices page {page}...
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-16 text-slate-500 font-sans"
                  >
                    No invoices found on this page.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Invoice ID */}
                    <td className="py-4 px-6 font-medium text-slate-900 truncate max-w-32.5">
                      {inv.id}
                    </td>

                    {/* Generated By */}
                    <td className="py-4 px-6 text-slate-700 font-sans">
                      {inv.generatedBy || "—"}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-[#00a827] font-bold font-sans">
                      ${inv.amount}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6 text-slate-500 font-sans text-xs">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    {/* Combined Status */}
                    <td className="py-4 px-6 font-sans">
                      {renderStatusBadge(statuses[inv.id])}
                    </td>

                    {/* <td className="py-4 px-6 font-sans">
                      {inv.withdrawStatus ? (
                        inv.withdrawStatus
                      ) : renderStatusBadge(statuses[inv.id]) == "paid" ? (
                        <button
                          onClick={async () => {
                            try {
                              const response = await axios.post(
                                "/api/invoices/withdraw-req",
                                {
                                  invoiceId: inv.id,
                                },
                              );
                              if (response.data?.success) {
                                toast.success("withdraw requested.");
                                router.refresh();
                              } else {
                                toast.error(
                                  response.data?.message || "something wrong!",
                                );
                              }
                            } catch (error) {
                              toast.error(error?.message || "something wrong");
                            }
                          }}
                          className=" text-xs p-1 rounded-xl bg-green-300 text-green-800 hover:bg-green-200 transition-all"
                        >
                          withdraw
                        </button>
                      ) : (
                        "--"
                      )}
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50 border-t border-slate-200 text-sm font-sans">
            <div className="text-slate-600">
              Showing page{" "}
              <span className="font-bold text-slate-900">{page}</span> of{" "}
              <span className="font-bold text-slate-900">{totalPages}</span>{" "}
              <span className="text-xs text-slate-500">
                ({totalItems} total items)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-sm"
              >
                Previous
              </button>

              <div className="flex gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        page === p
                          ? "bg-[#00d632] text-white font-bold shadow-sm"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages || loading}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
