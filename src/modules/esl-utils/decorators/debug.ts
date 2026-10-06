/** Decorator "debug" allows to temporairly decorate class with logger */
export function debug(logMembers: any = {constructor: true, accessor: true, method: true}): ClassDecorator {

  return <T extends ClassDecorator> (target: any, name?: string, descriptor?: TypedPropertyDescriptor<T>): any => {
    // Validation check
    if (descriptor) {
      throw new TypeError('Only classes can be decorated via @debug');
    }

    let newTarget = '' as any;
    Object.getOwnPropertyNames(target.prototype).forEach((propertyName: string) => {

      // Original member of a class
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

/** Log function for passed arguments */
const logArguments = (passedArgs: any): void => {
  if (passedArgs) {
    console.log('arguments:', passedArgs);
  }
};

/** Log function return arguments */
const logReturn = (returnArgs: any): void => {
  if (returnArgs) {
    console.log('returns:', returnArgs);
  }
};

/** Log function for class constructor */
const logConstructor = (target: any, propertyName: string): any => {
  return class extends target {
    constructor(...passedArgs: any[]) {
      const now = performance.now();
      super(passedArgs);

      console.log(`\n[${target.name}][${propertyName}] Execution time: ${performance.now() - now}ms`);
      logArguments(passedArgs);
    }
  };
};

/** Log function for passed function */
const logFunction = (target: any, propertyName: string, propertyValue: any, propertyType: string = 'Function'): any => {
  return function (...passedArgs: any[]) {
    const now = performance.now();
    const returnArgs = propertyValue.apply(this, passedArgs);

    console.log(`\n[${target.name}][${propertyType}][${propertyName}] Execution time: ${performance.now() - now}ms`);
    logArguments(passedArgs);
    logReturn(returnArgs);

    return returnArgs;
  };
};

/** Log function for set accessor */
const logSetter = (target: any, newTarget: any, propertyName: string, propertyDescriptor: TypedPropertyDescriptor<ClassDecorator>): any => {
  const setFunction = propertyDescriptor.set;
  propertyDescriptor.set = logFunction(target, propertyName, setFunction, 'Setter');
  Object.defineProperty(newTarget.prototype, propertyName, propertyDescriptor);

  return newTarget;
};

/** Log function for get accessor */
const logGetter = (target: any, newTarget: any, propertyName: string, propertyDescriptor: TypedPropertyDescriptor<ClassDecorator>): any => {
  const getFunction = propertyDescriptor.get;
  propertyDescriptor.get = logFunction(target, propertyName, getFunction, 'Getter');
  Object.defineProperty(newTarget.prototype, propertyName, propertyDescriptor);

  return newTarget;
};
