import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get("/treatments");
  return data;
}

export function useTreatments(): Treatment[] {
  const fallback: Treatment[] = [];
  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });

  return data;
}

// 캐시를 채우는 것이므로 아무것도 반환하지 않는다.
export function usePrefetchTreatments(): void {
  // queryClient가 필요, useQueryClient를 불러오자
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    // queryKeys :  어떤 useQuery가 캐시에서 이 데이터를 찾아야 하는지 알려준다. 위에 있는 캐시에 있는 데이터가 useQuery호출과 일치한다는 것을 의미
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
}
