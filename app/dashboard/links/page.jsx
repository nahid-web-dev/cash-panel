"use client";

import React, { useEffect, useState } from "react";
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Loader2,
  User,
  CopyIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Links() {
  const [linksList, setLinksList] = useState([]);

  // Form State
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // Track deleting state per link

  // Fetch Links
  const fetchAllLinks = async () => {
    try {
      const response = await axios.get("/api/links");
      if (response.data?.success) {
        setLinksList(response.data.data);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    fetchAllLinks();
  }, []);

  // Handle Create Link
  const handleCreateLink = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/links/create", {
        linkname: name,
      });

      if (response.data?.success) {
        toast.success("Link Created Successfully!");
        setName("");
        fetchAllLinks(); // Refresh list automatically
      } else {
        toast.error(response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Link
  const handleDeleteLink = async (linkId, linkName) => {
    if (!confirm(`Are you sure you want to delete "${linkName}"?`)) {
      return;
    }

    setDeletingId(linkId);

    try {
      const response = await axios.post("/api/links/delete", {
        id: linkId,
      });

      if (response.data?.success) {
        toast.success(`Link deleted successfully!`);
        fetchAllLinks(); // Refresh list automatically
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to format date cleanly
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  return (
    <div className="space-y-6 flex flex-col items-center p-4">
      {/* Header & Create Form */}
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-950">
            Link Management
          </h1>
          <p className="text-sm text-emerald-600">
            Create, view, and delete your managed links.
          </p>
        </div>

        {/* Create Link Form - Top Center */}
        <form
          onSubmit={handleCreateLink}
          className="w-full bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl space-y-4 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Link Name Input */}
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600" />
              <input
                type="text"
                required
                placeholder="Link Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm text-emerald-950 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Create Link Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-colors hover:bg-emerald-700 disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {loading ? "Creating..." : "Create Link"}
            </button>
          </div>
        </form>
      </div>

      {/* Links Table */}
      <div className="overflow-hidden w-full max-w-3xl rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-emerald-900">
            <thead className="border-b border-emerald-100 bg-emerald-50/50 text-xs uppercase text-emerald-700">
              <tr>
                <th className="px-6 py-4 font-semibold ">Path</th>
                <th className="px-6 py-4 font-semibold ">Full Link</th>
                <th className="px-6 py-4 font-semibold">Created By</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {linksList.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-emerald-600/70 text-sm"
                  >
                    No links found. Create one above!
                  </td>
                </tr>
              ) : (
                linksList.map((link, idx) => {
                  const linkId = link.id || idx;
                  const isDeleting = deletingId === linkId;

                  return (
                    <tr
                      key={linkId}
                      className="transition-colors hover:bg-emerald-50/40"
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-emerald-950 flex items-center gap-2">
                          <LinkIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{link.linkname}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-emerald-950 flex items-center gap-2">
                          <LinkIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>
                            {process.env.NEXT_PUBLIC_LINK_1 +
                              "/" +
                              link.linkname}
                          </span>
                        </div>
                      </td>

                      {/* Created By */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md text-xs border border-emerald-100">
                          <User className="h-3 w-3 text-emerald-600" />
                          {link.createdBy || "Unknown"}
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs font-medium text-emerald-700">
                        {formatDate(link.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${process.env.NEXT_PUBLIC_LINK_1}/${link.linkname}`,
                            );
                            toast.success("link copied!");
                          }}
                          title="Copy Link"
                          className="rounded-lg p-1.5 text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(linkId, link.name)}
                          disabled={isDeleting}
                          title="Delete Link"
                          className="rounded-lg p-1.5 text-red-600 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
