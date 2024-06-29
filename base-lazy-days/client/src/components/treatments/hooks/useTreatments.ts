import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get("/treatments");
  return data;
}

/**
 *
 * @returns treatments 서버에서 받아온 값
 */
export function useTreatments(): Treatment[] {
  const fallback: Treatment[] = [];
  // TODO: get data from server via useQuery
  const { data = fallback } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
    // defaultOptions으로 옮김
    // staleTime: 600000, // gcTime이 5분인데 staleTime이 10분으로 초과하면 표시할 데이터가 없다.
    // gcTime: 900000,
    // refetchOnMount: false, // 컴포넌트가 마운트될 때 데이터를 자동으로 리패치
    // refetchOnWindowFocus: false, //사용자가 브라우저 창으로 돌아올 때 데이터를 자동으로 리패치
    // refetchOnReconnect: false, //네트워크가 다시 연결되면 데이터를 자동으로 리패치
  });

  return data;
}

// 캐시를 채우는 것이므로 아무것도 반환하지 않는다. data를 가져오기 만 함. 캐시에 저장, 그래서 queryKey를 똑같은거 사용
export function usePrefetchTreatments(): void {
  // queryClient가 필요, useQueryClient를 불러오자
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({
    // queryKeys :  어떤 useQuery가 캐시에서 이 데이터를 찾아야 하는지 알려준다. 위에 있는 캐시에 있는 데이터가 useQuery호출과 일치한다는 것을 의미
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
}
