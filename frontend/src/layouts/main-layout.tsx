import { ModeToggle } from "@/components/mode-toggle";
import { NavLink, Outlet } from "react-router";

export function MainLayout() {
  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      <nav className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="text-xl font-bold">Модероратор</div>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <ul className="flex gap-2">
            <li>
              <NavLink prefetch="intent" to="/list" className="hover:underline">
                Главная страница
              </NavLink>
            </li>

            <li>|</li>

            <li>
              <NavLink
                prefetch="intent"
                to="/stats"
                className="hover:underline"
              >
                Статистика
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
