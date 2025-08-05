/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminProductTable from "../../components/AdminProductTable";
import Spinner from "../../components/Spinner";
import EditProductModal from "../../components/EditProductModal";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationDialog from "../../components/ConfirmationDialog";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // For editing
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://biller-backend-xdxp.onrender.com/api/products"
      );
      setProducts(res.data);
    } catch (e) {
      toast.error("Failed to fetch products.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmVisible(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setConfirmVisible(false);
  };

  // Delete
  // const handleDelete = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`https://biller-backend-xdxp.onrender.com/api/products/${deleteId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setProducts(products.filter((p) => p._id !== deleteId));
  //     toast.success("Product deleted!");
  //     handleCancelDelete();
  //   } catch (e) {
  //     toast.error("Failed to delete.");
  //     handleCancelDelete();
  //   }
  //   setConfirmVisible(false);
  //   setDeleteId(null);
  // };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://biller-backend-xdxp.onrender.com/api/products/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(products.filter((product) => product._id !== deleteId));
      toast.success("Product deleted!");
    } catch {
      toast.error("Failed to delete product.");
    }
    // setConfirmVisible(false);
    // setDeleteId(null);
    cancelDelete();
  };
  // Update
  const handleUpdate = async (id, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      // Remove any fields you do NOT want to update in the DB
      const { _id, createdAt, __v, ...cleanData } = updatedData;

      await axios.put(
        `https://biller-backend-xdxp.onrender.com/api/products/${id}`,
        cleanData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
      toast.success("Product updated!");
    } catch (e) {
      toast.error("Failed to update.");
    }
    setEditingProduct(null);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-[#f7fdff] overflow-x-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1d8599]">All Products</h1>
          <a
            href="/admin/add-product"
            className="bg-[#1d8599] text-white px-4 py-2 rounded font-medium hover:bg-[#116279]"
          >
            + Add Product
          </a>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <AdminProductTable
            products={products}
            // onDelete={handleDelete}
            onDelete={confirmDelete}
            onEdit={setEditingProduct}
          />
        )}

        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onSave={handleUpdate}
          />
        )}
        <ConfirmationDialog
          visible={confirmVisible}
          title="Confirm Delete"
          message="Are you sure you want to delete this product?"
          onCancel={cancelDelete}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  );
};

export default AdminAllProducts;
