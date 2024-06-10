import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { TodoCard } from "./Todo";
import { useEffect } from "react";
// https://jsonplaceholder.typicode.com/todos?_page=2

const fetchUrl = async ({ pageParam }) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_page=${pageParam}`
  );
  return response.json();
};

export function InfiniteTodos() {
  const { ref, inView } = useInView();
  // console.log(inView);
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: fetchUrl,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });
  // inView가 true일 때 다음 페이지를 가져온다.
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // lastPage: 마지막으로 가져온 페이지의 데이터
  // allPages: 지금까지 가져온 모든 페이지의 데이터 배열
  // allPages.length : 지금까지 가져온 페이지 수

  // 처음 로딩때
  if (status === "pending") {
    return <div className="loading">첫 로딩..</div>;
  }
  if (status === "error") {
    return <div>에러! {error.message}</div>;
  }

  const content = data.pages.map((todos) =>
    todos.map((todo, index) => (
      <TodoCard
        ref={todos.length - 1 === index && todos.length - 1 ? ref : null}
        key={todo.id}
        todo={todo}
      />
    ))
  );

  return (
    <>
      {isFetching && <div className="loading">데이터 가져오는 중..</div>}
      {content}
      {/* <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
        {isFetchingNextPage
          ? "데이터 가져오는 중.."
          : hasNextPage
          ? "더보기"
          : "더 이상 가져올 데이터가 없습니다."}
      </button> */}
    </>
  );
}
