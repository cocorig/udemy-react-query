import { act, renderHook, waitFor } from "@testing-library/react";

import { useStaff } from "../hooks/useStaff";
import { createQueryClientWrapper } from "@/test-utils";

test("filter staff", async () => {
  const { result } = renderHook(() => useStaff(), {
    wrapper: createQueryClientWrapper(),
  });
  // staff 길이가 4인지 확인
  await waitFor(() => expect(result.current.staff).toHaveLength(4));

  act(() => result.current.setFilter("facial"));
  console.log(result.current);

  await waitFor(() => expect(result.current.staff).toHaveLength(3));
});
