import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import AddEventSheet from "../pages/home/add-event-sheet";
import EditEventSheet from "../pages/home/edit-event-sheet";
import { EventDTO } from "~/api/events";

registerSheet("add-event-sheet", AddEventSheet);
registerSheet("edit-event-sheet", EditEventSheet);

declare module "react-native-actions-sheet" {
    interface Sheets {
        "add-event-sheet": SheetDefinition<{
            payload: {
                selectedDate: Date;
                startHour: number;
                endHour?: number;
                user_id: string;
                refetchEvents: () => void;
                getToken: () => Promise<string | null>;
            };
        }>;
        "edit-event-sheet": SheetDefinition<{
            payload: {
                event: EventDTO;
                refetchEvents: () => void;
                getToken: () => Promise<string | null>;
            };
        }>;
    }
}
