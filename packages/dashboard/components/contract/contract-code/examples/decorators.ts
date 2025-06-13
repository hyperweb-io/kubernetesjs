import { Instantiate } from `~hyperweb/std`

// Instantiate decorator is binding-declaration. It assigns a method to be defined under a specific symbol, 
// which will be used by the SDK binding to recognize that it serves a special role. 
// For example, the `Instantiate` symbol from `~hyperweb/std` is used by the binding to recognize the instantiation method.
function instantiate() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    // Instantiate is the symbol defined and injected by the SDK.
    // when @instantiate decorator is used, it assigns the method to the contract with Instantiate.
    // The SDK will recognize the instantiate method with this symbol.
    Object.defineProperty(target, Instantiate {
      value: descriptor.value,
      writable: true,
      configurable: true,
    });

    // Delete the original method so it cannot be accessed in a malicious way
    delete target[key];
  };
}

//In this way, we can define symbol-property methods for such as IBC handler, token transfer hook, governance migration, etc.

// The other family of decorators is accessibility modifier. This includes adminOnly, ownerOnly, etc. See issue #61.
function onlyOwner<T>(ownerAccessor: () => Address) {
  return function (
    target: T,
    key: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const sender = this.sender()
      const owner = ownerAccessor.call(this);

      if (caller !== owner) {
        throw new Error(`Access denied: Sender(${sender}) is not the owner(${owner}).`);
      }

      // Call the original method if the check passes
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
// which could be used as
export default class Contract extends BaseContract {
  owner: Address,

  onlyOwner(() => this.owner)
  public ownerOnlyFunction() {}
}