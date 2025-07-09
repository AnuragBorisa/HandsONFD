
class LRUcache{
     constructor({maxSize=100}={}){
       this.maxSize = maxSize
       this.map = new Map()
       this.head = {prev:null,next:null}
       this.tail = {prev:null,next:null}
       this.head.next = this.tail
       this.tail.prev = this.head
     }

     _addNode(node){
        node.prev = this.head
        node.next = this.head.next
        this.head.next.prev = node
        this.head.next = node
     }
     _removeNode(node){
       node.prev.next = node.next
       node.next.prev = node.prev
       node.prev = null;
       node.next = null;
     }
     _moveToHead(node){
        this._removeNode(node)
        this._addNode(node)
     }
     _evictTail(){
      const node = this.tail.prev
      if(node === this.head) return
      this._removeNode(node)
      this.map.delete(node.key)
     }

     get(key){
       let node = this.map.get(key)
        if(!node) return undefined
        if(node.expiryDate <= Date.now()){
             this._removeNode(node)
             this.map.delete(node.key)
             return undefined
        }
        else{
            this._moveToHead(node)
            return node.value
        }
     }

     set(key,value,ttl){
       let node = this.map.get(key)
       const now = Date.now()
       const expiryDate = ttl ? now+ttl : Infinity
        if(node){
            node.value = value
            node.expiryDate = expiryDate
            this._moveToHead(node)
        }
        else{
            
            node = {key:key,value:value,expiryDate:expiryDate,prev:null,next:null}
            this.map.set(key,node)
            this._addNode(node)
        }
       
        if(this.map.size > this.maxSize ){
            this._evictTail()
        }
     }

     delete(key){
        const node = this.map.get(key)
        if(!node) return false
        this._removeNode(node)
        this.map.delete(key)
        return true
     }
     size(){
        return this.map.size;
     }
     

}
console.log()