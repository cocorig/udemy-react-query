import { AllStaff } from "../AllStaff";

import { render, screen } from "@/test-utils";

test("renders response from query", async () => {
  render(<AllStaff />);
  const allStaffTitles = await screen.findAllByRole("heading", {
    name: /divya|sandra|michael|mateo/i,
  });
  expect(allStaffTitles).toHaveLength(4);
});
