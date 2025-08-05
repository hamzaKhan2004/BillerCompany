/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import AdminSidebar from "../../components/AdminSidebar";
// import Spinner from "../../components/Spinner";
// import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";

// const BACKEND = "https://biller-backend-xdxp.onrender.com";

// import { toast } from "react-toastify";

// const AdminCustomerDetail = () => {
//   const { id } = useParams();
//   const [customer, setCustomer] = useState(null);
//   const [orders, setOrders] = useState([]);
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch customer, orders, feedbacks
//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const [custRes, contactsRes] = await Promise.all([
//           axios.get(`${BACKEND}/api/users/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           axios.get(`${BACKEND}/api/contact/user/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);
//         setCustomer(custRes.data);
//         setContacts(contactsRes.data);
//         // Fetch orders separately so you can catch just its failure:
//         try {
//           const ordersRes = await axios.get(
//             `${BACKEND}/api/orders/user/${id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setOrders(ordersRes.data);
//         } catch {
//           setOrders([
//             {
//               _id: "ORD12345",
//               createdAt: "2024-06-07T10:21:30.000Z",
//               status: "Delivered",
//               total: 300,
//             },
//             {
//               _id: "ORD12346",
//               createdAt: "2024-06-01T14:53:15.000Z",
//               status: "Pending",
//               total: 850,
//             },
//             {
//               _id: "ORD12347",
//               createdAt: "2024-05-25T08:30:00.000Z",
//               status: "Completed",
//               total: 1200,
//             },
//           ]);
//         }
//       } catch (e) {
//         setCustomer(null);
//         setContacts([]);
//       }
//       setLoading(false);
//     };
//     fetchAll();
//   }, [id]);

//   if (loading) return <Spinner />;
//   if (!customer)
//     return (
//       <div className="text-center p-12 text-lg text-[#1d8599]">
//         Customer not found.
//       </div>
//     );

//   // Order summary
//   const totalOrders = orders.length;
//   const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
//   const lastOrder = orders.length ? orders[0] : null;

//   // Helper for feedback/review
//   const isFeedbackPositive = (msg) =>
//     /good|great|excellent|awesome|amazing|love|thank/.test(msg.toLowerCase());

//   // Action: Promote as static feed (use your own handler)
//   const handlePromoteFeed = (contactId) => {
//     toast.success("Feedback promoted to site feed!"); // Implement your real logic
//   };

//   return (
//     <div className="flex min-h-screen bg-[#f7fdff]">
//       <AdminSidebar />
//       <main className="flex-1 p-8 overflow-y-auto">
//         <div className="max-w-3xl mx-auto">
//           {/* Header Card */}
//           <section className="bg-white shadow-xl rounded-2xl p-8 mb-8 flex flex-col sm:flex-row gap-6 items-center">
//             <div>
//               {customer.avatar ? (
//                 <img
//                   src={
//                     customer.avatar.startsWith("/uploads")
//                       ? BACKEND + customer.avatar
//                       : customer.avatar
//                   }
//                   alt="avatar"
//                   className="w-24 h-24 object-cover rounded-full border"
//                 />
//               ) : (
//                 <FaUserCircle className="text-6xl text-[#1d8599]" />
//               )}
//             </div>
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-[#1d8599]">
//                 {customer.name}
//               </h2>
//               <div className="text-sm text-gray-600">{customer.email}</div>
//               <div className="text-xs mt-1 text-[#146e88]">
//                 User ID: {customer._id}
//               </div>
//               <p className="mt-3 text-base font-medium text-[#2e4870]">
//                 {customer.name} joined us on{" "}
//                 <b>{customer.createdAt?.slice(0, 10)}</b>. They've placed{" "}
//                 <b>{totalOrders}</b> order{totalOrders !== 1 ? "s" : ""} and
//                 spent <b>₹{totalSpent}</b> in total.
//                 {lastOrder && (
//                   <>
//                     {" "}
//                     Last order: <b>#{lastOrder._id.slice(-5)}</b> on{" "}
//                     <b>{lastOrder.createdAt?.slice(0, 10)}</b>.
//                   </>
//                 )}
//               </p>
//             </div>
//           </section>

//           {/* Contact & Address Card */}
//           <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="font-bold mb-2 text-[#1d8599]">Contact Info</div>
//               <div className="mb-1">
//                 <b>Phone:</b>{" "}
//                 {customer.phone || <span className="text-gray-400">-</span>}
//               </div>
//               <div className="mb-1">
//                 <b>Email:</b> {customer.email}
//               </div>
//             </div>
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="font-bold mb-2 text-[#1d8599]">Address</div>
//               {customer.address ? (
//                 <>
//                   <div>{customer.address.line1}</div>
//                   <div>{customer.address.line2}</div>
//                   <div>
//                     {customer.address.city}, {customer.address.state}{" "}
//                     {customer.address.zipcode}
//                   </div>
//                   <div>{customer.address.country}</div>
//                 </>
//               ) : (
//                 <div className="text-gray-400">None saved.</div>
//               )}
//             </div>
//           </section>

//           {/* Orders */}
//           <section className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <div className="font-bold text-[#1d8599] mb-3">
//               Orders ({totalOrders})
//             </div>
//             {orders.length === 0 ? (
//               <div className="text-gray-400">
//                 No orders found for this customer.
//               </div>
//             ) : (
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-[#1d8599] border-b">
//                     <th className="py-2 px-3">Order ID</th>
//                     <th className="py-2 px-3">Date</th>
//                     <th className="py-2 px-3">Status</th>
//                     <th className="py-2 px-3 text-right">Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.slice(0, 5).map((o) => (
//                     <tr key={o._id} className="border-b">
//                       <td className="py-2 px-3 font-mono">
//                         #{o._id.slice(-5)}
//                       </td>
//                       <td className="py-2 px-3">{o.createdAt?.slice(0, 10)}</td>
//                       <td className="py-2 px-3">{o.status || "Placed"}</td>
//                       <td className="py-2 px-3 text-right">
//                         ₹{o.total?.toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </section>

//           {/* Feedback/Contact Submissions */}
//           <section className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <div className="font-bold text-[#1d8599] mb-3">
//               Feedback / Contact Form Messages ({contacts.length})
//             </div>
//             {contacts.length === 0 ? (
//               <div className="text-gray-400">
//                 No feedback/submissions by this customer.
//               </div>
//             ) : (
//               <ol className="space-y-4">
//                 {contacts.map((fb) => (
//                   <li key={fb._id} className="border-b pb-3">
//                     <div className="flex justify-between items-center gap-3">
//                       <span className="text-xs text-gray-400">
//                         {fb.createdAt?.slice(0, 10)}
//                         {fb.subject && (
//                           <>
//                             {" "}
//                             – <b className="text-[#084870]">{fb.subject}</b>
//                           </>
//                         )}
//                       </span>
//                       {isFeedbackPositive(fb.message) && (
//                         <button
//                           className="text-xs bg-[#d8fff1] border border-[#24ba5b] hover:bg-green-50 px-2 py-1 rounded text-[#24ba5b] font-semibold"
//                           onClick={() => handlePromoteFeed(fb._id)}
//                         >
//                           Promote as Feed
//                         </button>
//                       )}
//                     </div>
//                     <p className="mt-1 text-gray-700">{fb.message}</p>
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </section>

//           {/* Optionally: Admin actions section goes here */}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminCustomerDetail;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const BACKEND = "https://biller-backend-xdxp.onrender.com";

const AdminCustomerDetail = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const token = localStorage.getItem("token");
        // Fetch customer profile and contacts in parallel:
        const [custRes, contactsRes] = await Promise.all([
          axios.get(`${BACKEND}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BACKEND}/api/contact/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCustomer(custRes.data);
        setContacts(contactsRes.data);

        // Fetch user orders
        const ordersRes = await axios.get(`${BACKEND}/api/orders/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(ordersRes.data);
      } catch (e) {
        setCustomer(null);
        setContacts([]);
        setOrders([]);
        setNotFound(true);
      }
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) return <Spinner />;
  if (!customer || notFound)
    return (
      <div className="flex min-h-screen bg-[#f7fdff]">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <div className="text-center text-lg text-[#1d8599]">
            Customer not found.
          </div>
        </main>
      </div>
    );

  // Order summary
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const lastOrder = orders.length ? orders[0] : null;
  const getStatus = (o) =>
    o.status?.charAt(0).toUpperCase() + o.status?.slice(1) || "Placed";

  // Helper for feedback/review
  const isFeedbackPositive = (msg) =>
    /good|great|excellent|awesome|amazing|love|thank/.test(
      msg?.toLowerCase() || ""
    );

  // Action: Promote as static feed (use your own handler)
  const handlePromoteFeed = (contactId) => {
    toast.success("Feedback promoted to site feed!"); // Implement your real logic
  };

  return (
    <div className="flex min-h-screen bg-[#f7fdff]">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* Header Card */}
          <section className="bg-white shadow-xl rounded-2xl p-8 mb-8 flex flex-col sm:flex-row gap-6 items-center">
            <div>
              {customer.avatar ? (
                <img
                  src={
                    customer.avatar.startsWith("/uploads")
                      ? BACKEND + customer.avatar
                      : customer.avatar
                  }
                  alt="avatar"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              ) : (
                <FaUserCircle className="text-6xl text-[#1d8599]" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#1d8599]">
                {customer.name}
              </h2>
              <div className="text-sm text-gray-600">{customer.email}</div>
              <div className="text-xs mt-1 text-[#146e88]">
                User ID: {customer._id}
              </div>
              <p className="mt-3 text-base font-medium text-[#2e4870]">
                {customer.name} joined us on{" "}
                <b>{customer.createdAt?.slice(0, 10)}</b>. They've placed{" "}
                <b>{totalOrders}</b> order{totalOrders !== 1 ? "s" : ""} and
                spent <b>₹{totalSpent}</b> in total.
                {lastOrder && (
                  <>
                    {" "}
                    Last order: <b>#{lastOrder._id.slice(-5)}</b> on{" "}
                    <b>{lastOrder.createdAt?.slice(0, 10)}</b>.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* Contact & Address Card */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="font-bold mb-2 text-[#1d8599]">Contact Info</div>
              <div className="mb-1">
                <b>Phone:</b>{" "}
                {customer.phone || customer.address?.phone || (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              <div className="mb-1">
                <b>Email:</b> {customer.email}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="font-bold mb-2 text-[#1d8599]">Address</div>
              {customer.address ? (
                <>
                  <div>{customer.address.line1}</div>
                  <div>{customer.address.line2}</div>
                  <div>
                    {customer.address.city}, {customer.address.state}{" "}
                    {customer.address.zipcode}
                  </div>
                  <div>{customer.address.country}</div>
                  {customer.address.phone && (
                    <div>Phone: {customer.address.phone}</div>
                  )}
                  {customer.address.altPhone && (
                    <div>Alt: {customer.address.altPhone}</div>
                  )}
                </>
              ) : (
                <div className="text-gray-400">None saved.</div>
              )}
            </div>
          </section>

          {/* Orders */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="font-bold text-[#1d8599] mb-3">
              Orders ({totalOrders})
            </div>
            {orders.length === 0 ? (
              <div className="text-gray-400">
                No orders found for this customer.
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-[#1d8599] border-b">
                    <th className="py-2 px-3">Order ID</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o._id} className="border-b">
                      <td className="py-2 px-3 font-mono">
                        #{o._id.slice(-5)}
                      </td>
                      <td className="py-2 px-3">{o.createdAt?.slice(0, 10)}</td>
                      <td className="py-2 px-3">{getStatus(o)}</td>
                      <td className="py-2 px-3 text-right">
                        ₹{o.totalAmount?.toFixed(2) ?? "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Feedback/Contact Submissions */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="font-bold text-[#1d8599] mb-3">
              Feedback / Contact Form Messages ({contacts.length})
            </div>
            {contacts.length === 0 ? (
              <div className="text-gray-400">
                No feedback/submissions by this customer.
              </div>
            ) : (
              <ol className="space-y-4">
                {contacts.map((fb) => (
                  <li key={fb._id} className="border-b pb-3">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {fb.createdAt?.slice(0, 10)}
                        {fb.subject && (
                          <>
                            {" "}
                            – <b className="text-[#084870]">{fb.subject}</b>
                          </>
                        )}
                      </span>
                      {isFeedbackPositive(fb.message) && (
                        <button
                          className="text-xs bg-[#d8fff1] border border-[#24ba5b] hover:bg-green-50 px-2 py-1 rounded text-[#24ba5b] font-semibold"
                          onClick={() => handlePromoteFeed(fb._id)}
                        >
                          Promote as Feed
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-gray-700">{fb.message}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* Optionally: Admin actions section here */}
        </div>
      </main>
    </div>
  );
};

export default AdminCustomerDetail;
