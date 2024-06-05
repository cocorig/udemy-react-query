# udemy-react-query

Code to support the Udemy course React Query: Server State Management in React

# 섹션 1: 쿼리 생성 및 로딩/에러 상태

- 서버: https://jsonplaceholder.typicode.com/

## React Query 사용 방법

### 설치 및 초기 설정

- React Query 설치

```bash
npm i @tanstack/react-query
```

- queryClient 생성 → 쿼리를 관리하고 서버 데이터도 저장하는 클라이언트
- 자식 컴포넌트에 캐시 및 클라이언트 구성을 제공할 QueryClientProvider를 적용, → 이 Provider 는 queryClient를 값으로 사용한다.
- 서버에서 데이터를 가져오려면, useQuery 훅을 사용해야 한다.

## 1. queryClient 및 Provider 추가

queryClient를 생성하고, `QueryClientProvider`로 하위 컴포넌트를 감싸면 모든 하위 컴포넌트에선 React Query 훅을 사용할 수 있다.

```jsx
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Posts } from "./Posts";
import "./App.css";

function App() {
  // QueryClient 생성 -> QueryClientProvider의 client 속성에 전달
  const queryClient = new QueryClient();

  return (
    // Provider의 자식 컴포넌트들은 캐시를 포함한 QueryClient에 접근 가능하다.
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Blog &apos;em Ipsum</h1>
        <Posts />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

## 2. useQuery로 쿼리 생성하기

```jsx
// Posts.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // 데이터 속성은 useQuery에 전달할 쿼리 함수의 반환값
  const { data } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  if (!data) {
    return <div></div>;
  }
  // useQuery에 어떤 데이터를 가져올지 알려주기 위한 옵션 객체
  // 1. queryKey : 쿼리 캐시 내의 데이터를 정의, 항상 배열이다.
  // 2. queryFn : 데이터를 가져오기 위해 실행할 함수
  // data는 fetchPosts가 결과를 반환한 후에 정의된다. fetchPosts는 비동기 함수 이기 때문에 데이터를 받아오기 전까지 데이터가 정의되어 있지 않다. -> 다 받아오면 실행?
  // -> isLoading으로 구분
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
```

# 3. 로딩 상태와 에러 상태 처리하기

`useQuery` 훅이 반환하는 객체에서 로딩 상태와 에러 상태를 처리할 수 있다.

[useQuery | TanStack Query React Docs](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

```jsx
const { data, isError, error, isLoading } = useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
});

if (isLoading) {
  return <h3>Loading...</h3>;
}

if (isError) {
  return <p>{error.toString()}</p>;
}
```

- `isLoading`: boolean
  - 쿼리에 대한 첫 번째 가져오기가 진행 중일 때마다 true이다.
  - isFetching && isPending 과 동일하다.
- `isError`: boolean

  - isError가 true 일 때 error 메시지를 보여 줄 수 있다.

  ```jsx
  export async function fetchPosts(pageNum = 1) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
    );
    throw new Error("you cannot have this data");
    return response.json();
  }

  // 반환하는 객체를 구조 분해 할당할 수 있다.
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isError) {
    return <p>{error.toString()}</p>;
  }
  ```

## isFetching 과 isLoading의 차이점

`isFetching`은 비동기 쿼리가 아직 해결되지 않았다는 것을 말한다.

아직 fetch가 완료되지 않았지만, axios 호출이나 graphql 호출 같은 다른 종류의 데이터를 가져오는 작업을 할 수 있다.

`isLoading`은 isFetching의 하위 집합으로 로딩 중이라는 것을 말한다. 쿼리 함수가 아직 미해결이지만 캐시 된 데이터도 없다. 이 쿼리를 전에 실행한 적이 없어서 데이터를 가져오는 중이고, 캐시 된 데이터도 없어서 보여 줄 수 없는 상태이다.

페이지네이션을 보면 캐시 된 데이터가 있는지 없는지 구분하는 것이 중요하다.

# 4. React Query 개발자 도구

[Devtools | TanStack Query React Docs](https://tanstack.com/query/latest/docs/framework/react/devtools)

# 5. staleTime vs gcTime

`staleTime`: 데이터를 다시 가져와야 할 때를 알려준다. 데이터가 오래되어 유효기간이 만료되었다는 뜻으로, 그저 데이터를 다시 점검하라는 의미이다. `staleTime`이 지난 데이터는 자동 데이터 prefetch의 트리거가 될 수 있다.

데이터 prefetch는 데이터가 stale 일 때만 트리거되고, staleTime에 따른 자동 데이터 prefetch 트리거를 예를 들면 쿼리를 포함하는 컴포넌트가 다시 마운트 되거나 브라우저 창이 다시 포커싱 될 때, 서버로부터 최신 데이터 버전을 가져오기 전에 데이터가 stale 상태여야 한다.

즉, 데이터가 stale이어야 refetch 트리거가 서버에서 데이터를 다시 가져온다.

`gcTime`: 데이터를 캐시에 유지할 시간을 결정한다.. 쿼리가 캐시에 있으나 사용되지 않을 때의 유효기간이다. 데이터가 현재 페이지에 표시되지 않으면 쿨 스토리지 상태로 들어가며, 이때 gcTime이 시작된다. gcTime이 지나면 데이터는 캐시에서 사라지며, 기본 시간은 5분이다. 이 시간은 데이터가 페이지에 표시된 후부터 측정된다.

### 요약

- **staleTime**: 데이터가 신선하게 유지되는 기간. 이 기간이 지나면 데이터는 stale 상태가 되어 다시 가져와야 한다.
- **gcTime**: 데이터가 캐시에 유지되는 기간. 이 기간이 지나면 캐시에서 데이터가 제거된다.

## 종속된 배열의 쿼리 키 사용

queryKey에 배열을 사용하면, 쿼리의 두 번째 요소를 추가하여 데이터가 업데이트되었을 때 새로운 쿼리를 생성할 수 있다. post.id가 업데이트될 때마다 각 쿼리는 개별적인 staleTime과 캐시 Time을 갖게 된다. 이 종속성 배열이 다르면, 리액트 쿼리는 이를 완전히 다른 것으로 간주하기 때문에 데이터를 가져올 때 사용하는 쿼리 함수의 모든 값은 키의 일부여야 한다.

```jsx
const { data, isLoading, error, isError } = useQuery({
  queryKey: ["comments", post.id],
  queryFn: () => fetchComments(post.id),
});
```

위의 코드처럼 post.id를 queryKey에 추가하면 ["comments", 3]와 같은 쿼리 키로 각 포스트에 대해 별도의 쿼리가 생기고, 캐시는 각각의 별도의 공간을 갖게 된다.

이렇게 하면 데이터가 달라도, 리액트 쿼리는 캐시에 데이터가 있다고 보고 새로 업데이트하지 않는 상황을 방지할 수 있다. post.id가 업데이트될 때마다 해당 포스트에 대한 새로운 데이터를 가져오게 된다.

<img width="530" alt="" src="https://github.com/cocorig/udemy-react-query/assets/95855640/9e88cec2-c126-4ecf-8f36-bf460251d24c">

comments 1, 2가 화면에 표시되지 않고 비활성 상태가 되면, 이 쿼리에 대한 gcTime이 진행 중이다. 쿼리가 비활성 상태가 되고 화면에 더 이상 표시되지 않으면, 설정된 gcTime에 따라 캐시에서 데이터가 제거된다.

---

# 섹션 2: Pagination 및 Prefetching과 Mutations

## Pagination

-현재 페이지의 컴포넌트 상태를 사용해 현재 페이지를 추적한다.
쿼리 키를 배열로 업데이트해서 우리가 가져오려는 해당 페이지 번호를 포함시킨다.

```jsx
const [currentPage, setCurrentPage] = useState(1);
```

- queryKey 업데이트

  가져오려는 해당 페이지 번호를 포함시킨다.

```jsx
const { data, isError, error, isLoading } = useQuery({
  queryKey: ["posts", currentPage],
  queryFn: () => fetchPosts(currentPage),
});
```

- 버튼 클릭 이벤트 처리

다음 , 이전 버튼 클릭 시, currentPage 상태를 업데이트한다. 그럼 리액트 쿼리는 쿼리 키의 변화를 감지하고 새로운 쿼리를 실행하여 새로운 페이지 번호의 데이터를 가져온다.

```jsx
  <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next page
        </button>
```

페이지 버튼을 클릭할 때마다 currentPage 상태가 업데이트되고, 리액트 쿼리는 새로운 페이지 번호에 대한 데이터를 가져온다.

## Prefetching

데이터를 미리 가져와 캐시에 추가하면 사용자가 다음 정보를 기다리지 않도록 할 수 있다

- 기본적으로 stale 상태로 간주(설정 가능)
- 데이터를 다시 가져오는 동안, 리액트 쿼리는 캐시에 있는 데이터를 제공한다.
  - 캐시가 만료되지 않았을 때 적용
- Prefetching은 페이지네이션뿐만 아니라 사용자가 다음에 필요할 모든 데이터를 미리 가져올 수 있다.
  - 예를 들어, 사용자가 웹사이트에서 특정 탭을 방문할 가능성이 높다면 그 데이터를 미리 가져올 수 있다.
- prefetchQuery는 queryClient의 메서드이다.

  - useQueryClient 훅을 사용하여 queryClient를 가져올 수 있다.

  ```jsx
  import { useQuery, useQueryClient } from "@tanstack/react-query";

  const queryClient = useQueryClient();

  useEffect(() => {
    // 마지막 페이지 전까지 미리 가져오기 실행
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClient]);
  ```

그럼 prefetchQuery은 어디서 실행하는게 좋을까? 상태 업데이트는 비동기적으로 이 업데이트가 이미 적용되었는지 정확히 알 수 없기 때문에 다음 페이지 버튼의 클릭 이벤트에서 prefetching을 실행하는 것 보다 현재 페이지가 변결될 때마다 useEffect를 써서 사용한다.

currentPage가 바뀔 때마다 queryClient의 prefetchQuery 메서드를 사용하여 쿼리 키의 종속성 배열에 다음 페이지를 추가하고, 쿼리 함수에 fetchPosts의 인자로 전달한다. 이를 통해 currentPage에 따라 nextPage의 데이터를 미리 캐시에 추가할 수 있다.

## Mutations

Mutation은 서버에 네트워크 호출을 통해 실제 데이터를 업데이트하는 작업을 의미한다.
예를 들어, 블로그에 포스트를 추가, 삭제하거나 포스트 제목을 변경하는 경우가 해당된다.

### useMutation

useQuery와 유사하지만 몇 가지 차이점이 있다.

- useMutation은 mutate 함수를 반환한다. 이 함수는 실제로 서버에 변경 사항을 호출할 때 사용된다.
- 데이터를 저장하지 않아서 쿼리 키가 필요 없다. 이는 변이(mutation)이지 쿼리(query)가 아니기 때문이다.
- isLoading 상태는 있지만, 캐시된 것이 없기 때문에 isFetching 상태는 없다.
- 기본적으로 retry가 없다.

[Mutations 공식 문서](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
