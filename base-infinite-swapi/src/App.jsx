import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import { InfinitePeople } from "./people/InfinitePeople";
import { InfiniteSpecies } from "./species/InfiniteSpecies";
import { InfiniteTodos } from "./todos/InfiniteTodos";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Infinite SWAPI</h1>
        {/* <InfinitePeople /> */}
        {/* <InfiniteSpecies /> */}
        <InfiniteTodos />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
