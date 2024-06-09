import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get("/staff");
  return data;
}

export function useStaff() {
  const [filter, setFilter] = useState("all");
  console.log(filter);
  const fallback: Staff[] = [];

  const { data = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
  });

  const staff = useMemo(() => {
    if (filter === "all") {
      return data;
    }
    return filterByTreatment(data, filter);
  }, [data, filter]);

  return { staff, filter, setFilter };
}
