export enum OrderStatus {
    // When order has been created but ticket is it trying to order has not been reserved
    Created = 'created',

    // When ticket the order is  trying to reserve has already been reserved, 
    // the user cancelled the order, 
    // or the order expires before payment
    Cancelled = 'cancelled',

    // The order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // The order has reserved the ticket and the user has payed succesfully
    Complete = 'complete'
}