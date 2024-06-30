import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { generateUserKey } from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

// id와 토큰으로 api 요청
export function useUser() {
  const queryClient = useQueryClient();
  const { userId, userToken } = useLoginData();

  const { data: user } = useQuery({
    //쿼리를 활성화하거나 비활성화할 때 사용되는 옵션 ,userId가 유효한지 확인,유효하지 않다면 queryFn는 실행하지 않는다.
    enabled: !!userId,
    queryKey: generateUserKey(userId),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity, // 이 데이터는 사용자가 스스토 업데이트할 경우에만 변경된다.
  });
  // 처음 로그인할 때와 로그아웃할 때 캐시를 업데이트하는 방법?

  // 특정 키에 대해 캐시에 데이터를 업데이트
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(newUser.id),
      newUser // 설정될 데이터
    );
  }
  // id에 따른 다른 토큰을 가진 쿼리가 있음,
  function clearUser() {
    //패턴에 맞는 모든 쿼리 제거
    queryClient.removeQueries({ queryKey: [queryKeys.user] });
    // 쿼리 키와 일치하는 사용자 예약을 위한 쿼리
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    });
  }

  return { user, updateUser, clearUser };
}
