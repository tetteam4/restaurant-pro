import Customer from "./pages/Roles";
import Dashboard from "./pages/dashboard";
import S_Transaction from "./pages/RentManager";
import Report from "./pages/reports";
import Setting from "./pages/setting";
import RentManager from "./pages/RentManager";
import ServiceManager from "./pages/Roles";
import Shopkeepers from "./pages/ShopKeepers";
import StaffManager from "./pages/StaffManager";
import Incomes from "./pages/incomes";
import Expenses from "./pages/Expenses";
import Agreements from "./pages/SubMenu1";
import Salaries from "./pages/Salaries";
import Rent from "./pages/RentManager";
import CreateUser from "./pages/CreaateUsers";
import Residentialunites from "./pages/ResidentialUnites";
import SubMenu1 from "./pages/SubMenu1";
import SubMenu2 from "./pages/SubMenu2";
import SubMenu3 from "./pages/SubMenu3";
import SubMenu4 from "./pages/SubMenu4";
import PageSetting from "./pages/setting";
const MainContent = ({ activeComponent }) => {
  const renderContent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "user managements":
        return <UserManagement />;
      case "report":
        return <Report />;
      case "Salaries":
        return <Salaries />;
      case "settings":
        return <PageSetting />;
      case "roles":
        return <ServiceManager />;
      case "Shopkeepers":
        return <Shopkeepers />;
      case "StafFManager":
        return <StaffManager />;
      case "Expenses":
        return <Expenses />;
      case "Incomes":
        return <Incomes />;
      case "SubMenu4":
        return <SubMenu4 />;
      case "SubMenu3":
        return <SubMenu3 />;
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
