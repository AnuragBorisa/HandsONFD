class EventEmitter{
      constructor(parent = null){
        this.parent = parent
        this.listeners = new Map()
      }

      on(event,fn){
         if(!this.listeners.has(event)){
            this.listeners.set(event,[])
         }
         this.listeners.get(event).push(fn)
      }
      off(event,fn){
         const arr = this.listeners.get(event)
         if(!arr){
            return 
         }
         this.listeners.set(
            event,
            arr.filter((l)=>l!==fn)
         )

      }
      once(event,fn){
        const wrapper = (...args)=>{
             this.off(event,wrapper)
             fn(...args)
        }
        this.on(event,wrapper)
      }
      emit(event,...args){
          const extact = this.listeners.get(event)
          if(extact){
            for (const fn of Array.from(extact)){
                fn(...args)
            }
          }
          const wild = this.listeners.get('*')
            if(wild){
               for(const fn of Array.from(wild)){
                fn(...args)
               }
            }
          if(this.parent){
            this.parent.emit(event,...args)
          }
      }

}