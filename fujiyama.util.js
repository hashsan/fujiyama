/*
v1 画像をクリックすると背景に１００％投影。
v2 dissmiss, back to the default.
v3 no back
*/
;(function imagefull(){
  
  const style =document.createElement('style')
  document.body.append(style)    
  window.addEventListener('click',(e)=>{
    style.innerHTML = `:root{--background-2:url("${e.target.src}");}`
  })
  
}());
