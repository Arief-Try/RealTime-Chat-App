export interface Ichat {
    created_at: string;
    ediatable: boolean;
    id: string;
    sender: string;
    text: string;
    users: {
        avatar_url: string;
        id: string;
        full_name: string;
    }
}