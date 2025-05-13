import Customer from "./pages/ServiceManger";
import Dashboard from "./pages/dashboard";
import S_Transaction from "./pages/RentManager";
import Report from "./pages/reports";
import Setting from "./pages/setting";
import RentManager from "./pages/RentManager";
import ServiceManager from "./pages/ServiceManger";
import Shopkeepers from "./pages/ShopKeepers";
import StaffManager from "./pages/StaffManager";
import Incomes from "./pages/incomes";
import Expenses from "./pages/Expenses";
import BlockManager from "./pages/BlockManger";
import Agreements from "./pages/SubMenu1";
import Salaries from "./pages/Salaries";
import Rent from "./pages/RentManager";
import CreateUser from "./pages/CreaateUsers";
import Residentialunites from "./pages/ResidentialUnites";
import SubMenu1 from './pages/SubMenu1'
import SubMenu2 from "./pages/SubMenu2";
const MainContent = ({ activeComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "BlockManager":
        return <BlockManager />;
      case "user managements":
        return <UserManagement />;
      case "report":
        return <Report />;
      case "Salaries":
        return <Salaries />;
      case "setting":
        return <Setting />;
      case "ServiceManager":
        return <ServiceManager />;
      case "Shopkeepers":
        return <Shopkeepers />;
      case "Blockes":
        return <Residentialunites />;
      case "StafFManager":
        return <StaffManager />;
      case "Expenses":
        return <Expenses />;
      case "Incomes":
        return <Incomes />;
      case "SubMenu3":
        return <CreateUser />;
      case "SubMenu2":
        return <SubMenu2 />;
      case "SubMenu1":
        return <SubMenu1 />;
      default:
        return <Dashboard />;
    }
  };

  return <div className="min-h-[90vh]">{renderContent()}</div>;
};

export default MainContent;
