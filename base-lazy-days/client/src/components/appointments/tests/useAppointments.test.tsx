import { act, renderHook, waitFor } from "@testing-library/react";

import { useAppointments } from "../hooks/useAppointments";
import { AppointmentDateMap } from "../types";

import { createQueryClientWrapper } from "@/test-utils";

// 날짜별 예약 수를 모두 합산하여 총 예약 수를 계산하는 함수
const getAppointmentCount = (appointments: AppointmentDateMap) =>
  Object.values(appointments).reduce(
    (runningCount, appointmentsOnDate) =>
      runningCount + appointmentsOnDate.length,
    0
  );
test("filter appointments by availability", async () => {
  const { result } = renderHook(() => useAppointments(), {
    wrapper: createQueryClientWrapper(),
  });
  // 예약 data를 잘 가져왔는지 확인
  await waitFor(() =>
    expect(getAppointmentCount(result.current.appointments)).toBeGreaterThan(0)
  );
  // 초기 예약 수를 저장
  const filteredAppointmentsLength = getAppointmentCount(
    result.current.appointments
  );
  // 필터 변경
  act(() => result.current.setShowAll(true));

  await waitFor(() =>
    expect(getAppointmentCount(result.current.appointments)).toBeGreaterThan(
      filteredAppointmentsLength
    )
  );
});
