/*
v1 fujiyama reborn
v2.0 bugfix kaigyou <br>
v2.1 bugfix img .para
v3 bugfix kaigyou in .code
v4 script done
v4.1 dom.id head do not number
*/

function iscode(line){
  const re=/^-{3,}$/
  return re.test(line)
}
function iskaigyo(line){
  return line === ''
}
function ismark(line){
  const re=/(「.+?(?:？|！)」)/  
  //const re=/？」|！」/
  return re.test(line)
}
function ishead(line){
  const re=/^＃.+$/
  return re.test(line)
}
function isimg(line){
  const re= /\.(jpeg|jpg|png|bmp|gif|webp|avif)$/i
  return re.test(line)
}
/*
function islink(line){
  const re=/＠[-a-zA-Z0-9@:%_\+.~#?&//=]+$/
  return re.test(line)
}
*/
function islink(line){
  const re=/^(＠.+)[（\(](.+)[)\）]/
  return re.test(line)
}
function islinkRag(line){
  const re=/(＠.*)([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|#.+\w|#)/i
  return re.test(line)
  
}
//v4
function isscript(line){
  const re=/^<script/
  return re.test(line)
}

function makeatlinkRag(line){
  const re=/(＠.*)([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|#.+\w|#)/i
  
  const m = line.match(re)
  const name = m.at(1)
  const url = m.at(2)
  return {name,url}
}

function makeatlink(line){
  const re=/^(＠.+)[（\(](.+)[)\）]/
  const m = line.match(re)
  const name = m.at(1)
  const url = m.at(2)
  return {name,url}
  //const tag =`<a href="${url}">${name}</a>`
  //return tag
}

function makemark(line){
  const re=/(「.+?(?:？|！)」)/
  const ret = line.replace(re,"<mark>$1</mark>")
  return ret
  //return `<p>${line.replace(re,"<mark>$1</mark>")}</p>`
}

function escape(line){
  if(typeof line !== 'string') {
    return line;
  }

  return line.replace(/[&'`"<>]/g, function(match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    }[match]
  });
}

//v4
function rhash(){
  //do not number v4.1
  return  'i'+Math.random().toString(36).slice(-8)
}

function scriptCapture(html,obj){
  //obj is ref
  const re_script=/<script[\s\S]*?>[\s\S]+?<\/script>/g

  html = html.replace(re_script,(d)=>{  
    const id = rhash()
    const el = document.createElement('div')
    el.innerHTML = d;
    el.id = id    
    obj[id] = el.children[0];
    return `<script id="${id}"></script>`
    //console.log(d)
  })

  return html
}

function scriptDone(obj,time){
  const done=()=>{
    Object.keys(obj).map(id=>{
      document.querySelector('#'+id).replaceWith(obj[id]);
      eval(';'+obj[id].innerHTML+';')
    })    
  }
  setTimeout(done,time||200)
}


function fujiyama(temp,scriptdelay){

  var obj = {}                   //v4
  temp = scriptCapture(temp,obj) //v4
  
  const br ='\n'  
  const ary = _lip(temp)
  //console.log(ary)
  const tagary = _walk(ary)
  //console.log(tagary)
  const html = tagary.join(br)
  //console.log(html)

  scriptDone(obj,scriptdelay)  //v4
  
  return html
}


function _lip(temp){
  const br = /\r\n|\n|\r/g;
  const ary=temp.trimStart().split(br)  
  return ary;
}

function _walk(ary){
  const cls ='code'
  var coding = false
  const iscoding =()=>coding // living
  const res=ary.map(line=>{

    if(iscode(line)){
      coding =!coding
      return `<p>---</p>`
    }

    if(iscoding()){
      if(iskaigyo(line)){
        //bug kaigyo erase
        return `<p class="${cls}"><br></p>`  //<br>        
      }
      return `<p class="${cls}">${escape(line)}</p>`
    }

    if(iskaigyo(line)){
      return `<p><!--kaigyo--><br></p>`  //<br>
    }

    if(ishead(line)){
      return `<h1>${line}</h1>`
    }

    if(isimg(line)){
      return `<img class="para" src="${line}">` //para
    }

    if(islink(line)){
      const {name,url} = makeatlink(line)
      return `<a href="${url}">${name}</a>`      
    }
    
    if(islinkRag(line)){
      const {name,url} = makeatlinkRag(line)
      return `<a href="${url}">${name}</a>`      
    }
    
    if(ismark(line)){
      const marked = makemark(line)
      return `<p>${marked}</p>`
    }

    //v4
    if(isscript(line)){
      return line
    }

    return `<p>${line}</p>`
  });

  return res
}

if(window) window.fujiyama = fujiyama
