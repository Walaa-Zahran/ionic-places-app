export interface CustomEventWithDetail extends CustomEvent {
  detail: { value: string };
}
