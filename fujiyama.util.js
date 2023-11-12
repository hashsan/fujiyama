/*
v1 画像をクリックすると背景に１００％投影。
v2 dissmiss, back to the default.
*/
;(function imagefull(){
  const delay = 5*1000
  const isimg =el=>/img/i.test(el.tagName)
  const style =document.createElement('style')
  
  
  window.addEventListener('click',(e)=>{
    const el = e.target
    if(!isimg(el)){
      style.innerHTML = '' //v2 back to the default.
      return
    }
    const css=`
    :root{
     --background-2:url("${el.src}");
    }
    `
    style.innerHTML = css;    
  })
  
  
  setTimeout(()=>document.head.append(style),delay)
}());
