import { useCallback, useMemo, useState } from "react";
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
/**
 *
 * @returns 계산된 staff 배열, 현재 필터 값 , 필터세터함수를 반환
 */
export function useStaff() {
  const [filter, setFilter] = useState("all");
  // select함수
  const selectFn = useCallback(
    (unfilteredStaff: Staff[]) => {
      if (filter === "all") {
        return unfilteredStaff;
      }
      return filterByTreatment(unfilteredStaff, filter);
    },
    [filter]
  );
  const fallback: Staff[] = [];
  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: (data) => selectFn(data),
  });

  // const staff = useMemo(() => {
  //   if (filter === "all") {
  //     return data;
  //   }
  //   return filterByTreatment(data, filter);
  // }, [data, filter]);

  return { staff, filter, setFilter };
}
