import React, { createContext, useContext, useState } from "react";
import { tv } from "tailwind-variants";

const SidebarContext = createContext();

const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const sidebarStyles = tv({
  base: "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-white text-sidebar-foreground shadow-lg transition-transform duration-300 ease-in-out md:relative md:w-72 md:translate-x-0",
  variants: {
    open: {
      true: "translate-x-0",
      false: "-translate-x-full",
    },
  },
});

const Sidebar = ({ children, className }) => {
  const { open, setOpen } = useSidebar();

  const footer = React.Children.toArray(children).find(
    (c) => c.type === SidebarFooter
  );
  const content = React.Children.toArray(children).filter(
    (c) => c.type !== SidebarFooter
  );

  return (
    <>
      <aside className={sidebarStyles({ open, className })}>
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">{content}</div>
          {footer}
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

const SidebarHeader = ({ children, className }) => (
  <header className={`p-4 ${className}`}>{children}</header>
);

const SidebarContent = ({ children, className }) => (
  <div className={`flex-1 ${className}`}>{children}</div>
);

const SidebarFooter = ({ children, className }) => (
  <footer className={`p-4 ${className}`}>{children}</footer>
);

const SidebarGroup = ({ children, className }) => (
  <div className={`px-4 py-2 ${className}`}>{children}</div>
);

const SidebarGroupLabel = ({ children, className }) => (
  <h3
    className={`px-4 text-sm font-semibold text-sidebar-muted-foreground ${className}`}
  >
    {children}
  </h3>
);

const SidebarGroupContent = ({ children, className }) => (
  <div className={`py-1 ${className}`}>{children}</div>
);

const SidebarMenu = ({ children, className }) => (
  <ul className={`space-y-1 ${className}`}>{children}</ul>
);

const SidebarMenuItem = ({ children, className }) => (
  <li className={className}>{children}</li>
);

const sidebarMenuButtonStyles = tv({
  base: "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
  variants: {
    isActive: {
      true: "bg-purple-700 text-white",
      false: "hover:bg-purple-600 hover:text-white",
    },
  },
});

const SidebarMenuButton = ({ children, className, isActive, ...props }) => (
  <button className={sidebarMenuButtonStyles({ isActive, className })} {...props}>
    {children}
  </button>
);

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
};
