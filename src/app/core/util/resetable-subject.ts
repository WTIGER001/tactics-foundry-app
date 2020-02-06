
import { Observable, Subject, ReplaySubject, Observer } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";

export function resettable<T>(factory: () => Subject<T>): {
  observable: Observable<T>,
  reset(): void,
  subject: Subject<T>
} {
  const resetter = new Subject<any>();
  const source = new Subject<T>();
  let destination = factory();
  let subscription = source.subscribe(destination);
  return {
    observable: resetter.asObservable().pipe(
      startWith(null),
      switchMap(() => destination)
    ),
    reset: () => {
      subscription.unsubscribe();
      destination = factory();
      subscription = source.subscribe(destination);
      resetter.next();
    },
    subject: source
  };
}

export class ResetableSubject<T> {
    _isScalar: boolean;
    source: Observable<any>;
    operator: import("rxjs").Operator<any, T>;

    public observable
    public reset : () => void
    public subject : Subject<T>

    constructor() {
        const {observable, reset, subject} = resettable(() => new ReplaySubject<T>());
        this.observable = observable
        this.reset = reset
        this.subject  = subject
    }
    
}