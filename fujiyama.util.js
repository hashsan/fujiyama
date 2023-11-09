/*
画像をクリックすると背景に１００％投影。
*/
;(function imagefull(){
  const delay = 5*1000
  const isimg =el=>/img/i.test(el.tagName)
  const style =document.createElement('style')
  
  
  window.addEventListener('click',(e)=>{
    const el = e.target
    if(!isimg(el)){
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
