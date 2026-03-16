"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";

import { getState, getServerState, subscribe, initDemoStore } from "@/lib/demo/store";

export function useDemoState() {
  useEffect(() => {
    initDemoStore();
  }, []);

  return useSyncExternalStore(subscribe, getState, getServerState);
}
