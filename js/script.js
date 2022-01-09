var context;
var screenWidth=800;// ширина экрана 
var screenHeight=600;// высота экрана
var mapWidth=2800;// ширина карты
var mapHeight=2800;// высота карты
var quantityMeteor=150;// количество метеоритов
var quantityBarrel=50;/// количество бочек
var quantityAstronaut=20;// количество косманавтов
var rescuedAstronaut=0;// количество спасенных космонавтов
var countLoadImage=0;// счетчик загруженных изображений
var energy=100;// количество энергии
var pause=false;// пауза
var maxEnergy=energy;// максимальная энергия
// массив меток изображений
var nameImageArr=['spaceship','meteor',"barrel","background",'astronaut',
                    "burst1","burst2","burst3"];
var imageArr=new Map();// массив картинок
// обьект карта
map ={
    x:0,
    y:0,
    width: mapWidth,
    height: mapHeight ,
}
// обьект камера
var camera={
    x:0,
    y:0,
    width:screenWidth,
    height:screenHeight,
    
}
// обьект корабль
var ship={
    x:mapWidth/2,
    y:mapHeight/2,
    width:21,
    height:30,
    angle:90,
    speed:0,
}
// обьект метиорит тип
var meteorType={
    id:"meteor",
    being:false,
    x:0,
    y:0,
    width:26,
    height:30,
}
// обьект космонавт тип 
var astronautType={
    id:"astronaut",
    being:false,
    x:0,
    y:0,
    width:50,
    height:80, 
};
// обьект бочка тип
var barrelType={
    id:"barrel",
    being:false,
    x:0,
    y:0,
    width:35,
    height:35,
}
// сопло, огонь из корабля
var nozzle={
  quantityKbadr:40, 
  countKvadr:0,
  maxCountKvadr:2,
  speed:3,
  minSpeed:1.5,
  maxSpeed:4.5,
  visible:false,
  kvadr:{
      being:false,
      x:null,
      y:null,
      angle:0,
      angleRotate:0,
      speed:0,
      count:0,
      maxCount:10,
      sideLen:5,
      color:"#FF0000",
  },
  kvadrArr:[],
}
// обьект взрыв
var burst={
    count:0,
    maxCount:5,
    imageArr:['burst1','burst2','burst3'],
    countImage:0,
    being:false,
    x:null,
    y:null,
    widthArr:[30,60,120],
    heightArr:[30,60,120],
}
// обект большой текст
bigText={
    str:'',
    being:false,
}
noMoveObjArr=[];// массив не движущихся обьктов
// массив обьектов для замыкания карты
closureMap={
    up:[],
    down:[],
    right:[],
    left:[],
    
}
meteorArr=[];// массив метеоритов
barrelArr=[];// массив бочек
astronautArr=[];// массив космонавтов
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
    preload();
    create();
    setInterval(drawAll,16);
    setInterval(gameLoop,16); 
});
function preload()// функция предзагрузки
{
    let timeNow=new Date().getTime()
    srand(timeNow);
    loadImageArr();
}
function addInClosureMap(arr)// добавить обьекты в массив для замыкания карты
{
    let obj;
    for (let i=0;i<arr.length;i++)
    if (arr[i].being==true)
    {
        if (arr[i].y<map.y+screenHeight)
        {
            obj=clone(arr[i]);
            closureMap.up.push(obj);
        }
        if (arr[i].y>map.y+map.height-screenHeight)
        {
            obj=clone(arr[i]);
            obj.y=obj.y-map.height+screenHeight;
            closureMap.down.push(obj);
        }
        if (arr[i].x<map.x+screenWidth)
        {
            obj=clone(arr[i]);
            closureMap.left.push(obj);
        }
        if (arr[i].x>map.x+map.width-screenWidth)
        {
            obj=clone(arr[i]);
            obj.x=obj.x-map.width+screenWidth;
            closureMap.right.push(obj);
        }
   
    }
}
function updateClosureMap()// обнавить массив для замыкания карты
{
    while(closureMap.left.length>0)
    {
        closureMap.left.splice(0,1);
    }
    while(closureMap.right.length>0)
    {
        closureMap.right.splice(0,1);
    }
    while(closureMap.up.length>0)
    {
        closureMap.up.splice(0,1);
    }
    while(closureMap.down.length>0)
    {
        closureMap.down.splice(0,1);
    }
    addInClosureMap(barrelArr);   
    addInClosureMap(meteorArr); 
    addInClosureMap(astronautArr);
}
function create ()// функция создание обьектов неоюходимых для игры
{
    var canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    camera.x=mapWidth/2-camera.width/2;
    camera.y=mapHeight/2-camera.height/2;
    initKeyboardAndMouse(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown' ]);
    initNoMoveObjAll();
    updateClosureMap();
    initKvadrNozzle();
}
function drawBackground()// нарисовать звездной небо НЕ ИСПОЛЬЗУЕТСЯ
{
    context.fillStyle='rgb(0,0,0)';
    context.fillRect(0,0,camera.width,camera.height);// очистка экрана

    
    for (let i=0;i<3000;i++)
    {  
        context.fillStyle="#FFFFFF";
        context.fillRect(randomInteger(0,screenWidth),
                    randomInteger(0,screenHeight), 1, 1);
    }
}
function drawAll()// нарисовать все
{
    context.fillStyle='rgb(210,210,210,1)';
    context.drawImage(imageArr.get("background"),1,1);// нарисовать фон
    for (let i=0;i<meteorArr.length;i++)// рисуем метеориты
    {
        if (meteorArr[i].being==true)
        {
            drawSprite(context,imageArr.get("meteor"),
                meteorArr[i].x,meteorArr[i].y,camera,1) 
        }
    }
    for (let i=0;i<barrelArr.length;i++)// рисуем бочки
    {
        if (barrelArr[i].being==true)
        {
            drawSprite(context,imageArr.get("barrel"),
                    barrelArr[i].x,barrelArr[i].y,camera,1) 
        }
    }     
    for (let i=0;i<astronautArr.length;i++)// рисуем космонавтов
    {
        if (astronautArr[i].being==true)
        {
            drawSprite(context,imageArr.get("astronaut"),
                    astronautArr[i].x,astronautArr[i].y,camera,1) 
        }
    }  
    drawClosureObj();// рисуем обьекты замыкания карты
    drawEnergy();// рисуем энергию
    context.font = "28px Arial";
    context.fillStyle="#999999";
    context.fillText("спасенных космонавтов: "+rescuedAstronaut+"/"+quantityAstronaut,
                       220,35);
                       
    if (nozzle.visible==true)// рисуем сопло
    {
        for (let i=0;i<nozzle.kvadrArr.length;i++)
        {
            if (nozzle.kvadrArr[i].being==true)
            {
                drawKvadrNozzle(context,nozzle.kvadrArr[i].x,nozzle.kvadrArr[i].y,
                            nozzle.kvadrArr[i].sideLen,nozzle.kvadrArr[i].color,
                            nozzle.kvadrArr[i].angleRotate);
            }
        } 
    }
    // рисуем космический корабль
    drawTurnSprite(context,imageArr.get("spaceship"),
            screenWidth/2/*-ship.width/2*/,screenHeight/2/*-ship.height/2*/,
                        ship.angle,15,10,{x:1,y:1},1);
       
    if (burst.being==true)// рисуем взрыв
    {
        drawSprite(context,imageArr.get(burst.imageArr[burst.countImage]),
                    burst.x,burst.y,camera,1);
    }
    if (bigText.being==true)// рисуем текст концы игры
    {
        context.font = "34px Arial";
        context.fillStyle=bigText.color;
        let widthText=context.measureText(bigText.str).width+10;
            let x=screenWidth/2-widthText/2;
            context.fillText(bigText.str,x,240);
    }

}
function drawEnergy()// нарисоват энергию
{
    let x=20, y=20,width=40, height=15;
    context.strokeStyle="#FFFFFF";
    context.fillStyle='#FFFFFF';
    context.strokeRect(x,y,width,height);
    context.fillRect(x-5,y+5,5,5);
    context.fillStyle='#0000FF';
    if (energy<maxEnergy*0.25) context.fillStyle='#FF0000';
    let valuePix=energy/maxEnergy*(width-2);
    context.fillRect(x+1+(width-2)-valuePix,y+1,valuePix,height-2);
}
function drawClosureObj()
{//рисуем обьекты для замыкания
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
// нарисвоать квадри=атик для сопла
function drawKvadrNozzle(context,x,y,sideLen,color,angle)
{
    
    context.save();
    angle=pi*(angle ) / 180;
    context.fillStyle=color;
    context.translate(x+(sideLen/2),(y+sideLen/2));
    context.rotate(angle);
    context.fillRect(-sideLen/2,-sideLen/2,sideLen,sideLen);
    context.restore();
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
function initBigText(str,color,maxCount,value)// инициализация текста конца игры
{
    bigText.being=true;
    bigText.str=str;
    bigText.color=color;
//    bigText.maxCount=maxCount;
//    bigText.value=value;
    pause=true;
    
}
function updateNozzle()// обновить сопло
{
    // инициализируем квадратики для сопла в реальном времени
    for (let i=0;i<nozzle.kvadrArr.length;i++)   
    {
        if (nozzle.kvadrArr[i].being==false)
        {
            nozzle.kvadrArr[i].being=true;
            nozzle.kvadrArr[i].y=ship.y+ship.height/2-camera.y-nozzle.kvadrArr[i].sideLen*1.6;
            nozzle.kvadrArr[i].x=ship.x+ship.width/2-camera.x;-nozzle.kvadrArr[i].sideLen/4;
            let a=25;
            nozzle.kvadrArr[i].angle=ship.angle-a/2+randomInteger(0,a);
            let b=10;
            nozzle.kvadrArr[i].speed=randomInteger(0,b*2)/b;  
            nozzle.countKvadr++;
            if (nozzle.countKvadr>=nozzle.maxCountKvadr)// если создалось определенные количество квадратов
            {
                nozzle.countKvadr=0;
                break;
            }
            
        }
    }
    // обновлянм квадраты сопла
    let speed=nozzle.speed;
    for (let i=0;i<nozzle.kvadrArr.length;i++)   
    {
        if (nozzle.kvadrArr[i].being==true)
        {
           nozzle.kvadrArr[i].count++;
           if (nozzle.kvadrArr[i].count>=nozzle.kvadrArr[i].maxCount)
           {
               nozzle.kvadrArr[i].being=false;
               nozzle.kvadrArr[i].count=0;
           }
           let count=nozzle.kvadrArr[i].count;
           let mult=13;
           let red=250-count*mult;
           let green=0+count*mult;
           let alfa=(10-count)/10;
           nozzle.kvadrArr[i].color="rgba(+"+red+ ","+green+",0,"+alfa+")";
           let angle=nozzle.kvadrArr[i].angle;
           nozzle.kvadrArr[i].angleRotate=count*20;
           nozzle.kvadrArr[i].y+=Math.sin(pi*(angle )/180)*(speed+nozzle.kvadrArr[i].speed);
           nozzle.kvadrArr[i].x+=Math.cos(pi*(angle )/180)*(speed+nozzle.kvadrArr[i].speed);
        }
    }
    
}
function gameLoop()// игровый цикл
{
    let speedRotation=2.5;
    let acceleration=0.025;
    let maxSpeed=10;
    let decEnergy=0.05;
    let decEnergyAcelerate=0.12;
    nozzle.speed=nozzle.minSpeed;
    if (pause==false)// если не пауза
    {
        if (checkPressKey( "ArrowRight"))
        {
            ship.angle+=speedRotation;
        }
        if (checkPressKey( "ArrowLeft"))
        {
            ship.angle-=speedRotation;
        }
        if (checkPressKey( "ArrowUp"))
        {
            if (ship.speed+acceleration<maxSpeed)
            {
                ship.speed+=acceleration;
                energy-=decEnergyAcelerate;
                nozzle.speed=nozzle.maxSpeed;
            }
            else
            {
                ship.speed=maxSpeed;
            }    
        } 
        else  if (checkPressKey( "ArrowDown"))
        {
            if (ship.speed-acceleration>0)
            {
                ship.speed-=acceleration;
                energy-=decEnergyAcelerate;
                nozzle.speed=nozzle.maxSpeed;
            }
            else
            {
                ship.speed=0;
            }
        }
        updateNozzle();// обновить сопло
        ship.y-=Math.sin(pi*(ship.angle ) / 180)*ship.speed;
        ship.x-=Math.cos(pi*(ship.angle ) / 180)*ship.speed;
        if (ship.speed>0) nozzle.visible=true; else nozzle.visible=false;        
        
        if (energy>0&& ship.speed>0) energy-=decEnergy;
        if (energy<=0)initBigText('У вас закончилась энергия, игра окончена.',"#FF0000");
        
    }
    updateBurst();
    for (let i=0;i<meteorArr.length;i++)// столкновение с метериотом
    {
        if (meteorArr[i].being==true && checkCollision(ship,meteorArr[i]))
        {  
            if (burst.being==false)
            {
                burst.x=screenWidth/2-burst.widthArr[0]/2+camera.x;
                burst.y=screenHeight/2-burst.heightArr[0]/2+camera.y;
                burst.being=true;
                pause=true;
            }
            console.log(burst);
        }
    }
    for (let i=0;i<barrelArr.length;i++)// столкновение с бочкой
    {
        if (barrelArr[i].being==true && checkCollision(ship,barrelArr[i]))
        {
            if (energy<maxEnergy*0.8) 
            {
                energy+=maxEnergy*0.2;
            }
            else
            {
                energy=maxEnergy;
            }
            barrelArr[i].being=false;
            updateClosureMap();
            
            
        }
    }
    for (let i=0;i<astronautArr.length;i++)// столкновение с космонавтом
    {
        if (astronautArr[i].being==true && checkCollision(ship,astronautArr[i]))
        {
            astronautArr[i].being=false;
            rescuedAstronaut++;
            updateClosureMap();
            if (rescuedAstronaut>=quantityAstronaut)
            {
                initBigText("Вы спасли всех космонавтов, игра пройдена!","#00FF00")
            }
            
            
        }
    }
    //условия для замыкания
    if (ship.y<map.y) ship.y=map.height;
    if (ship.y>map.height) ship.y=map.y;
    if (ship.x<map.x) ship.x=map.width;
    if (ship.x>map.width) ship.x=map.x;
    
    // перемешение камеры за кораблем
    camera.x=ship.x-screenWidth/2;
    camera.y=ship.y-screenHeight/2;
    

}
function updateBurst()// обновить взрыв
{
    if (burst.being==true)
    {
        burst.count++;
        if (burst.count>=burst.maxCount)
        {
            burst.count=0;
            if (burst.countImage<burst.imageArr.length-1)
            { 
                burst.countImage++;
                burst.x=screenWidth/2-burst.widthArr[burst.countImage]/2+camera.x;
                burst.y=screenHeight/2-burst.heightArr[burst.countImage]/2+camera.y;
                if (burst.countImage==2)
                {
                    initBigText('Вы столкнулись с метеоритом, игра окончена.',"#FF0000");
                }
            }
        }
    }
}
function initObjArr(quantity,type)// инициализировать массив обьектов 
{
    let objArr=[];
    for (let i=0;i<quantity;i++)
    {
        let objOne=clone(type);
        let XY=calcNoColiisionXY(objOne);
        objOne.x=XY.x;
        objOne.y=XY.y;
        objOne.being=true;
        objArr.push(objOne);
        noMoveObjArr.push(objOne);
    }
    return objArr;
}
function initNoMoveObjAll()// инициализировать все не движуешиеся обькты
{
   barrelArr=initObjArr(quantityBarrel,barrelType);
   meteorArr=initObjArr(quantityMeteor,meteorType);
   astronautArr=initObjArr(quantityAstronaut,astronautType);   
}
function initKvadrNozzle()// инициализировать квадраты для сопла
{
    for (let i=0;i<nozzle.quantityKbadr;i++)
    {
        let obj=clone(nozzle.kvadr);
        if (randomInteger(1,2)==1) obj.being=true;
        nozzle.kvadrArr.push(obj);
    }
    console.log(nozzle.kvadrArr);
}
function checkCollision(obj1,obj2)// проверить столкновение двух обьктов
{
    if (obj1.x+obj1.width>obj2.x &&  obj1.x<obj2.x+obj2.width &&
        obj1.y+obj1.height>obj2.y && obj1.y<obj2.y+obj2.height    )
    {
        return true;
    }
    return false;
}
function calcNoColiisionXY(obj)// расчитать координаты так что бы не столкновений
{
    let flag=false;
    let x=null,y=null;
    do
    {
        flag=false;
        x=randomInteger(1,mapWidth);
        y=randomInteger(1,mapHeight);
        if (x>mapWidth/2-50 && x<mapWidth/2+50 && y>mapHeight/2-50 && y<mapHeight/2+50)
        {
            flag=true;
        }
        if (checkCollisionNoMoveObj({x:x,y:y,width:obj.width,height:obj.height})==true)
        {
            flag=true;
        }
    }while(flag==true);
    return {x:x,y:y};
}
function checkCollisionNoMoveObj(obj)// проверить столкновеие с массивом обьектов не движушихся
{
    
    for (let i=0;i<noMoveObjArr.length;i++)
    {
        if (obj.x+obj.width>noMoveObjArr[i].x && 
            obj.x<noMoveObjArr[i].x+noMoveObjArr[i].width &&
            obj.y+obj.height>noMoveObjArr[i].y && 
            obj.y<noMoveObjArr[i].y+noMoveObjArr[i].height
            )
        {
            return true;    
        }
    }
    return false;
}

