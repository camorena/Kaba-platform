/** Raised by CustomersRepo.update when the email already belongs to another customer. */
export class CustomerEmailTakenError extends Error {
  constructor() {
    super("Email already belongs to another customer.");
    this.name = "CustomerEmailTakenError";
  }
}
