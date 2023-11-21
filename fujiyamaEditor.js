/*
base ViewEditor
*/
import "//hashsan.github.io/fujiyama/fujiyama.js"

const fn={}
fn.rkana=(l=8)=>{
 var c = "bcdfghjklmnpqrstvwxyz",cl=c.length,b ="aiueo",bl=b.length,r=""
 ,mf=Math.floor,mr=Math.random
 ;for(var i=0;i<l;i++) r+=(i%2)? b[mf(mr()*bl)]:c[mf(mr()*cl)].toUpperCase();
 return r;
}
fn.q=d=>document.querySelector(d)
fn.as2=function(me,p){p.parentNode.insertBefore(me,p.nextElementSibling/*nextSibling*/);return me}


function make(id){
  
  const temp=`
  <section id="${id}" class="frame">
    <div class="view"></div>
    <div class="edit"
         contenteditable="plaintext-only"
         ></div>
    <label class="btn">e
      <input name="edit" type="radio">
    </label>
  </section>  
  `
  ;
  const el = document.createElement('div')
  el.innerHTML= temp;
  const frame = el.children[0];
  const view = frame.children[0]
  const ed   = frame.children[1]
  const btn  = frame.children[2]
  const radio = btn.children[0]
  ;
  return {frame,view,ed,btn,radio}  
}


function textinfo(data){
  const isimg=(line)=>{
    const re= /\.(jpeg|jpg|png|bmp|gif|webp|avif)$/i
    return re.test(line)
  }
  const islink=(line)=>{
    const re=/^http/
    return (re.test(line) && !isimg(line))
  }
  
  var text = data||''
  const ary = text.split('\n')

  let imgs = ary.filter(isimg)
  let links = ary.filter(islink)

  let ret={
    title:ary.at(0)||'',
    len:text.length,
    line:ary.length,
    link:links.at(0)||'',
    links,
    img:imgs.at(0)||'',
    imgs,
  }
  return ret
}


class ViewEditor{
  cls ='ViewEditor'
  id = fn.rkana(8)
  
  constructor(data){
    const {frame,view,ed,btn,radio} = make(this.id)
    this.frame= frame
    this.frame.classList.add(this.cls)
    this.view = view    
    this.ed = ed
    this.btn = btn
    this.radio = radio
    
    this.setData(data)
    this.init()
  }
  getData=()=>{
    return this.ed.innerText
  }
  setData=(data)=>{
    this.ed.innerHTML = data
    this.update()
  }
  async init(){
    const {Press} = await import('//hashsan.github.io/EditorFrame/EditorFrame.js');
    this.press = new Press(this.ed)
     .press('ctrl+Enter',this.add.bind(this))
     .press('ctrl+Backspace',this.remove.bind(this))
     .press('ctrl+v',this.update.bind(this),200)
     .press('Enter',this.update.bind(this))    
        
  }
  add(){
    fn.as2(new ViewEditor('＃新規').frame,this.frame)
  }
  isRemove=()=>{
    if(fn.q('.'+this.cls).id === this.id){
      return false
    }
    if(this.getData()){
      return false
    }
    return true;
  }
  remove(){
    if(!this.isRemove()){
      return
    }      
    this.frame.remove()
  }
  update(){
    const data = this.getData()
    Object.assign ( this.ed.dataset, textinfo(data) )
    this.view.innerHTML = data
  }
}




export class fujiyamaEditor extends ViewEditor{
  constructor(data){
    super(data);    
  }
  add(){
    fn.as2(new fujiyamaEditor('＃新規').frame,this.frame)
  }  
  update(){
    const data = this.getData()
    Object.assign ( this.ed.dataset, textinfo(data) )   
    this.view.innerHTML = fujiyama(data)
    this.view.lastElementChild.scrollIntoView()
  }  
}


/* usage
var el = new fujiyamaEditor('＃新')
fn.q('.pbox').append(el.frame)
*/
