import { AllStaff } from "../AllStaff";

import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { render, screen } from "@/test-utils";

test("handles query error", async () => {
  // (re)set handler to return a 500 error for staff and treatments
  server.use(
    http.get("http://localhost:3030/staff", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/treatments", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<AllStaff />);
  // api 요청 실패시 에러 메시지를 표사하는지 검증
  const alertToast = await screen.findByRole("status");
  expect(alertToast).toHaveTextContent(/could not fetch data/i);
});
