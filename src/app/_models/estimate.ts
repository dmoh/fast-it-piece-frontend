export class Estimate {
    amount: number;
    business: any;// {id: 1, name: "captain hook", address: null, street: null, numSiret: null, …}
    customer: any; // {id: 32, email: "wactoob@gmail.com", username: "Wactoob", firstname: null, lastname: null, …}
    date: any; //{date: "2021-01-27 07:06:29.000000", timezone_type: 3, timezone: "Europe/Berlin"}
    dateEstimated: any; // {date: "2021-01-27 07:06:29.000000", timezone_type: 3, timezone: "Europe/Berlin"}
    deliveryCost: number;
    estimateNumber: string;
    totalAmount: number;
    id: number;
    isPayed: boolean;
    isExpress: boolean;
    payedAt: any;
    status: string;
    serviceCharge: number;
    timeSlot: any; //{date: "2021-01-27 07:06:29.000000", timezone_type: 3, timezone: "Europe/Berlin"}
}
