export class Estimate {
    amount: number;
    business: any;// {id: 1, name: "captain hook", address: null, street: null, numSiret: null, …}
    customer: any; // {id: 32, email: "wactoob@gmail.com", username: "Wactoob", firstname: null, lastname: null, …}
    date: any; //{date: "2021-01-27 07:06:29.000000", timezone_type: 3, timezone: "Europe/Berlin"}
    dateEstimated: any; // {date: "2021-01-27 07:06:29.000000", timezone_type: 3, timezone: "Europe/Berlin"}
    delivery_cost: number;
    estimate_number: string;
    id: number;
    is_payed: boolean;
    status: string;
    timeSlot: any; //{date: "2021-01-27 07:06:29.000000", timezone_type: 3, timezone: "Europe/Berlin"}
}