var context;
var screenWidth=800;
var screenHeight=600;
var mapWidth=3000;
var mapHeight=2000;
var quantityMeteor=100;
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
    x:screenWidth/2,
    y:screenHeight/2,
    width:21,
    height:30,
    angle:90,
    speed:0,
}
var meteorType={
    being:false,
    x:0,
    y:0,
    width:26,
    height:30,
}
var barrelType={
    being:false,
    x:0,
    y:0,
    width:26,
    height:30,
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
//    context.save();
//    context.scale(scale,scale);
//    context.drawImage(image,x-camera.x,y-camera.y);
//    context.restore();
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
    if (checkPressKey( "ArrowRight"))
    {
        ship.angle+=2;
        console.log(123);
    }
    if (checkPressKey( "ArrowLeft"))
    {
        ship.angle-=2;
       // alert(5415);
    }
    if (checkPressKey( "ArrowUp"))
    {
        //ship.speed+=0.2;
        if (ship.speed<10)ship.speed+=0.2;else ship.speed=10;
       // alert(5415);
    }
    if (checkPressKey( "ArrowDown"))
    {
        if (ship.speed>0)ship.speed-=0.2;else ship.speed=0;
       // alert(5415);
    }
    if (ship.speed>0) ship.speed-=0.05; else ship.speed=0;
    camera.y-=Math.sin(pi*(ship.angle ) / 180)*ship.speed;
    camera.x-=Math.cos(pi*(ship.angle ) / 180)*ship.speed;
   // ship.angle++;
//     if ( num==numPanzer &&( checkPressKey("KeyA")||checkPressKey("KeyS")||
//            checkPressKey("KeyD")||checkPressKey("KeyW")))
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

