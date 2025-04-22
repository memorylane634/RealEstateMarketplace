import { useEffect, useState } from "react";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";

export function AdminProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem("adminAuth");
    setIsAdmin(adminAuth === "true");
  }, []);

  if (isAdmin === null) {
    // Loading state
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!isAdmin) {
    // Redirect to admin login if not authenticated
    return (
      <Route path={path}>
        <Redirect to="/admin/login" />
      </Route>
    );
  }

  // Render the protected admin component
  return <Route path={path} component={Component} />;
}