import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import AddEventSheet from "../pages/home/add-event-sheet";

registerSheet("add-event-sheet", AddEventSheet);

declare module "react-native-actions-sheet" {
    interface Sheets {
        "add-event-sheet": SheetDefinition<{
            payload: {
                selectedDate: Date;
                startHour: number;
                user_id: number;
            };
        }>;
    }
}
