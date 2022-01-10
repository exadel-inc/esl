export function debug(logMembers: any = {constructor: true, accessor: true, method: true}) {

  return <T extends ClassDecorator> (target: any, name?: string, descriptor?: TypedPropertyDescriptor<T>) => {
    if (descriptor) {
      throw new TypeError('Only classes can be decorated via @debug');
    }

    let newTarget = '' as any;
    Object.getOwnPropertyNames(target.prototype).forEach((propertyName: string) => {

      const propertyDescriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName) as any;
      const propertyValue = propertyDescriptor.value;

      if (logMembers?.accessor && propertyDescriptor.get && propertyDescriptor.configurable && !propertyValue) {
        newTarget = logGetter(target, newTarget, propertyName, propertyDescriptor);
      }

      if (logMembers?.accessor && propertyDescriptor.set && propertyDescriptor.configurable && !propertyValue) {
        newTarget = logSetter(target, newTarget, propertyName, propertyDescriptor);
      }

      if (typeof propertyValue !== 'function') {
        return;
      }

      if (logMembers?.constructor && propertyName === 'constructor') {
        newTarget = logConstructor(target, propertyName);
      } else if (logMembers?.method && typeof propertyValue === 'function') {
        newTarget.prototype[propertyName] = logFunction(target, propertyName, propertyValue);
      }
    });

    return newTarget;
  };
}

const logArguments = (passedArgs: any) => {
  if (passedArgs) {
    console.log('arguments:', passedArgs);
  }
};

const logReturn = (returnArgs: any) => {
  if (returnArgs) {
    console.log('returns:', returnArgs);
  }
};

const logConstructor = (target: any, propertyName: string) => {
  return class extends target {
    constructor(...passedArgs: any[]) {
      const now = performance.now();
      super(passedArgs);

      console.log(`\n[${target.name}][${propertyName}] Execution time: ${performance.now() - now}ms`);
      logArguments(passedArgs);
    }
  };
};

const logFunction = (target: any, propertyName: string, propertyValue: any, propertType: string = 'Function') => {
  return function (...passedArgs: any[]) {
    const now = performance.now();
    const returnArgs = propertyValue.apply(this, passedArgs);

    console.log(`\n[${target.name}][${propertType}][${propertyName}] Execution time: ${performance.now() - now}ms`);
    logArguments(passedArgs);
    logReturn(returnArgs);

    return returnArgs;
  };
};

const logSetter = (target: any, newTarget: any, propertyName: string, propertyDescriptor: any) => {
  const setFunction = propertyDescriptor.set;
  propertyDescriptor.set = logFunction(target, propertyName, setFunction, 'Setter');
  Object.defineProperty(newTarget.prototype, propertyName, propertyDescriptor);

  return newTarget;
};

const logGetter = (target: any, newTarget: any, propertyName: string, propertyDescriptor: any) => {
  const getFunction = propertyDescriptor.get;
  propertyDescriptor.get = logFunction(target, propertyName, getFunction, 'Getter');
  Object.defineProperty(newTarget.prototype, propertyName, propertyDescriptor);

  return newTarget;
};
