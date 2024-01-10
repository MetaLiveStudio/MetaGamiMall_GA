export function notNull(obj:any){
  return obj !== undefined && obj !== null
}
export function isNull(obj:any){
  return obj === undefined || obj === null
}

/**
 * FIXME make synchronize https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
 * https://www.npmjs.com/package/mutexify
 *
 * @param name - name of the wrapped promise - for debugging
 * @param proc - promise to be synchronized, prevent concurrent execution
 * @returns
 */
export const preventConcurrentExecution = <T>(name: string, proc: () => PromiseLike<T>) => {
  let inFlight: Promise<T> | false = false;

  return () => {
    if (!inFlight) {
      inFlight = (async () => {
        try {
          //console.log("preventConcurrentExecution",name," start flight")
          return await proc();
        } finally {
          //console.log("preventConcurrentExecution",name,"  not in flight")
          inFlight = false;
        }
      })();
    } else {
      //log("preventConcurrentExecution",name," not in flight return same as before")
    }
    return inFlight;
  };
};