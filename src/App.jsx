import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import AuthContextComponent from "./components/context/AuthContext";
import { TableContextComponent } from "./components/context/TableContext";
import { DrawerContextComponent } from "./components/context/DrawerContext";

function App() {
  return (
    <BrowserRouter>
      <TableContextComponent>
        <AuthContextComponent>
          <DrawerContextComponent>
            <AppRouter />
          </DrawerContextComponent>
        </AuthContextComponent>
      </TableContextComponent>
    </BrowserRouter>
  );
}

export default App;
