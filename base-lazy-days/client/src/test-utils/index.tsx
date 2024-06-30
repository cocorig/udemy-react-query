import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as RtlRender } from "@testing-library/react";
import { PropsWithChildren, ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

import { queryClientOptions } from "@/react-query/queryClient";
// ** FOR TESTING CUSTOM HOOKS ** //
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  const queryClient = generateQueryClient();
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

//!!!! 리액트 쿼리 훅을 포함하는 컴포넌트를 테스트하기 위해 QueryClientProvider와 QueryClient로 컴포넌트를 감싸야 한다.
const generateQueryClient = () => {
  queryClientOptions.defaultOptions.queries.retry = false;
  // retry 테스트 시간초과로 false로 바꿈
  return new QueryClient(queryClientOptions);
};
// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
function customRender(ui: ReactElement, client?: QueryClient) {
  const queryClient = client ?? generateQueryClient();
  return RtlRender(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
