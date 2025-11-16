import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, Keyboard } from "lucide-react";

export function HotkeysInfo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Keyboard className="h-4 w-4" />
          <span className="sr-only">Горячие клавиши</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            <h3 className="font-semibold">Горячие клавиши</h3>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <h4 className="mb-2 font-medium">На странице объявления:</h4>
              <div className="text-muted-foreground space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>A</span>
                  <span>Одобрить объявление</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>D</span>
                  <span>Отклонить объявление</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>S</span>
                  <span>Вернуть на доработку</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>← / Q</span>
                  <span>Предыдущее объявление</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>→ / E</span>
                  <span>Следующее объявление</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="mb-2 font-medium">
                В диалоге отклонения/доработки:
              </h4>
              <div className="text-muted-foreground space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>1-5</span>
                  <span>Выбрать причину (1-5)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>6</span>
                  <span>Выбрать "Другое"</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enter</span>
                  <span>Отправить</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <h4 className="mb-2 font-medium">На главной странице:</h4>
              <div className="text-muted-foreground space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>/</span>
                  <span>Фокус на поиск</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
