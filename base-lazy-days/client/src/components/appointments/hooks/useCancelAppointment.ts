import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  console.log(appointment);
  const patchData = [{ op: "remove", path: "/userId" }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutate } = useMutation({
    // mutationFn: (appointment: Appointment) =>
    //   removeAppointmentUser(appointment),
    mutationFn: removeAppointmentUser, // 추가 인수가 없기 때문에 익명함수가 필요없음, removeAppointmentUser에 전달할 인수가 mutate함수에 전달한 것과 동일하기 땨문에

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({ title: "you have canceled the appointment", status: "warning" });
    },
  });

  return mutate;
}
