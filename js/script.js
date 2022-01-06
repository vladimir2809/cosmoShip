var context;
var screenWidth=800;
var screenHeight=600;
var mapWidth=1600;
var mapHeight=1600;
var quantityMeteor=150;
var quantityBarrel=20;
var countLoadImage=0;
var nameImageArr=['spaceship','meteor',"barrel"];
var imageArr=new Map();// массив картинок
map ={
    x:0,
    y:0,
    width: mapWidth,
    height: mapHeight ,
}
var camera={
    x:0,
    y:0,
    width:screenWidth,
    height:screenHeight,
    
}
var ship={
    x:mapWidth/2,
    y:mapHeight/2,
    width:21,
    height:30,
    angle:90,
    speed:0,
}
var meteorType={
    id:"meteor",
    being:false,
    x:0,
    y:0,
    width:26,
    height:30,
}
var barrelType={
    id:"barrel",
    being:false,
    x:0,
    y:0,
    width:26,
    height:30,
}
noMoveObjArr=[];
closureMap={
    up:[],
    down:[],
    right:[],
    left:[],
    
}
meteorArr=[];
barrelArr=[];
function loadImageArr()// загрузить массив изображений
{
    // заполняем массив изображений именами
    for (let value of nameImageArr  )
    {
        let image=new Image();
        image.src="img/"+value+".png";        imageArr.set(value,image);
    }
    // проверяем загружены ли все изображения
    for (let pair of imageArr  )
    {
             imageArr.get(pair[0]).onload = function() {
                   countLoadImage++;
                   //console.log(imageArr);
                   console.log(countLoadImage);
                   if (countLoadImage==imageArr.size) 
                   {
                       imageLoad=true;
                    //  console.log(imageArr);
                   } // если загруженны все ищображения
             }
             imageArr.get(pair[0]).onerror = function() {   
                   alert("во время загрузки произошла ошибка");
                   //alert(pair[0].name);
                   
             }
     }  
}
window.addEventListener('load', function () {
    //console.log(localStorage.getItem("gameMap"));
    preload();
    create();
    
   // audio.play("shot");
    setInterval(drawAll,16);
    setInterval(gameLoop,16);
    //setTimeout(playSoundTrack,2000);
    
});
function preload()// функция предзагрузки
{
    loadImageArr();
}
function create ()// функция создание обьектов неоюходимых для игры
{
    var canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
//    initKeyboardAndMouse(["KeyA","KeyS","KeyD","KeyW","KeyM","KeyB","KeyR",'ArrowLeft',
//                    'ArrowRight','ArrowUp','ArrowDown',"Enter","KeyP","KeyO",'KeyG',"KeyM",
//                    "KeyI","KeyK" ]);
    camera.x=mapWidth/2-camera.width/2;
    camera.y=mapHeight/2-camera.height/2;
    initKeyboardAndMouse(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown' ]);
    initMeteors();
    initBarrel();
    
    for (let i=0;i<meteorArr.length;i++)
    {
        let obj=clone(meteorArr[i]);
        noMoveObjArr.push(obj)
    }
     for (let i=0;i<barrelArr.length;i++)
    {
        let obj=clone(barrelArr[i]);
        noMoveObjArr.push(obj)
    }
    let obj;
    for (let i=0;i<noMoveObjArr.length;i++)
    {
        if (noMoveObjArr[i].y<map.y+screenHeight)
        {
            obj=clone(noMoveObjArr[i]);
            closureMap.up.push(obj);
        }
        if (noMoveObjArr[i].y>map.y+map.height-screenHeight)
        {
            obj=clone(noMoveObjArr[i]);
            obj.y=obj.y-map.height+screenHeight;
            closureMap.down.push(obj);
        }
        if (noMoveObjArr[i].x<map.x+screenWidth)
        {
            obj=clone(noMoveObjArr[i]);
            closureMap.left.push(obj);
        }
        if (noMoveObjArr[i].x>map.x+map.width-screenWidth)
        {
            obj=clone(noMoveObjArr[i]);
            obj.x=obj.x-map.width+screenWidth;
            closureMap.right.push(obj);
        }
   
    }
    console.log(closureMap);
}
function drawAll()
{
    context.fillStyle='rgb(210,210,210)';
    context.fillRect(0,0,camera.width,camera.height);// очистка экрана
    drawTurnSprite(context,imageArr.get("spaceship"),
            screenWidth/2,screenHeight/2,ship.angle,15,10,{x:1,y:1},1);
    for (let i=0;i<meteorArr.length;i++)
    {
        drawSprite(context,imageArr.get("meteor"),
                meteorArr[i].x,meteorArr[i].y,camera,1) 
    }
    for (let i=0;i<barrelArr.length;i++)
    {
        drawSprite(context,imageArr.get("barrel"),
                barrelArr[i].x,barrelArr[i].y,camera,1) 
    }     
    //рисуем обьекты для замыкания
    for (let i=0;i<closureMap.down.length;i++)
    {
       
        drawSprite(context,imageArr.get(closureMap.down[i].id),
            closureMap.down[i].x,-screenHeight+closureMap.down[i].y,camera,1);
        
    }
    for (let i=0;i<closureMap.up.length;i++)
    {
        drawSprite(context,imageArr.get(closureMap.up[i].id),
            closureMap.up[i].x,closureMap.up[i].y+map.height,camera,1);
    }
    for (let i=0;i<closureMap.right.length;i++)
    {
        drawSprite(context,imageArr.get(closureMap.right[i].id),
           -screenWidth+closureMap.right[i].x,closureMap.right[i].y,camera,1);
    }
    for (let i=0;i<closureMap.left.length;i++)
    {
        drawSprite(context,imageArr.get(closureMap.left[i].id),
            closureMap.left[i].x+map.width,closureMap.left[i].y,camera,1); 
    }
        

}
function drawSprite(context,image,x,y,camera,scale)// функция вывода спрайта на экран
{
    if(!context || !image) return;
    context.save();
    context.scale(scale,scale);
    context.drawImage(image,x-camera.x,y-camera.y);
    context.restore();
}
function drawTurnSprite(context,image,x,y,angle,x1,y1,camera,scale)// функция вывода повернутого спрайта на экран
{
    if(!context || !image) return;
    context.save();
    context.translate((x+x1-camera.x)*scale,
                        (y+y1-camera.y)*scale);
    context.scale(scale,scale);
    context.rotate(angle*Math.PI/180);
    context.drawImage(image,-x1,-y1);
    context.restore();
}
function gameLoop()
{
    let speedRotation=2.5;
    let acceleration=0.05;
    let maxSpeed=10;
    if (checkPressKey( "ArrowRight"))
    {
        ship.angle+=speedRotation;
        console.log(123);
    }
    if (checkPressKey( "ArrowLeft"))
    {
        ship.angle-=speedRotation;
    }
    
    if (checkPressKey( "ArrowUp"))
    {
        if (ship.speed<10)ship.speed+=acceleration;else ship.speed=maxSpeed;    
    } 
    else  if (checkPressKey( "ArrowDown"))
    {
        if (ship.speed>0)ship.speed-=acceleration;else ship.speed=0;
       // alert(5415);
    }else 
    {
        //if (ship.speed>0) ship.speed-=0.04; else ship.speed=0;
    }
    ship.y-=Math.sin(pi*(ship.angle ) / 180)*ship.speed;
    ship.x-=Math.cos(pi*(ship.angle ) / 180)*ship.speed;
    //условия для замыкания
    if (ship.y<map.y) ship.y=map.height;
    if (ship.y>map.height) ship.y=map.y;
    if (ship.x<map.x) ship.x=map.width;
    if (ship.x>map.width) ship.x=map.x;
    
    camera.x=ship.x-screenWidth/2;
    camera.y=ship.y-screenHeight/2;

}
function initMeteors()
{
    for (let i=0;i<quantityMeteor;i++)
    {
        let meteorOne=clone(meteorType);
        meteorOne.x=randomInteger(1,mapWidth);
        meteorOne.y=randomInteger(1,mapHeight);
        meteorOne.being=true;
        meteorArr.push(meteorOne);
    }
}
function initBarrel()
{
    for (let i=0;i<quantityBarrel;i++)
    {
        let barrelOne=clone(barrelType);
        barrelOne.x=randomInteger(1,mapWidth);
        barrelOne.y=randomInteger(1,mapHeight);
        barrelOne.being=true;
        barrelArr.push(barrelOne);
    }
}

