
//v2.0 image check to simple
function isimg(line){
 return /\.(jpeg|jpg|png|bmp|gif|webp|avif)$/i.test(line)  
}
function isurl(line){
  const re=/^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|^#.+\w/gi
  return re.test(line)
}
function isaturl(line){
  const re=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|#.+\w|#/gi
  return re.test(line)
}
function getaturl(line){
  const re=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|#.+\w|#/gi  
  return isaturl(line)?line.match(re).at(0):''
}

/*
function isurl2(funnyline){
  const re=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|#.+\w/gi
  return re.test(funnyline)  
}
function islink(line){
  const re=/「＠/
  return ( isurl2(line) && re.test(line) )
}

function geturl(str){
  var re=/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|#.+\w/gi
  if(!re.test(str))return ''
  var ret=str.match(re).join('')
  //console.log(ret)
  return ret;
}

*/

function ismark(line){
  const re=/？」|！」/
  return re.test(line)
}
//pu(ismark('「あいうえを」'))
//pu(ismark('「あいうえを！！！」'))
//pu(ismark('「あいうえを！！？」'))

function iskaigyo(line){
  return line===''
}

function getkagikakko(str){
  var re=/「.+?」/g
  var ary= str.match(re)
  //console.log(ary)  
  return ary||[]
}

//////////////////////////
//////////////////////////
//////////////////////////
function fujiyama(temp){
  const cr='\n'
  var html=temp.trim()
  //v3.0 replace_escape --- strings... ---
  //v3.1 escape is first
  html=replace_escape(html) 
 
  html=replace_head(html)
  //console.log('replace_head',html)
  html=replace_kakko(html)
  //pu(html)
  //console.log('replace_kakko',html)  
  return html     
}
//////////////////////////
//////////////////////////
//////////////////////////

function replace_head(html){
  const cr='\n'
  return html.split(cr)
    .map(d=>{
    if(d.at(0)==='＃'){
      return `<h1>${d}</h1>`
    }
    if(d.at(0)==='＠'){
      return makeatlink(d)
      //var url= d.slice(1)
      //return `<a href="${url}">${d}</a>`
    }
      //v2.0
    if(isimg(d)){
      //class para is margin
      return `<img class="para" src="${d}">`
    }
    if(iskaigyo(d)){      
      return `<p><!---${d}---><br></p>`      
    }
    return `<p>${d}</p>`
  }).map(d=>{
    //pu(d)
    return d
  }).join(cr) 
}

function replace_kakko(temp){
  var html = temp  
  const ary=getkagikakko(html)
  ary.forEach(d=>{
    if(ismark(d)){
      html=html.replace(d,`<mark>${d}</mark>`)
      return
    }
    /* 文中リンクは廃止。
    if(islink(d)){
      const url = geturl(d)
      //pu(url)
      const name = d.replace(url,'')
       .slice(1,-1) //cut 「と」
      //pu(name)
      html=html.replace(d,`<a href="${url}">${name}</a>`)
    }*/
    return     
  })  
  return html
}

function makeatlink(d){
  //console.log(d,'>>>',isaturl(d),getaturl(d))   
  if(!isaturl(d))return `<p>${d}</p>`
  var url = getaturl(d)
  var name = d.replace(url,'')
  var html =`<a href="${url}">${d}</a>`
  if(name==='＠')return html
  ;
  html =`<a href="${url}">${name}</a>`
  //console.log(d,url,name)
  return html;
}

//v3.0 
function replace_escape(temp){
  var html = temp
  const re_esc=/-{3,}((?:\s+.*?)*?(?:\s+.*?))-{3,}|-{3,}(.*?)-{3,}/g
  const re_single = /-{3,}(.*?)-{3,}/
  const re_cr=/\n/
  if(!re_esc.test(html))return html
  
  temp.match(re_esc).forEach(d=>{    
    if(re_cr.test(d)){
      html=html.replace(d,escape_html(d))
      return
    }
    var dd = d.match(re_single).at(1)
    html=html.replace(d,escape_html(dd) )
  })

  return html
}

function escape_html (string) {
  if(typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function(match) {
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

if(window) window.fujiyama = fujiyama
