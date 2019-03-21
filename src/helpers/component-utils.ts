/**
 * Common method that initiate event handler defined by on{eventName} attribute and then trigger simple custom event on the element
 * @param target - target HTMLElement
 * @param eventName - name of event
 * @param args - arguments for custom event
 */
export function triggerComponentEvent(target: HTMLElement, eventName: string, args: any) {
    const eventHandlerName = 'on' + eventName;
    const eventHandlerAttr = target.getAttribute(eventHandlerName);
    if (eventHandlerAttr) {
        try {
            if (typeof (target as any)[eventHandlerName] !== 'function') {
                (target as any)[eventHandlerName] = function () { eval(eventHandlerAttr); };
            }
            (target as any)[eventHandlerName].apply(target, args);
        } catch (e) {
            console.log(`Error executing ${target.tagName} ${eventName} hook function.\n ${e}`);
        }
    }
    target.dispatchEvent(new CustomEvent(eventName, args)); // TODO: check args usage
}
