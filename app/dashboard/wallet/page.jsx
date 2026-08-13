// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Mail,
//   Wallet,
//   Loader2,
//   AlertTriangle,
//   CheckCircle2,
//   X,
// } from "lucide-react";
// import axios from "axios";
// import toast from "react-hot-toast";

// export default function WalletPage() {
//   const [mail, setMail] = useState("");
//   const [savedMail, setSavedMail] = useState(""); // Holds current active mail
//   const [fetching, setFetching] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   // Modal State
//   const [showModal, setShowModal] = useState(false);
//   const [confirmInput, setConfirmInput] = useState("");

//   // 1. Fetch current wallet email on load
//   const fetchWallet = async () => {
//     try {
//       setFetching(true);
//       const response = await axios.get("/api/wallet");

//       if (response.data?.success && response.data?.data) {
//         const activeMail = response.data.data.mail || "";
//         setSavedMail(activeMail);
//         setMail(activeMail);
//         setIsEditing(true);
//       }
//     } catch (error) {
//       console.error(error?.message);
//     } finally {
//       setFetching(false);
//     }
//   };

//   useEffect(() => {
//     fetchWallet();
//   }, []);

//   // 2. Open confirmation modal on submit click
//   const handleOpenConfirmation = (e) => {
//     e.preventDefault();

//     if (!mail.trim()) {
//       toast.error("Please enter a valid email address.");
//       return;
//     }

//     setConfirmInput("");
//     setShowModal(true);
//   };

//   // 3. Perform the actual POST request after typing CONFIRM
//   const handleConfirmedSubmit = async () => {
//     if (confirmInput.trim() !== "CONFIRM") {
//       toast.error('Please type "CONFIRM" to proceed.');
//       return;
//     }

//     setShowModal(false);
//     setLoading(true);

//     try {
//       const response = await axios.post("/api/wallet", { mail });

//       if (response.data?.success) {
//         toast.success(
//           isEditing
//             ? "Wallet email updated successfully!"
//             : "Wallet email saved successfully!",
//         );
//         setSavedMail(mail);
//         setIsEditing(true);
//       } else {
//         toast.error(response.data?.message || "Failed to save wallet email.");
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Something went wrong.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 flex flex-col items-center p-4 min-h-[80vh] justify-center">
//       {/* Header */}
//       <div className="flex flex-col items-center gap-2 text-center w-full max-w-md">
//         <div className="p-3 bg-emerald-100 rounded-full text-emerald-800 mb-1">
//           <Wallet className="h-6 w-6" />
//         </div>
//         <h1 className="text-2xl font-bold text-emerald-950">Wallet Settings</h1>
//         <p className="text-sm text-emerald-600">
//           Manage your payout and notifications email address.
//         </p>
//       </div>

//       {/* Form Container */}
//       <div className="w-full max-w-md bg-emerald-50/60 border border-emerald-100 p-6 rounded-2xl shadow-sm space-y-4">
//         {fetching ? (
//           <div className="flex flex-col items-center justify-center py-8 gap-2 text-emerald-700">
//             <Loader2 className="h-6 w-6 animate-spin" />
//             <span className="text-sm font-medium">Loading wallet data...</span>
//           </div>
//         ) : (
//           <form onSubmit={handleOpenConfirmation} className="space-y-4">
//             {/* Display Active Email on Top in Green */}
//             {savedMail && (
//               <div className="p-3 bg-emerald-100/80 border border-emerald-200 rounded-xl flex items-center justify-between">
//                 <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
//                   Current Email:
//                 </span>
//                 <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 break-all">
//                   <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
//                   {savedMail}
//                 </span>
//               </div>
//             )}

//             {/* Input Field */}
//             <div className="space-y-1.5">
//               <label
//                 htmlFor="wallet-email"
//                 className="block text-xs font-semibold uppercase tracking-wider text-emerald-800"
//               >
//                 {isEditing
//                   ? "New Wallet Email Address"
//                   : "Wallet Email Address"}
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
//                 <input
//                   id="wallet-email"
//                   type="email"
//                   required
//                   placeholder="your-email@example.com"
//                   value={mail}
//                   onChange={(e) => setMail(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm text-emerald-950 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
//                 />
//               </div>
//             </div>

//             {/* Redish Danger Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-colors hover:bg-red-700 disabled:opacity-60 cursor-pointer"
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <AlertTriangle className="h-4 w-4" />
//               )}
//               {loading
//                 ? "Updating..."
//                 : isEditing
//                   ? "Update Wallet Email"
//                   : "Submit Wallet Email"}
//             </button>
//           </form>
//         )}
//       </div>

//       {/* Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
//           <div className="w-full max-w-sm bg-white border border-emerald-100 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2 text-red-600 font-bold">
//                 <AlertTriangle className="h-5 w-5" />
//                 <span>Confirm Change</span>
//               </div>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <p className="text-xs text-emerald-800 leading-relaxed">
//               Are you sure you want to set the wallet address to:{" "}
//               <strong className="text-emerald-950 font-semibold">{mail}</strong>
//               ? Please type{" "}
//               <span className="font-bold text-red-600">CONFIRM</span> to
//               continue.
//             </p>

//             <input
//               type="text"
//               autoFocus
//               placeholder="Type CONFIRM"
//               value={confirmInput}
//               onChange={(e) => setConfirmInput(e.target.value)}
//               className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-950 uppercase placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
//             />

//             {/* Modal Actions */}
//             <div className="flex gap-2 pt-2">
//               <button
//                 type="button"
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleConfirmedSubmit}
//                 disabled={confirmInput.trim() !== "CONFIRM"}
//                 className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Wallet,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const router = useRouter();

  // ==========================================
  // WALLET FORM STATES
  // ==========================================
  const [mail, setMail] = useState("");
  const [savedMail, setSavedMail] = useState("");
  const [fetchingWallet, setFetchingWallet] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  // ==========================================
  // DASHBOARD TABLE STATES
  // ==========================================
  const [invoices, setInvoices] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 15;

  // Real-time verification status map
  const [statuses, setStatuses] = useState({});

  // ==========================================
  // WALLET HANDLERS
  // ==========================================
  const fetchWallet = async () => {
    try {
      setFetchingWallet(true);
      const response = await axios.get("/api/wallet");

      if (response.data?.success && response.data?.data) {
        const activeMail = response.data.data.mail || "";
        setSavedMail(activeMail);
        setMail(activeMail);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error?.message);
    } finally {
      setFetchingWallet(false);
    }
  };

  const handleOpenConfirmation = (e) => {
    e.preventDefault();

    if (!mail.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setConfirmInput("");
    setShowModal(true);
  };

  const handleConfirmedSubmit = async () => {
    if (confirmInput.trim() !== "CONFIRM") {
      toast.error('Please type "CONFIRM" to proceed.');
      return;
    }

    setShowModal(false);
    setWalletLoading(true);

    try {
      const response = await axios.post("/api/wallet", { mail });

      if (response.data?.success) {
        toast.success(
          isEditing
            ? "Wallet email updated successfully!"
            : "Wallet email saved successfully!",
        );
        setSavedMail(mail);
        setIsEditing(true);
      } else {
        toast.error(response.data?.message || "Failed to save wallet email.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
      );
    } finally {
      setWalletLoading(false);
    }
  };

  // ==========================================
  // DASHBOARD / INVOICES HANDLERS
  // ==========================================
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
          state = "settled";
        } else if (data?.status !== "OK") {
          state = "failed";
        } else {
          state = "pending";
        }

        setStatuses((prev) => ({
          ...prev,
          [inv.id]: {
            label:
              state === "settled"
                ? "paid"
                : state === "failed"
                  ? "expired"
                  : "unpaid",
            state,
          },
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

  const fetchInvoices = useCallback(
    async (currentPage) => {
      try {
        setTableLoading(true);
        setError(null);

        const response = await axios.get("/api/invoices", {
          params: {
            page: currentPage,
            limit: limit,
            from: "wallet",
          },
        });

        if (response.data.success) {
          const fetchedInvoices = response.data.invoices || [];
          setInvoices(fetchedInvoices);
          setTotalPages(response.data.totalPages || 1);
          setTotalItems(response.data.totalItems || 0);

          verifyAllInvoices(fetchedInvoices);
        } else {
          setError(response.data.message || "Failed to load invoices.");
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to connect to server.");
      } finally {
        setTableLoading(false);
      }
    },
    [limit, verifyAllInvoices],
  );

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    fetchInvoices(page);
  }, [page, fetchInvoices]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleWithdrawApprove = async (invoiceId) => {
    try {
      const response = await axios.post("/api/invoices/withdraw-approve", {
        invoiceId,
      });

      if (response.data?.success) {
        toast.success("Withdraw completed.");
        fetchInvoices(page);
        router.refresh();
      } else {
        toast.error(response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  const renderStatusBadge = (statusInfo) => {
    if (!statusInfo || statusInfo.state === "loading") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#00d632]/10 text-[#00a827] border border-[#00d632]/30 animate-pulse">
          Checking...
        </span>
      );
    }

    switch (statusInfo.state) {
      case "settled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#00d632]/15 text-[#008a20] border border-[#00d632]/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00d632]"></span>
            {statusInfo.label}
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            {statusInfo.label}
          </span>
        );
      case "failed":
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
    <div className="min-h-screen bg-white text-slate-900 p-4 sm:p-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ========================================== */}
        {/* SECTION 1: WALLET FORM                     */}
        {/* ========================================== */}
        <section className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center gap-2 text-center w-full max-w-md">
            <div className="p-3 bg-emerald-100 rounded-full text-emerald-800 mb-1">
              <Wallet className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-950">
              Wallet Settings
            </h1>
            <p className="text-sm text-emerald-600">
              Manage your payout and notifications email address.
            </p>
          </div>

          <div className="w-full max-w-md bg-emerald-50/60 border border-emerald-100 p-6 rounded-2xl shadow-sm space-y-4">
            {fetchingWallet ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-emerald-700">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm font-medium">
                  Loading wallet data...
                </span>
              </div>
            ) : (
              <form onSubmit={handleOpenConfirmation} className="space-y-4">
                {savedMail && (
                  <div className="p-3 bg-emerald-100/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                      Current Email:
                    </span>
                    <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 break-all">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      {savedMail}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="wallet-email"
                    className="block text-xs font-semibold uppercase tracking-wider text-emerald-800"
                  >
                    {isEditing
                      ? "New Wallet Email Address"
                      : "Wallet Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
                    <input
                      id="wallet-email"
                      type="email"
                      required
                      placeholder="your-email@example.com"
                      value={mail}
                      onChange={(e) => setMail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm text-emerald-950 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={walletLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition-colors hover:bg-red-700 disabled:opacity-60 cursor-pointer"
                >
                  {walletLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {walletLoading
                    ? "Updating..."
                    : isEditing
                      ? "Update Wallet Email"
                      : "Submit Wallet Email"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-slate-200" />

        {/* ========================================== */}
        {/* SECTION 2: INVOICES DASHBOARD TABLE        */}
        {/* ========================================== */}
        <section className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Invoices Dashboard
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Track and monitor your generated Lightning invoices in real
                time.
              </p>
            </div>
            <button
              onClick={() => fetchInvoices(page)}
              disabled={tableLoading}
              className="px-4 py-2.5 bg-[#00d632] hover:bg-[#00b82b] active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#00d632]/20 border border-[#00d632]/30 disabled:opacity-50 cursor-pointer"
            >
              {tableLoading ? "Refreshing..." : "Refresh List"}
            </button>
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
                  <th className="py-4 px-6">Withdraw</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {tableLoading ? (
                  <tr>
                    <td
                      colSpan={6}
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
                      colSpan={6}
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

                      {/* Paid Status */}
                      <td className="py-4 px-6 font-sans">
                        {renderStatusBadge(statuses[inv.id])}
                      </td>

                      {/* Withdraw Action */}
                      <td className="py-4 px-6 font-sans">
                        {inv.withdrawStatus === "pending" ? (
                          <button
                            onClick={() => handleWithdrawApprove(inv.id)}
                            className="text-xs px-3 py-1.5 rounded-xl bg-green-300 text-green-800 hover:bg-green-200 transition-all font-semibold cursor-pointer"
                          >
                            complete
                          </button>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize font-medium">
                            {inv.withdrawStatus}
                          </span>
                        )}
                      </td>
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
                  disabled={page <= 1 || tableLoading}
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
                  disabled={page >= totalPages || tableLoading}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================== */}
      {/* CONFIRMATION MODAL                         */}
      {/* ========================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white border border-emerald-100 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <AlertTriangle className="h-5 w-5" />
                <span>Confirm Change</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <p className="text-xs text-emerald-800 leading-relaxed">
              Are you sure you want to set the wallet address to:{" "}
              <strong className="text-emerald-950 font-semibold">{mail}</strong>
              ? Please type{" "}
              <span className="font-bold text-red-600">CONFIRM</span> to
              continue.
            </p>

            <input
              type="text"
              autoFocus
              placeholder="Type CONFIRM"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-950 uppercase placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />

            {/* Modal Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                disabled={confirmInput.trim() !== "CONFIRM"}
                className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
