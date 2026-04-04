import React, { createContext, useContext, useState, useMemo } from "react";
import { tv } from "tailwind-variants";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

// COMMERCIAL UPDATE: Added better width transition and background consistency
const sidebarStyles = tv({
  base: "fixed inset-y-0 left-0 z-50 flex h-full w-[280px] flex-col bg-white border-r border-gray-100 shadow-xl shadow-gray-200/50 transition-all duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none",
  variants: {
    open: {
      true: "translate-x-0",
      false: "-translate-x-full",
    },
  },
});

export const Sidebar = ({ children, className }) => {
  const { open, setOpen } = useSidebar();

  // Helper to safely separate fixed slots (Header/Footer) from scrollable content
  const childrenArray = React.Children.toArray(children);
  const header = childrenArray.find((c) => c.type === SidebarHeader);
  const footer = childrenArray.find((c) => c.type === SidebarFooter);
  const content = childrenArray.filter(
    (c) => c.type !== SidebarHeader && c.type !== SidebarFooter
  );

  return (
    <>
      <aside className={sidebarStyles({ open, className })}>
        <div className="flex h-full flex-col">
          {header}
          <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
            {content}
          </div>
          {footer}
        </div>
      </aside>

      {/* Mobile overlay - Commercial Grade Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export const SidebarHeader = ({ children, className }) => (
  <header className={`px-6 py-6 border-b border-gray-50 flex items-center gap-3 ${className}`}>
    {/* Commercial Logo Placeholder */}
    <div className="h-9 w-9 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-lg shadow-purple-200">
      <span className="font-black text-lg">T</span>
    </div>
    <div className="flex flex-col">
      <span className="text-slate-900 font-bold leading-tight tracking-tight">
        {children || "Thonket Admin"}
      </span>
      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Wholesale v1.0</span>
    </div>
  </header>
);

export const SidebarContent = ({ children, className }) => (
  <div className={`flex flex-col gap-6 ${className}`}>{children}</div>
);

export const SidebarFooter = ({ children, className }) => (
  <footer className={`p-4 border-t border-gray-50 bg-gray-50/50 ${className}`}>
    {children}
  </footer>
);

export const SidebarGroup = ({ children, className }) => (
  <div className={`mt-6 first:mt-2 ${className}`}>{children}</div>
);

export const SidebarGroupLabel = ({ children, className }) => (
  <p className={`px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3 ${className}`}>
    {children}
  </p>
);

export const SidebarGroupContent = ({ children, className }) => (
  <div className={`space-y-1 ${className}`}>{children}</div>
);

export const SidebarMenu = ({ children, className }) => (
  <ul className={`space-y-1 ${className}`}>{children}</ul>
);

export const SidebarMenuItem = ({ children, className }) => (
  <li className={className}>{children}</li>
);

// COMMERCIAL UPDATE: More sophisticated "Active" state
const sidebarMenuButtonStyles = tv({
  base: "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ease-in-out",
  variants: {
    isActive: {
      true: "bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-100",
      false: "text-slate-500 hover:bg-gray-50 hover:text-slate-900",
    },
  },
});

export const SidebarMenuButton = ({ children, className, isActive, ...props }) => (
  <button
    className={sidebarMenuButtonStyles({ isActive, className })}
    {...props}
  >
    {children}
  </button>
);