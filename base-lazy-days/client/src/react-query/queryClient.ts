import {
  QueryClient,
  QueryCache,
  MutationCache,
  QueryClientConfig,
} from "@tanstack/react-query";
import { toast } from "@/components/app/toast";

function createTitle(errorMsg: string, actionType: "query" | "mutation") {
  const action = actionType === "query" ? "fetch" : "update";
  return `could not ${action} data :${
    errorMsg ?? "error connecting to server"
  }`;
}
function errorHandler(title: string) {
  // 중복되는 id가 없게
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분마다 캐시에서 만료된 데이터를 정리
      refetchOnWindowFocus: false, // 창 포커스 시 리패치하지 않음
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const title = createTitle(error.message, "query");
      errorHandler(title);
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      const title = createTitle(error.message, "mutation");
      errorHandler(title);
    },
  }),
};
// global default value
export const queryClient = new QueryClient(queryClientOptions);
