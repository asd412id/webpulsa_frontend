<script>
  import { Route, Router } from "svelte-navigator";
  import Dashboard from "./pages/Dashboard.svelte";
  import OperatorList from "./pages/Operator/List.svelte";
  import PulsaCategoryList from "./pages/PulsaCategory/List.svelte";
  import PulsaList from "./pages/Pulsa/List.svelte";
  import CategoryList from "./pages/Category/List.svelte";
  import PostList from "./pages/Post/List.svelte";
  import PageNotFound from "./pages/PageNotFound.svelte";
  import Home from "./pages/Frontpage/Home.svelte";
  import Blog from "./pages/Frontpage/Blog.svelte";
  import BlogDetail from "./pages/Frontpage/BlogDetail.svelte";
</script>

<Router>
  <Route primary={false} path="/admin"><OperatorList /></Route>
  <!-- <Route primary={false} path="/admin/operator"><OperatorList /></Route> -->
  <Route primary={false} path="/admin/jenis-pulsa"><PulsaCategoryList /></Route>
  <Route primary={false} path="/admin/pulsa"><PulsaList /></Route>
  <Route primary={false} path="/admin/kategori"><CategoryList /></Route>
  <Route primary={false} path="/admin/post"><PostList /></Route>

  <Route primary={false} path="/"><Home /></Route>
  <Route primary={false} path="/blog"><Blog /></Route>
  <Route path="/blog/:slug"><BlogDetail /></Route>

  <Route primary={false} path="*"><PageNotFound /></Route>
</Router>
