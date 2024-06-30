import { Spinner, Text } from "@chakra-ui/react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
export function Loading() {
  //  useIsFetching 훅을 사용하여 표시할지 안할지 여부를 결정해야 한다.
  // 패칭중이거나 변형중이거나 로딩표시
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  //console.log(isFetching, "isFetching");
  //useIsFetching의 반환은 현재 가져오기 상태인 쿼리 호춯의 수를 정수로 반환한다.

  const display = isFetching || isMutating ? "inherit" : "none";

  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="olive.200"
      color="olive.800"
      role="status"
      position="fixed"
      zIndex="9999"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      display={display}
    >
      <Text display="none">Loading...</Text>
    </Spinner>
  );
}
