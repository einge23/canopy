import { api, getAuthenticatedApi } from "./api-base";

export interface CreateEventRequest {
    name: string;
    start: Date;
    end: Date;
    location: string;
    description: string;
    user_id: string;
    color: string;
    recurrence_rule?: string;
}

export interface getUserEventsByDateRequest {
    user_id: string;
    date: Date;
}

export interface EventDTO {
    id: number;
    name: string;
    start: string; // ISO date string
    end: string; // ISO date string
    location: string;
    description: string;
    user_id: number;
    color: string;
    recurrence_rule?: string;
    created_at: string;
    updated_at: string;
}

export async function createEvent(request: CreateEventRequest, token: string) {
    const authApi = getAuthenticatedApi(token);
    const response = await authApi.post<EventDTO>("/events/create", request);
    return response.data;
}

export async function getUserEventsByDate(
    request: getUserEventsByDateRequest,
    token: string
) {
    const authApi = getAuthenticatedApi(token);

    const response = await authApi.get<EventDTO[]>(
        `/events/${request.user_id}/${request.date.toISOString()}`
    );
    console.log(response);
    return response.data;
}

// Add function for getting all user events
export async function getUserEvents(userId: string, token: string) {
    const authApi = getAuthenticatedApi(token);
    const response = await authApi.get<EventDTO[]>(`/events/user/${userId}`);
    return response.data;
}

// Add function for editing events
export async function editEvent(event: EventDTO, token: string) {
    const authApi = getAuthenticatedApi(token);
    const response = await authApi.put<EventDTO>("/events/edit", event);
    return response.data;
}

export async function deleteEvent(eventId: number, token: string) {
    const authApi = getAuthenticatedApi(token);
    const response = await authApi.delete<EventDTO>(`/events/${eventId}`);
    return response.data;
}
