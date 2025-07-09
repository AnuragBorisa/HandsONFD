
class Observable{
    constructor(subscibeFn){
        this.subscibeFn = subscibeFn
    }

    subscribe(next,err,complete){
        const observer = {
            next: typeof next === 'function' ? next : ()=> {},
            err : typeof err === 'function' ? err : () => {},
            complete : typeof complete === 'function' ? complete : ()=>{}
        }
        let cleanup = this.subscibeFn(observer)
        return {
            unsubscribe : ()=>{
                if(cleanup){
                    cleanup()
                }
            }
        }
    }
}

Observable.prototype.map = function(fn){
    return new Observable((observer)=>{
        const subscription = this.subscribe(
            (value)=>{
                let mapped 
                try {
                    mapped = fn(value)
                    observer.next(mapped)
                }
                catch(err){
                    observer.err(err)
                }
            },
            (err)=>{
                observer.err(err)
            },
            ()=>{
                observer.complete()
            }
        )
        return () => {subscription.unsubscribe()}
    })
}

Observable.prototype.filter = function(pred) {
    return new Observable(observer => {
      const sub = this.subscribe(
        value => {
          try {
            if (pred(value)) observer.next(value);
          } catch (err) {
            observer.error(err);
          }
        },
        err  => observer.error(err),
        ()   => observer.complete()
      );
      return () => sub.unsubscribe();
    });
  };

  
  Observable.prototype.merge = function(other$) {
    return new Observable(observer => {
      const sub1 = this.subscribe(
        v => observer.next(v),
        e => observer.error(e),
        () => {}    // wait for other before complete
      );
      const sub2 = other$.subscribe(
        v => observer.next(v),
        e => observer.error(e),
        () => observer.complete()
      );
      return () => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      };
    });
  };

  Observable.prototype.takeUntil = function(notify$) {
    return new Observable(observer => {
      // main source
      const mainSub = this.subscribe(
        v => observer.next(v),
        e => observer.error(e),
        () => observer.complete()
      );
      // notifier
      const noteSub = notify$.subscribe(
        () => {
          observer.complete();     // stop main
          mainSub.unsubscribe();
          noteSub.unsubscribe();
        },
        err => observer.error(err)
      );
      return () => {
        mainSub.unsubscribe();
        noteSub.unsubscribe();
      };
    });
  };

  Observable.fromEvent = function(element, eventName) {
    return new Observable(observer => {
      const handler = e => observer.next(e);
      element.addEventListener(eventName, handler);
      return () => element.removeEventListener(eventName, handler);
    });
  };
  

const numbers$ = new Observable(o => {
    [1,2,3].forEach(n => o.next(n));
    o.complete();
  });
  
  const doubled$ = numbers$.map(x => x * 2);
  
 
  doubled$.subscribe(
    v => console.log('doubled:', v),
    e => console.error('got error', e),
    () => console.log('done doubling')
  );