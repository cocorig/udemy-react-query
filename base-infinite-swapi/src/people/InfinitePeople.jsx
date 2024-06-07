import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  console.log(url);
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["sw-people"],
    // queryFn는 객체 매개변수를 받고, 프로퍼티로 pageParams을 갖고 있다.
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      // lastPage를 가져와서 pageParam을 lastPage.next로 설정한다. fetchNextPage를 실행하면, next 프로퍼티가 무엇인지에 따라 마지막 페이지에 도착한 다음 pageParam을 사용하게 된다.
      //lastPage.next 값으로 pageParam를 업데이트한다.
      return lastPage.next || undefined;
    },
  });

  // isFetching을 하면 새로운 페이지가 로딩될 때 데이터를 가져와야 하므로 조기 반환이 실행되기 때문에
  // 처음에 데이터를 가져올 때 데이터가 없으니까 isLoading으로 설정
  if (isLoading) {
    return <div className="loading">isLoading..</div>;
  }
  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }
  return (
    <>
      {isFetching && <div className="loading">isFetching..</div>}

      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
