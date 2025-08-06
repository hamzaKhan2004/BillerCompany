/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import CustomerTable from "../../components/CustomerTable";

import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://biller-backend-xdxp.onrender.com/api/users/customers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCustomers(res.data);
      } catch (e) {
        setCustomers([]);
      }
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  // Delete a customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://biller-backend-xdxp.onrender.com/api/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomers(customers.filter((c) => c._id !== id));
      toast.success("Customer deleted!");
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  // View detail handler
  const handleViewDetail = (customer) => {
    navigate(`/admin/customers/${customer._id}`);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-[#f7fdff] overflow-x-auto">
        <h1 className="text-2xl font-bold text-[#1d8599] mb-5">Customers</h1>
        {loading ? (
          <Spinner />
        ) : (
          <CustomerTable
            customers={customers}
            onDelete={handleDelete}
            onViewDetail={handleViewDetail}
          />
        )}
      </main>
    </div>
  );
};

export default AdminCustomers;
