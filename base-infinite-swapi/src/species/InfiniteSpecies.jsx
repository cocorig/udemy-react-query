import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
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
    queryKey: ["sw-species"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined;
    },
  });
  if (isLoading) {
    return <div className="loading">isLoading..</div>;
  }
  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }
  return (
    <>
      {isFetching && <div className="loading">isLoading..</div>}
      {/* loadMore은 fetchNextPage가 된다. fetchNextPage는 useInfiniteQuery를 관리하며, pageParam 값이 무엇이든 queryFn를 실행하고, data가 들어온 후 pageParam를 업데이트한다 */}
      <InfiniteScroll
        initialLoad={false}
        // 현재 데이터를 가져오고 있지 않을 때만 fetchNextPage를 실행한다. 이렇게 하면 api에 대한 중복 호출을 방지할 수 있다.
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => (
            <Species
              key={person.name}
              name={person.name}
              language={person.language}
              averageLifespan={person.average_lifespan}
            />
          ));
        })}
      </InfiniteScroll>
    </>
  );
}
