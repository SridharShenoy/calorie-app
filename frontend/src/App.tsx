import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
import AddLog from "./pages/addLog";
import ProgPics from "./pages/progressPictures";
import NotFoundPage from "./pages/404";
import CalorieChangeReq from "./pages/goalCalChange";
import LogsDisplay from "./pages/view-logs";
import ResultsPage from "./pages/data";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <p>Search Page</p>
            </Layout>
          }
        />
        <Route
              path="/404"
              element={
                <Layout>
                  <NotFoundPage/>
                </Layout>
              }
              />
        <Route path="/register" element={<Layout><Register /></Layout>}
        />
        <Route path="/sign-in" element={<Layout><SignIn /></Layout>}
        />
        {isLoggedIn && (
          <>
            <Route
              path="/add-log/:date"
              element={
                <Layout>
                  <AddLog />
                </Layout>
              }
            />

            <Route
              path="/results"
              element={
                <Layout>
                  <ResultsPage />
                </Layout>
              }
            />      
            <Route
              path="/my-progress-pictures"
              element={
                <Layout>
                  <ProgPics/>
                </Layout>
              }
              />
              <Route
              path="/my-logs"
              element={
                <Layout>
                  <LogsDisplay/>
                </Layout>
              }
              />
              <Route
              path="/set-calories"
              element={
                <Layout>
                  <CalorieChangeReq />
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;