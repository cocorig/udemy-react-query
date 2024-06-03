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
