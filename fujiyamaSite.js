var fn={}
fn.q=d=>document.querySelector(d)

/////////////////////////////////
/////////////////////////////////
/*
v1 create
v2 saveMissBlock
v3 loading with bar moving
v4 saveMissBlock retry
v5 nav timing input
v6 infinity the kaigyou
v6.1 trigger miss repair
v7 menu to nav, top and bottom
*/


export class fujiyamaSite{
  target =fn.q('article')
  bar
  constructor(){

    this.init()
  }

  async init(){

    this.api = await getApi()
       
    const {Bar} = await import('https://hashsan.github.io/Bar/Bar.js?v=2')
    var bar = new Bar()
    bar.bar.style.position='fixed';
    this.bar = bar;

    //v3
    bar.go(50)
    await this.load()     
    bar.go(100)
    
    
    //console.log(this.bar)
    const {Press} = await import( "//hashsan.github.io/EditorFrame/EditorFrame.js")

    new Press(document.documentElement)
      .press('ctrl+s',(e)=>{
      e.preventDefault()
      bar.go(30)     
      this.save().then(d=>bar.go(100))
    })
      //.press('Enter',(e)=>this.makeNav()) //v5
      .press('*',(e)=>{
        this.makeNav() //v5
        bar.go(10)
      },500)

    //v2
    this.saveMissBlock()    

    this.makeNav()
  }
  async makeNav(){
    const html = this.getEditors()
    .map(d=>`<a href="#${d.parentElement.id}">${d.dataset.title}</a>`)
    .join('\n')
    //fn.q('footer').innerHTML = html;  //v7
    fn.q('nav.top').innerHTML = html;
    fn.q('nav.bottom').innerHTML = html;
  }
  getEditors(){
    return  Array.from(this.target.querySelectorAll('.edit'))    
  }
  getData=()=>{    
    return this.getEditors().map(d=>d.innerText).join('\n')
  }

  async load(){
    const {fujiyamaEditor} = await import("//hashsan.github.io/fujiyama/fujiyamaEditor.js?v=3");    
    
    var data = await this.api.load()||'＃新規ファイル'
    for(let d of lip(data)){
      const ya = new fujiyamaEditor(d)
      fn.q('article').append(ya.frame)
    }
    //

  }
  save(){
    return this.api.save(this.getData())
  }
  saveMissBlock(){
    const bar = this.bar
    window.onbeforeunload = (e) =>{ //v4
      if(bar.getValue() === 0){
        return
      }
      e.returnValue = "行った変更が保存されません。よろしいですか？";
    }  
  }  
  
//
}

function lip(data){
  const br='\n'
  let dat =''
  let ary=[]
  for(const line of data.split('\n')){
    if(/^＃/.test(line) && dat){
      //ary.push(dat)
      ary.push( dat.trim() )  //v6 add trim()      
      dat=''
    }
    dat += line + br
  }
  if(dat){
    ary.push( dat.trim() )  //v6 add trim()
  }
  return ary
}    

function clearurl(url){  
  const {origin,pathname} = new URL(url)
  return origin + pathname  
}
function getGhp(){
  var d = "ghp_"
  /**/
  + "9ah8c3yojjO"
  + "EsWBOP6CSiMAMj"
  + "mcDcF1UGrhv"    
  return d;
}
function isGithub(url){
  return /\.github\.io/.test(url)
}
function getUrl(){
  const def ='https://hashsan.github.io/outputs/cache.html'
  var u = clearurl(location.href)
  u = isGithub(u)?u:def 
  u=u.replace(/.html$/,'.txt')
  return u
}

async function getApi(){  
  const {Octo} = await import('https://hashsan.github.io/Octo/Octo.js');  
  const url = getUrl()
  const ghp = getGhp()
  const api = new Octo(url,ghp)
  return api;
}

/////////////////////////////////
