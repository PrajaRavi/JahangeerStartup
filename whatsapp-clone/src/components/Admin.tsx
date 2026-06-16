import { useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Users,
  Package,
  Phone,
  Trash2,
  Pencil,
  Menu,
  X,
} from "lucide-react";

type TabType =
  | "users"
  | "orders"
  | "contacts";

export default function AdminPanel() {
  const [activeTab, setActiveTab] =
    useState<TabType>("users");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [deleteItem, setDeleteItem] =
    useState<any>(null);

  const users = [
    {
      id: "USR001",
      name: "Ravi",
      email: "ravi@gmail.com",
      phone: "9876543210",
    },
    {
      id: "USR002",
      name: "Amit",
      email: "amit@gmail.com",
      phone: "9876543211",
    },
  ];

  const orders = [
    {
      id: "ORD001",
      user: "Ravi",
      amount: "₹450",
      status: "Processing",
    },
    {
      id: "ORD002",
      user: "Amit",
      amount: "₹700",
      status: "Delivered",
    },
  ];

  const contacts = [
    {
      id: "CNT001",
      name: "Rahul",
      email: "rahul@gmail.com",
      message: "Need Help",
    },
  ];

  const getData = () => {
    switch (activeTab) {
      case "users":
        return users;

      case "orders":
        return orders;

      case "contacts":
        return contacts;

      default:
        return [];
    }
  };

  return (
    <div
      className="
      min-h-screen

      bg-gradient-to-br
      from-[#023B40]
      via-[#01282B]
      to-black

      flex
    "
    >
      {/* MOBILE MENU */}

      <button
        onClick={() =>
          setSidebarOpen(true)
        }
        className="
        md:hidden

        fixed
        top-5
        left-5

        z-50

        p-3

        rounded-xl

        bg-white/10

        text-white
      "
      >
        <Menu />
      </button>

      {/* SIDEBAR */}

      <AnimatePresence>
        {(sidebarOpen ||
          window.innerWidth >= 768) && (
          <>
            <motion.div
              initial={{
                x: -300,
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: -300,
              }}
              className="
              fixed
              md:static

              z-40

              w-72
              h-screen

              backdrop-blur-xl

              bg-white/10

              border-r
              border-white/10

              p-6
            "
            >
              <div
                className="
                flex
                items-center
                justify-between

                mb-10
              "
              >
                <h1
                  className="
                  text-2xl
                  font-bold
                  text-white
                "
                >
                  Admin
                </h1>

                <button
                  className="md:hidden"
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                >
                  <X
                    className="text-white"
                  />
                </button>
              </div>

              <div className="space-y-3">
                <SidebarButton
                  active={
                    activeTab ===
                    "users"
                  }
                  icon={<Users />}
                  label="Users"
                  onClick={() => {
                    setActiveTab(
                      "users"
                    );
                    setSidebarOpen(
                      false
                    );
                  }}
                />

                <SidebarButton
                  active={
                    activeTab ===
                    "orders"
                  }
                  icon={<Package />}
                  label="Orders"
                  onClick={() => {
                    setActiveTab(
                      "orders"
                    );
                    setSidebarOpen(
                      false
                    );
                  }}
                />

                <SidebarButton
                  active={
                    activeTab ===
                    "contacts"
                  }
                  icon={<Phone />}
                  label="Contacts"
                  onClick={() => {
                    setActiveTab(
                      "contacts"
                    );
                    setSidebarOpen(
                      false
                    );
                  }}
                />
              </div>
            </motion.div>

            {sidebarOpen && (
              <motion.div
                onClick={() =>
                  setSidebarOpen(false)
                }
                className="
                md:hidden
                fixed
                inset-0
                bg-black/50
              "
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* CONTENT */}

      <div className="flex-1 p-5 md:p-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
          backdrop-blur-xl

          bg-white/10

          border
          border-white/10

          rounded-3xl

          p-6
        "
        >
          {/* HEADER */}

          <div
            className="
            flex
            flex-col
            md:flex-row

            gap-4

            justify-between

            mb-6
          "
          >
            <h2
              className="
              text-3xl
              font-bold
              text-white
            "
            >
              {activeTab
                .charAt(0)
                .toUpperCase() +
                activeTab.slice(1)}
            </h2>

            <input
              placeholder="Search..."
              className="
              px-4
              py-3

              rounded-xl

              bg-white/10

              text-white

              outline-none
            "
            />
          </div>

          {/* TABLE */}

          <div
            className="
            overflow-x-auto
          "
          >
            <table
              className="
              w-full
              text-white
            "
            >
              <thead>
                <tr
                  className="
                  border-b
                  border-white/10
                "
                >
                  {Object.keys(
                    getData()[0] || {}
                  ).map((key) => (
                    <th
                      key={key}
                      className="
                      text-left

                      py-4
                    "
                    >
                      {key}
                    </th>
                  ))}

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {getData().map(
                  (item: any) => (
                    <tr
                      key={item.id}
                      className="
                      border-b
                      border-white/5
                    "
                    >
                      {Object.values(
                        item
                      ).map(
                        (
                          value,
                          idx
                        ) => (
                          <td
                            key={
                              idx
                            }
                            className="py-4"
                          >
                            {String(
                              value
                            )}
                          </td>
                        )
                      )}

                      <td>
                        <div className="flex gap-3">
                          <button
                            className="
                            p-2

                            rounded-lg

                            bg-cyan-500
                          "
                          >
                            <Pencil
                              size={
                                18
                              }
                            />
                          </button>

                          <button
                            onClick={() =>
                              setDeleteItem(
                                item
                              )
                            }
                            className="
                            p-2

                            rounded-lg

                            bg-red-500
                          "
                          >
                            <Trash2
                              size={
                                18
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* DELETE MODAL */}

      <AnimatePresence>
        {deleteItem && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
            fixed
            inset-0

            bg-black/60

            flex
            items-center
            justify-center

            p-5
          "
          >
            <motion.div
              initial={{
                scale: 0.8,
              }}
              animate={{
                scale: 1,
              }}
              exit={{
                scale: 0.8,
              }}
              className="
              w-full
              max-w-md

              backdrop-blur-xl

              bg-white/10

              border
              border-white/20

              rounded-3xl

              p-6

              text-white
            "
            >
              <h3
                className="
                text-2xl
                font-bold
              "
              >
                Confirm Delete
              </h3>

              <p className="mt-3 text-white/70">
                Are you sure you want to
                delete this record?
              </p>

              <div
                className="
                mt-6

                flex
                justify-end

                gap-3
              "
              >
                <button
                  onClick={() =>
                    setDeleteItem(null)
                  }
                  className="
                  px-5
                  py-3

                  rounded-xl

                  bg-white/10
                "
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    console.log(
                      "Delete",
                      deleteItem
                    );

                    setDeleteItem(
                      null
                    );
                  }}
                  className="
                  px-5
                  py-3

                  rounded-xl

                  bg-red-500
                "
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarButton({
  active,
  icon,
  label,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`
      w-full

      flex
      items-center
      gap-3

      p-4

      rounded-2xl

      transition-all

      ${
        active
          ? "bg-[#00D3F3] text-[#023B40]"
          : "bg-white/5 text-white"
      }
    `}
    >
      {icon}
      {label}
    </button>
  );
}