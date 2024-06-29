import dayjs from "dayjs";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { MonthYear, getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

// 기본값 오버라이드
const commonOptions = {
  staleTime: 0, // 데이터가 유지될 시간
  gcTime: 30000, // 기본 캐시 시간
};
export async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

export function useAppointments() {
  console.log("useAppointments 훅 실행");
  const currentMonthYear = getMonthYearDetails(dayjs());
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  const [showAll, setShowAll] = useState(false);
  const { userId } = useLoginData();

  // select함수
  const selectFn = useCallback(
    (data: AppointmentDateMap, showAll: boolean) => {
      console.log("select 함수 실행");
      if (showAll) return data;
      // 로그인한 사용자에게 예약된 appointments가 있을 경우
      return getAvailableAppointments(data, userId);
    },
    [userId]
  );

  const fallback: AppointmentDateMap = {};
  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: (data) => selectFn(data, showAll), //쿼리함수에서 반환된 데이터가 전달됨
    ...commonOptions,
    refetchInterval: 60000, // 1분마다 데이터를 다시 가져옴 (폴링)
    refetchOnWindowFocus: true,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery({
      queryKey: [
        queryKeys.appointments,
        nextMonthYear.year,
        nextMonthYear.month,
      ],
      queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      ...commonOptions,
    });
  }, [monthYear, queryClient]);

  return {
    appointments,
    monthYear,
    updateMonthYear,
    showAll,
    setShowAll,
    getAppointments,
  };
}
