export function debug(what: any) {
  return <T extends ClassDecorator> (target: any, name?: string, descriptor?: TypedPropertyDescriptor<T>) => {
    if (descriptor) {
      throw new TypeError('Only classes can be decorated via @debug');
    }

    let newTarget = '' as any;

    Object.getOwnPropertyNames(target.prototype).forEach((propertyName: string) => {

      const propertyDescriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName) as any;
      const propertyValue = propertyDescriptor.value;

      if (what?.accessor && propertyDescriptor.get && !propertyValue) {
        newTarget = logGetter(target, newTarget, propertyName, propertyDescriptor);
      }

      if (what?.accessor && propertyDescriptor.set && !propertyValue) {
        newTarget = logSetter(target, newTarget, propertyName, propertyDescriptor);
      }

      if (typeof propertyValue !== 'function') {
        return;
      }

      if (what?.accessor && propertyName === 'constructor') {
        newTarget = logConstructor(target, propertyName);
      } else if (what?.method && typeof propertyValue === 'function') {
        newTarget.prototype[propertyName] = logFunction(target, propertyName, propertyValue);
      }
    });

    return newTarget;
  };
}

const logConstructor = (target: any, propertyName: string) => {
  return class extends target {
    constructor(...passedArgs: any[]) {
      const now = Date.now();
      super(passedArgs);

      console.log(`\n[${target.name}][${propertyName}] Execution time: ${Date.now() - now}ms`);
      if (passedArgs) {
        console.log('arguments:', passedArgs);
      }
    }
  };
};

const logFunction = (target: any, propertyName: string, propertyValue: any) => {
  return function (...passedArgs: any[]) {
    const now = Date.now();
    const returnArgs = propertyValue.apply(this, passedArgs);

    console.log(`\n[${target.name}][Method][${propertyName}] Execution time: ${Date.now() - now}ms`);
    if (passedArgs) {
      console.log('arguments:', passedArgs);
    }
    if (returnArgs) {
      console.log('returns:', returnArgs);
    }

    return returnArgs;
  };
};

const logSetter = (target: any, newTarget: any, propertyName: string, propertyDescriptor: any) => {
  const setFunction = propertyDescriptor.set;

  propertyDescriptor.set = function (...passedArgs: any[]) {
    const startTime = Date.now();
    const returnArgs = setFunction.apply(this, passedArgs);

    console.log(`\n[${target.name}][Acessor][set][${propertyName}] Execution time: ${Date.now() - startTime}ms`);
    if (passedArgs) {
      console.log('arguments:', passedArgs);
    }

    return returnArgs;
  };

  Object.defineProperty(newTarget.prototype, propertyName, propertyDescriptor);

  return newTarget;
};

const logGetter = (target: any, newTarget: any, propertyName: string, propertyDescriptor: any) => {
  const getFunction = propertyDescriptor.get;
  propertyDescriptor.configurable = true;

  propertyDescriptor.get = function (...passedArgs: any[]) {
    const startTime = Date.now();
    const returnArgs = getFunction.apply(this, passedArgs);

    console.log(`\n[${target.name}][Acessor][get][${propertyName}] Execution time: ${Date.now() - startTime}ms`);
    if (passedArgs) {
      console.log('arguments:', passedArgs);
    }
    if (returnArgs) {
      console.log('returns:', returnArgs);
    }

    return returnArgs;
  };

  Object.defineProperty(newTarget.prototype, propertyName, propertyDescriptor);

  return newTarget;
};
