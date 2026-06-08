"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/app/resources/config";

type RouteGuardProps = {
  children: ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();

  const route = `/${pathname.split("/")[1]}`;

  const isRouteEnabled =
    routes[route as keyof typeof routes] !== false;

  if (!isRouteEnabled) {
    return null;
  }

  return <>{children}</>;
}