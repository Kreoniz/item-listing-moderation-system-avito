import { NavLink, Outlet } from "react-router";

export function MainLayout() {
  return (
    <nav>
      <ul className="flex gap-2">
        <li>
          <NavLink to="/list" className="hover:underline">
            Главная страница
          </NavLink>
        </li>
        <li>
          <NavLink to="/stats" className="hover:underline">
            Статистика
          </NavLink>
        </li>
      </ul>

      <Outlet />
    </nav>
  );
}
