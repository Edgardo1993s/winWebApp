var mousePosition;
var offset = [0,0];
var offsetFindWind=[0,0];
var zIndex=1;
let findWin=false;
let btnPress=false;
let findWinElement;
var principalFatherOffsetLeft;
var principalFatherOffsetTop;
var colapseState=false;
var events = [];
let componentToResize;
function init(){
    //Agregamos eventos al DOM para mover las ventanas
    document.addEventListener('mouseup', function (e) {
        btnPress=false;
    });
    document.addEventListener('mousedown',e=>{
        btnPress=true;
        if(e.target.className.includes('winWebApp')){
            var element=e.target;
            offset = [
                element.offsetLeft - e.clientX,
                element.offsetTop - e.clientY
            ];
            var mitad=(e.target.offsetTop+e.target.offsetHeight)
            if(e.clientY<(mitad-(e.target.offsetHeight/2))){
                document.addEventListener('mousemove',function(e){
                    storeEvent("document",arguments.callee, false, 'mousemove');
                    if(btnPress){
                        mousePosition = {
                            x : e.clientX,
                            y : e.clientY
                        };     
                        if(mousePosition.x + offset[0]>0 && mousePosition.y + offset[1]>0){
                            element.style.left = (mousePosition.x + offset[0]) + 'px';
                            element.style.top  = (mousePosition.y + offset[1]) + 'px';
                        }
                    }
                    else{
                        detachEvent();
                    }
                })
            }
            element.style.zIndex=zIndex;
            zIndex++
        }
        else if(e.target.className.includes("titleWin")){
            var element=e.target;
            offset = [
                element.offsetParent.offsetLeft - e.clientX,
                element.offsetParent.offsetTop - e.clientY
            ];
            document.addEventListener('mousemove',function(e){
                storeEvent("document",arguments.callee, false, 'mousemove');
                if(btnPress){
                    mousePosition = {
                        x : e.clientX,
                        y : e.clientY
                    }; 
                    if(mousePosition.x + offset[0]>0 && mousePosition.y + offset[1]>0){
                        element.offsetParent.style.left = (mousePosition.x + offset[0]) + 'px';
                        element.offsetParent.style.top  = (mousePosition.y + offset[1]) + 'px';
                    }
                }
                else{
                    detachEvent();
                }
            })
            element.offsetParent.style.zIndex=zIndex;
            zIndex++
        }
        else{
            var target=principalParentFindWin(e.target)
            if(target){
                var win=document.getElementsByClassName('findWin');
                offset = [
                    win[0].offsetLeft - e.clientX,
                    win[0].offsetTop - e.clientY
                ];
                document.addEventListener('mousemove',function(e){
                    storeEvent("document",arguments.callee, false, 'mousemove');
                    if(btnPress){
                        mousePosition = {
                            x : e.clientX,
                            y : e.clientY
                        };
                        if(mousePosition.x + offset[0]>0 && mousePosition.y + offset[1]>0){
                            win[0].style.left = (mousePosition.x + offset[0]) + 'px';
                            win[0].style.top  = (mousePosition.y + offset[1]) + 'px';
                        }
                    }
                    else{
                        detachEvent()
                    }
                })
            }
        }
    })//
    //Agregamos eventos a los botones de activar la venta y de cerrar la ventana
    let controlWinActive = document.getElementsByClassName("activeWin");
    let controlWinClose = document.getElementsByClassName("controlWinClose");
    for(let ctrl of controlWinActive){
           ctrl.addEventListener('click',activeWindow);
    }
    for(let ctrl of controlWinClose){
        ctrl.addEventListener('click',closeWin);
    }
    //Agregamos eventos de cambiar el tamaño de las ventanas
    for(let children of document.body.children){
        if(children.className.includes("winWebApp") && children.className.includes("resizeWin")){
            children.addEventListener('mousemove',positionMouseToResize)
            children.addEventListener('mousedown',changeSize)
            document.addEventListener('mouseup',finishResize)
        }
        //Tambien se agregan eventes a la ventana donde estaran minimizadas nuestras ventanas
        else if(children.className.includes("findWin")){
            findWinElement=children;
            findWin=true;
            var transformMin=document.getElementsByClassName('transformMin');
            var transformMax=document.getElementsByClassName('transformMax')
            transformMin[0].addEventListener('mousedown',capturePositionMouse);
            transformMin[0].addEventListener('mouseup',transformFindWind);
            transformMax[0].addEventListener('mousedown',capturePositionMouse)
            transformMax[0].addEventListener('mouseup',transformFindWind);
        }
    }
}
//Funcion para activar las ventanas
function activeWindow(e){
    let win=document.getElementsByTagName('div')
    for(let w of win){
        if(w.parentNode==document.body){
            if(w.id==e.target.dataset.toggle){
                w.style.display="inline-block";
                w.style.pointerEvents="all";
                for(let children of w.children){
                    if(children.className.includes('controlWinMinimize')){
                        if(!findWin){
                            children.style.opacity="0";
                        }
                        else{
                            children.addEventListener('click',minimize);
                        } 
                    }    
                }
            }
        }
    }
}
//Funcion para cerrar la ventana
function closeWin(e){
    e.target.offsetParent.style.display="none";
    var id=e.target.parentNode.id;
    for(let child of findWinElement.children){
        if(id==child.id){
            child.style.display="none";
            findWinElement.removeChild(child)
        }
    }
    if(findWinElement.children.length==2){
        var transformMin=document.getElementsByClassName('transformMin');
        var transformMax=document.getElementsByClassName('transformMax');
        transformMin[0].style.display="none";
        transformMax[0].style.display="none";
    }
}
//Funcion para minimizar la ventana
function minimize(e){
    var transformMin=document.getElementsByClassName('transformMin');
    var transformMax=document.getElementsByClassName('transformMax');
    if(getComputedStyle(transformMax[0]).display=="none"){
        transformMin[0].style.display="block";
    }
    var copy=e.target.offsetParent.cloneNode(true)
    var id=copy.id;
    var exist=false;
    if(!findWinElement.children.length){
        for(let element of copy.children){
            if(element.className.includes("bodyWin")){
                element.id=id;
                element.style.width="80px";
                element.style.height="80px";
                element.style.fontSize="5px";
                element.style.display="inline-block"
                element.style.cursor="pointer";
                element.style.margin="5px";
                element.style.borderRadius="5px";
                element.addEventListener('mousedown',showWin);
                element.addEventListener("mouseup",testPosicion);
                findWinElement.appendChild(element);
            }
        }
    }
    else{
        for(let child of findWinElement.children){
            if(child.id==copy.id){
                exist=true;
            }
        }
        if(!exist){
            for(let element of copy.children){
                if(element.className.includes("bodyWin")){
                    element.id=id;
                    element.style.width="80px";
                    element.style.height="80px"
                    element.style.fontSize="5px"
                    if(getComputedStyle(transformMax[0]).display=="block"){
                        element.style.display="none"
                    }
                    else{
                        element.style.display="inline-block"
                    }
                    element.style.cursor="pointer";
                    element.style.margin="5px";
                    element.style.borderRadius="5px";
                    element.addEventListener("mousedown",showWin);
                    element.addEventListener("mouseup",testPosicion);
                    findWinElement.appendChild(element);
                }
            }
        }
    }
    e.target.offsetParent.style.display="none";
}
//Funciones para obetener el padre de un elemento
function principalParentFindWin(node){
    if(node.body==document.body){
        return false;
    }
    else if(node.className.includes("findWin")){
        return node;
    }
    else{
       return principalParentFindWin(node.parentNode);
    }
}
function principalParentBodyWin(node){
    if(node.className.includes("bodyWin")){
        return node;
    }
    else{
       return principalParentBodyWin(node.parentNode);
    }
}
//Funcion para volver a mostrar la ventana cuando esta minimizada
function showWin(e){
    var principalFather=principalParentFindWin(e.target);
    principalFatherOffsetLeft=principalFather.offsetLeft;
    principalFatherOffsetTop=principalFather.offsetTop;
}
//La ventana se mostrara solo si no ha sido arrastrada
function testPosicion(e){
    var principalFather=principalParentFindWin(e.target);
    var fatherOffsetLeft=principalFather.offsetLeft;
    var fatherOffsetTop=principalFather.offsetTop;
    if(fatherOffsetLeft==principalFatherOffsetLeft || fatherOffsetTop==principalFatherOffsetTop){
        var winToShow=document.getElementById(principalParentBodyWin(e.target).id);
        winToShow.style.display="inline-block";
    }
}
//Comprobamos si el mouse esta posicionado en la esquina inferior derecha para poder cambiar de tamaño la ventana
function positionMouseToResize(e){
    if(e.target.className.includes("winWebApp")){
        if(((e.target.offsetLeft+e.target.clientWidth)-e.clientX<5) && ((e.target.offsetTop+e.target.offsetHeight)-e.clientY<5)){
            document.body.style.cursor="nwse-resize";
        }
        else{
            if(!btnPress){
                 document.body.style.cursor="default";
            }
        }
    }
}
//Cambiamos el tamño de la ventana
function changeSize(e){
    if(e.target.className.includes("winWebApp")){
        var x=(e.target.offsetLeft+e.target.clientWidth)-e.clientX;
        var y=(e.target.offsetTop+e.target.offsetHeight)-e.clientY;
        if(x<5 && y<5){
            document.body.style.cursor="nwse-resize";
            componentToResize=e.target;
            document.addEventListener("mousemove",changeSizeWinToLeft);
        }
    }
}
function changeSizeWinToLeft(e){
    var width=componentToResize.clientWidth+(e.clientX-(componentToResize.offsetLeft+componentToResize.clientWidth));
    var height=(componentToResize.offsetHeight+(e.clientY-(componentToResize.offsetTop+componentToResize.offsetHeight)))-(componentToResize.offsetHeight-componentToResize.offsetHeight-5);
    componentToResize.style.width=width+"px";
    componentToResize.style.height=height+"px";
}
function finishResize(e){
    document.removeEventListener('mousemove',changeSizeWinToLeft)
    document.body.style.cursor="default";
}
//Funciones para contraer o expadir el elemento donde se encuentran nuestras ventanas minimizadas
function capturePositionMouse(e){
    offsetFindWind=[
        e.target.offsetParent.offsetLeft,
        e.target.offsetParent.offsetTop
    ]
}
function transformFindWind(e){
    //Si el elemento donde se encuentran nuestras ventanas fue arrastrado, no se expandira o contraera
    if(offsetFindWind[0]==e.target.offsetParent.offsetLeft && offsetFindWind[1]==e.target.offsetParent.offsetTop){
        if(!colapseState){
            transformMin();
        }
        else{
            transformMax();
        }
    }
}
function transformMin(e){
    colapseState=true;
    var transformMin=document.getElementsByClassName('transformMin');
    var transformMax=document.getElementsByClassName('transformMax')
    for(let a of findWinElement.children){
        if(a.className.includes('bodyWin')){
            a.style.display="none";
        }
    }
    transformMin[0].style.display="none";
    transformMax[0].style.display="block";
    transformMax[0].style.margin="0px";
    transformMax[0].style.top="-2px";
    transformMax[0].style.padding="5px";
    transformMax[0].style.fontSize="20px";
}
function transformMax(e){
    colapseState=false;
    var transformMin=document.getElementsByClassName('transformMin');
    var transformMax=document.getElementsByClassName('transformMax')
    for(let a of findWinElement.children){
        if(a.className.includes('bodyWin')){
            a.style.display="inline-block";
        }
    }
    transformMax[0].style.display="none";
    transformMin[0].style.display="block";
    transformMin[0].style.margin="0px";
    transformMin[0].style.top="-2px";
    transformMin[0].style.padding="5px";
    transformMin[0].style.fontSize="20px";
}
//funciones para almacenar eventos y luego eliminarlos
function storeEvent(id, fn, useCaptureMode, event){
    var e = findStoredEvent(id, event, useCaptureMode);
    if (!e){
        events.push({id, fn, useCaptureMode, event});
    }
}
function findStoredEvent(id, event, useCaptureMode) {
    return events.find(el => el.id === id && el.event === event && el.useCaptureMode === useCaptureMode);
}
function detachEvent(){
    var e = findStoredEvent('document', 'mousemove', false);
    if (e){
        document.removeEventListener(e.event, e.fn, e.useCaptureMode);
        events.splice(events.findIndex(el => el === e), 1);
    }
}
window.addEventListener('load',init);