/*
speedup fujiyama
*/

class Mattya{
  ma = [];
  re = new RegExp('','g')
  script = []
  constructor(){
  }
  add=(re,calc)=>{
    this.ma.push({re,calc})

    const re_str=this.ma.map(d=>d.re.toString())
    .map(d=>!(d.at(-1)==='/')?d.slice(1,-2):d.slice(1,-1))
    .map(d=>d.replace(/\\/g,'\\'))
    .map(d=>`(${d})`)
    .join('|')

    this.re = new RegExp(re_str,'g')

    return this
  }
  mattya=(temp,delay)=>{
    this.scriptClear()
    const re = this.getRe()
    const ma = this.getMa()
    //console.log(re)
    const html = temp.replace(re,(...args)=>{
      //console.log(args)
      const line = args.at(0)
      const ary = args.slice(1,-2)
      //console.log(ary)
      const i = ary.findIndex(d=>d)
      //console.log(i)
      //return line
      if(i===-1){
        //throw new Error('findIndex not found')
        //console.log('findIndex not found',line,ary,args.at(-2))

        return '<p class="notfound">'+ line +'</p>'
      }
      return ma[i].calc(line)
    })
    
    this.scriptDone(delay)
    return html;
  }
  getMa(){
    return this.ma
  }

  getRe(){
    return this.re
  }
  
  scriptDone(delay){
    
    setTimeout(()=>{
      for(const d of this.script){
        eval(';'+d+';')        
      }      
    },delay||200)
    
  }
  scriptClear(){
    this.script.length=0
  }
  scriptAdd=(code)=>{
    this.script.push(code)
  }
}


///////////////////////////


var ma = new Mattya()

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
      //'\n': '\\n', ///
    }[match]
  });
}

//code
ma.add(/-{3,}\n[\s\S]+?-{3,}\n/,(line)=>{
  const br = line.slice(-1)
  const str = escape( line.slice(0,-1) )
  return `<p class="code">${str}</p>${br}`
})

ma.add(/-{3,}\n[\s\S]+?-{3,}$/,(line)=>{
  const str = escape( line )
  return `<p class="code">${str}</p>`  
})


//script

ma.add(/<script[\s\S]*?>[\s\S]*?<\/script>(?:\n|$)/,(line)=>{
  const src = capturescript(line)
  ma.scriptAdd(src)
  return line
})

function capturescript(line){
  const re = /<script[\s\S]*?>([\s\S]*?)<\/script>(?:\n|$)/
  const m = line.match(re)
  return m.at(1)
}


//h1
ma.add(/＃.*\n/,(line)=>{
  const br = line.slice(-1)
  const str = line.slice(0,-1)  
  return `<h1>${str}</h1>${br}` 
})

ma.add(/＃.*$/,(line)=>{
  return `<h1>${line}</h1>` 
})

//mark
ma.add(/「.*(?:？|！)」(?:\n|$)/,(line)=>{
  return `<mark>${line}</mark>`
})


//img
ma.add(/.+\.(?:jpeg|jpg|png|bmp|gif|webp|avif)(?:\n|$)/,(line)=>{  
  return `<img class="para" src="${line.trim()}">` //para  
})


function makeatlink(line){
  const re=/^(＠.+)[（\(](.+)[)\）]/
  const m = line.match(re)
  const name = m.at(1)
  const url = m.at(2)
  return {name,url}
  //const tag =`<a href="${url}">${name}</a>`
  //return tag
}

//link
ma.add(/(?:＠.+)[（\(](?:.+)[)\）](?:\n|$)/,(line)=>{

  const {name,url} = makeatlink(line.trim())
  return `<p><a href="${url}">${name}</a></p>`

})

//p kaigyo
ma.add(/.*\n/,(line)=>{
  const br = line.slice(-1)
  const str = line.slice(0,-1)
  return `<p>${str||'<br>'}</p>${br}` 
})

ma.add(/.*$/,(line)=>{
  return `<p>${line||'<br>'}</p>` 
})


export const fujiyama = ma.mattya
if(window) window.fujiyama = ma.mattya
