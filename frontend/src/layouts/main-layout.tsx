import { NavLink, Outlet } from "react-router";

export function MainLayout() {
  return (
    <div className="mx-auto max-w-7xl p-4">
      <nav className="mb-4">
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
      </nav>

      <Outlet />
    </div>
  );
}
