<script>
  import { Route, Router } from "svelte-navigator";
  import Dashboard from "./pages/Dashboard.svelte";
  import OperatorList from "./pages/Operator/List.svelte";
  import PulsaList from "./pages/Pulsa/List.svelte";
  import CategoryList from "./pages/Category/List.svelte";
  import PostList from "./pages/Post/List.svelte";
  import PageNotFound from "./pages/PageNotFound.svelte";
</script>

<Router>
  <Route primary={false} path="/admin"><Dashboard /></Route>
  <Route primary={false} path="/admin/operator"><OperatorList /></Route>
  <Route primary={false} path="/admin/pulsa"><PulsaList /></Route>
  <Route primary={false} path="/admin/kategori"><CategoryList /></Route>
  <Route primary={false} path="/admin/post"><PostList /></Route>

  <Route primary={false} path="*"><PageNotFound /></Route>
</Router>
