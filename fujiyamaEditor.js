import "//hashsan.github.io/fujiyama/fujiyama.js"
import "//hashsan.github.io/use/use.js"



export class fujiyamaEditor{
  id = fn.rkana(12)
  frame
  view
  edit
  active = 'is-active';
  cls = 'frame'

constructor(data,cls){
  this.cls = cls || this.cls
  this.init(data)
}

init(data){
  const {render,active,editable,keycommand} = this    
  const {frame,view,edit} = this.make()
  this.frame = frame
  this.view = view
  this.edit = edit
  this.setData(data)
  this.render();
  view.onclick=editable.bind(this)
  edit.onblur=render.bind(this)
  edit.onkeydown=keycommand.bind(this)
}
getData=()=>{
  const {edit} = this
  return edit.innerText
}
setData(data){
  const {edit} = this
  edit.innerHTML =data||'＃新'  //v1
}
setTitle(){
  const {edit} = this
  const title =this.getData().trim().split('\n').at(0)
  edit.dataset.title = title
}
isimgtag(el){
  if(!el){
    return false
  }
  return el.tagName.toLowerCase() === 'img'
}
render(){
  const {edit,view,active} = this
  this.setTitle()  
  edit.classList.remove(active)
  view.classList.add(active)
  view.innerHTML = fujiyama(edit.innerText)
}
editable(e){
  const {isimgtag,view,edit,active} = this
  if(isimgtag(e.target)){
    return
  }
  view.classList.remove(active)
  edit.classList.add(active)
  edit.focus();
  fn.carettail(edit)
}

isempty(){
  const edit= this.edit
  return edit.innerText ===''
}
iskeep(){
  const edit = this.edit
  return fn.q('.edit') === edit
}
remove(){
  const {frame} = this
  if(this.iskeep()){
    return
  }    
  if(!this.isempty()){
    return
  }
  frame.remove()
}
keycommand(e){
  if(e.ctrlKey && e.key === 'Enter'){
    this.add()
    return;
  }
  if(e.ctrlKey && e.key === 'Backspace'){
    this.remove()
    return;
  }
}
add(){
  const {frame,cls} = this
  const data='＃新'
  const ced = new fujiyamaEditor(data,cls)
  fn.as2(ced.frame,frame)

}
make(){
  const {active,id,cls} = this
  const temp=`
    <div id="${id}" class="wrap ${cls}">
      <div class="view ${active}"></div>
      <div class="edit" 
           contenteditable="plaintext-only">＃新</div>   
    </div>    
      `;
  const el = document.createElement('div')
  el.innerHTML=temp
  const frame = el.children[0];
  const view = frame.children[0];
  const edit = frame.children[1];
  return {frame,view,edit}
}

}
