// 1. 라이브러리 가져오기 묶음
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// 2. ./ 컴포넌트 묶음
import { Home } from "./Home";
import { Loading } from "./Loading";
import { Navbar } from "./Navbar";
import { ToastContainer } from "./toast";
// 3. @ 컴포넌트 묶음
import { AuthContextProvider } from "@/auth/AuthContext";
import { Calendar } from "@/components/appointments/Calendar";
import { AllStaff } from "@/components/staff/AllStaff";
import { Treatments } from "@/components/treatments/Treatments";
import { Signin } from "@/components/user/Signin";
import { UserProfile } from "@/components/user/UserProfile";
import { theme } from "@/theme";
import { queryClient } from "@/react-query/queryClient";

export function App() {
  return (
    // 에러 핸들을 Chakra toasts로 사용할 것이기 때문에 QueryClientProvider가 ChakraProvider안에 있어야 한다. 따라서 queryClient를 위해 Chakra에 접속할 수 있어야 한다.
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        {/* AuthContextProvider는 리액트 쿼리를 사용해 사용자가 로그인하고, 로그아웃할 때  사용자에 대한 서버 정보로 캐시를 업데이트 한다. 따라서 QueryClientProvider인에 위치한다.*/}
        <AuthContextProvider>
          <Loading />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Staff" element={<AllStaff />} />
              <Route path="/Calendar" element={<Calendar />} />
              <Route path="/Treatments" element={<Treatments />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </AuthContextProvider>
        {/* ReactQueryDevtools은 QueryClientProvider안에만 위치하면 된다. */}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
