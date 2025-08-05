/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminBlogTable from "../../components/AdminBlogTable";
import Spinner from "../../components/Spinner";
import EditBlogModal from "../../components/EditBlogModal";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const AdminAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://biller-backend-xdxp.onrender.com/api/blogs"
      );
      setBlogs(res.data);
    } catch (e) {
      toast.error("Failed to fetch blogs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete blog with confirmation
  //   const handleDelete = async (id) => {
  //     if (!window.confirm("Remove this blog post?")) return;
  //     try {
  //       const token = localStorage.getItem("token");
  //       await axios.delete(`https://biller-backend-xdxp.onrender.com/api/blogs/${id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setBlogs(blogs.filter((b) => b._id !== id));
  //       toast.success("Blog deleted!");
  //     } catch (e) {
  //       toast.error("Failed to delete.");
  //     }
  //   };

  const [deleteId, setDeleteId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setConfirmVisible(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://biller-backend-xdxp.onrender.com/api/blogs/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      toast.success("Blog deleted!");
      handleCancelDelete();
    } catch {
      toast.error("Failed to delete.");
      handleCancelDelete();
    }
  };

  // Update blog post
  const handleUpdate = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      // If you want to support image upload, handle FormData here similarly to products
      await axios.put(
        `https://biller-backend-xdxp.onrender.com/api/blogs/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBlogs();
      toast.success("Blog updated!");
    } catch (e) {
      toast.error("Failed to update.");
    }
    setEditingBlog(null);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-[#f7fdff] overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1d8599]">All Blogs</h1>
          <a
            href="/admin/add-blog"
            className="bg-[#1d8599] text-white px-4 py-2 rounded font-medium hover:bg-[#116279]"
          >
            + Add Blog
          </a>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <AdminBlogTable
            blogs={blogs}
            onDelete={confirmDelete}
            onEdit={setEditingBlog}
          />
        )}
        <ConfirmationDialog
          visible={confirmVisible}
          title="Confirm Deletion"
          message="Are you sure you want to delete this blog post?"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
        {editingBlog && (
          <EditBlogModal
            blog={editingBlog}
            onClose={() => setEditingBlog(null)}
            onSave={handleUpdate}
          />
        )}
      </main>
    </div>
  );
};

export default AdminAllBlogs;
