import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Appointment } from "@shared/types";
import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// 사용자가 예약을 했을 때
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? "replace" : "add";
  const patchData = [{ op: patchOp, path: "/userId", value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment() {
  const queryClient = useQueryClient();
  //useReserveAppointment호출시 mutate반환 -> mutate함수에 예약 정보를 전달하고, setAppointmentUser실행
  const { userId } = useLoginData();

  const toast = useCustomToast(); // 예약 성공 피드뱍

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    // mutationFn의 인자들은 모두 mutate함수에 전달된다.

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] }); //  쿼리 무효화, 인자가 바로 쿼리 필터인자이다.queryKeys.appointments로 시작하는 모든 쿼리가 뮤효화된다.
      toast({ title: "You have reserved on appointment!", status: "success" });
    },
  }); // 캐시와 관련 없음,

  return mutate;
}
