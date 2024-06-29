import { QueryClient, QueryCache } from "@tanstack/react-query";
import { toast } from "@/components/app/toast";

function errorHandler(errorMsg: string) {
  // https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  // 중복되는 id가 없게
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}
// global default value
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분마다 캐시에서 만료된 데이터를 정리
      refetchOnWindowFocus: false, // 창 포커스 시 리패치하지 않음
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      errorHandler(error.message);
    },
  }),
});
