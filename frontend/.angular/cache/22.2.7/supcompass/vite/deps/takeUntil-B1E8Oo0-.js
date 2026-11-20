import { Da as noop, Sa as operate, xa as createOperatorSubscriber } from "./_resource-chunk-Dpvt7irD.js";
import { t as innerFrom } from "./innerFrom-K6fOLYIA.js";
// node_modules/rxjs/dist/esm5/internal/operators/takeUntil.js
function takeUntil(notifier) {
	return operate(function(source, subscriber) {
		innerFrom(notifier).subscribe(createOperatorSubscriber(subscriber, function() {
			return subscriber.complete();
		}, noop));
		!subscriber.closed && source.subscribe(subscriber);
	});
}
export { takeUntil as t };
