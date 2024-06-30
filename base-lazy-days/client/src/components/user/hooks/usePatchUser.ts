import { useMutation, useQueryClient } from "@tanstack/react-query";
import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { toast } from "@/components/app/toast";
import { queryKeys } from "@/react-query/constants";

export const MUTATION_KEY = "patch-user";

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
}

export function usePatchUser() {
  const { user } = useUser();

  const queryClient = useQueryClient();

  const { mutate: patchUser } = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: () => {
      toast({ title: "user updated!", status: "success" });
      // updateUser(userData); -> 성공 후 말고 즉시 업데이트로 변경
    }, // 서버에서 받은 응답으로 updateUser실행 -> 사용자 데이터를 업데이트하면 다른 토큰을 포함하기 때문에 완전히 새로운 항목을 만든다.

    // onSettled: onSuccess + onError, 즉시 업데이트 변경, invalidateQueries가 완료되고 서버에서 새로운 데이터를 받을 때 까지 변형이 진행 중인 상태를 유지하기 위해 프로미스를 반환 해야 함.
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: [queryKeys.user] });
    },
  });

  return patchUser;
}

/* 특정 키에 대해 캐시에 데이터를 업데이트

사용자 정보를 업데이트할 때 새로운 쿼리가 생성된다. 토큰도 같이 쿼리키에 넣어서 업데이트하면 매번 다른 토큰으로 쿼리가 생성되기 때문에 정보가 업데이트 되지않는 문제가 있다.
그래서  쿼리키에 토큰이 변경되더라도 사용자 id에 대한 키를 동일하게 유지해야 하기 때문에 사용자 토큰을 배제시키고 즉시 기존 쿼리를 새 데이터로 업데이트한다.

쿼리키를 id만 주고 업데이트
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(newUser.id),
      newUser 
    );
  }
 */
