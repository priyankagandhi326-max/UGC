"use client";

import { useSyncExternalStore } from "react";

type ClientTimeProps = {
  iso: string;
  dateOnly?: boolean;
};

function subscribe() {
  return () => undefined;
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function ClientTime({ iso, dateOnly = false }: ClientTimeProps) {
  const isClient = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!isClient) {
    return <>...</>;
  }

  return <>{dateOnly ? new Date(iso).toLocaleDateString() : new Date(iso).toLocaleString()}</>;
}
