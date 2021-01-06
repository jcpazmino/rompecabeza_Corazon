var width = window.innerWidth;
var height = window.innerHeight;
var numFichas=14;
var textPosX=15, textPosY=550, textBorrarX=10, textBorrarY=500, textBorrarW=600, textBorrarH=100;
var toleranciaFicha=20;

var sources = {
    ficha1: 'ficha1_1.png',
    ficha2 : 'ficha1_2.png',
    ficha3 : 'ficha1_3.png',
    ficha4: 'ficha1_4.png' ,
    ficha5 : 'ficha2_1.png', 
    ficha6 : 'ficha2_2.png' ,
    ficha7 : 'ficha2_3.png' ,
    ficha8 : 'ficha2_4.png', 
    ficha9 : 'ficha3_1.png', 
    ficha10 : 'ficha3_2.png',
    ficha11 : 'ficha3_3.png', 
    ficha12 : 'ficha3_4.png', 
    ficha13 : 'ficha4_1.png', 
    ficha14 : 'ficha4_2.png',
    fondo : 'fondo.png',
  };

loadImages(sources, initStage);

function loadImages(sources, callback) {
    var imgsDir = './imgs/';
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = imgsDir + sources[src];
    }
}
function isNearOutline(ficha, outline) {//devuelve true si la ficha está en su lugar
    var t = toleranciaFicha;
    var a = ficha;
    var o = outline;
    var ax = a.x();//posición actua de la ficha en x
    var ay = a.y();

    if (ax > o.x - t && ax < o.x + t && ay > o.y - t && ay < o.y + t) {
        return true;
    } else {
        return false;
    }
}
function drawBackground(background, fondoImg, text) {
    var context = background.getContext();
    context.drawImage(fondoImg, 0, 0);
    context.setAttr('font', '30pt Calibri');
    context.setAttr('textAlign', 'left');
    context.setAttr('fillStyle', 'black');
    context.clearRect(textBorrarX, textBorrarY, textBorrarW, textBorrarH);
    context.fillText(text, textPosX, textPosY);
}

function initStage(images) {
    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
        x:8,
        y:8
    });
    var background = new Konva.Layer();
    var fichaLayer = new Konva.Layer();
    var score = 1;

    // image positions
    var fichas = {
        ficha1 : { x: 600, y: 10},
        ficha2 : {x: 600, y: 30},
        ficha3 : {x: 600, y: 50},
        ficha4 : {x: 600, y: 70},
        ficha5 : {x: 600, y: 100},
        ficha6 : {x: 600, y: 130,},
        ficha7 : {x: 600, y: 160},
        ficha8 : {x: 600, y: 190},
        ficha9 : {x: 600, y: 220},
        ficha10 : {x: 600, y: 250},
        ficha11 : {x: 600, y: 280},
        ficha12 : {x: 600, y: 310},
        ficha13 : {x: 600, y: 340},
        ficha14 : {x: 600, y: 370},
        
    };

    var outlines = {
        ficha1_black : { x: 2, y: -1},
        ficha2_black : {x: 97, y: -1},
        ficha3_black : {x: 257, y: -1},
        ficha4_black : {x: 347, y: -1},
        ficha5_black : {x: -2, y: 111},
        ficha6_black : {x: 133, y: 74,},
        ficha7_black : {x: 211, y: 108},
        ficha8_black : {x: 386, y: 84},
        ficha9_black : {x: 24, y: 205},
        ficha10_black : {x: 100, y: 233},
        ficha11_black : {x: 253, y: 206},
        ficha12_black : {x: 351, y: 235},
        ficha13_black : {x: 132, y: 321},
        ficha14_black : {x: 221, y: 354},
    };

    // create draggable fichas
    for (var key in fichas) {
        // anonymous function to induce scope
        (function () {
            var privKey = key;
            var fich_a = fichas[key];

            var ficha = new Konva.Image({
                image: images[key],
                x: fich_a.x,
                y: fich_a.y,
                draggable: true,
            });

            ficha.on('dragstart', function () {
                this.moveToTop();
                fichaLayer.draw();
            });
            
            //verifica si la ficha esta en la posición correcta
            ficha.on('dragend', function () {
                var outline = outlines[privKey + '_black'];
                if (!ficha.inRightPlace && isNearOutline(ficha, outline)) {
                    ficha.position({
                        x: outline.x,
                        y: outline.y,
                    });
                    fichaLayer.draw();
                    ficha.inRightPlace = true;
                    if (++score >= numFichas+1) {
                        var text = 'Felicitaciones!!! Haz terminado!';
                        drawBackground(background, images.fondo, text);
                    }

                    // disable drag and drop
                    setTimeout(function () {
                        ficha.draggable(false);
                    }, 50); 
                }else{
                    nombreFicha=privKey.split("_");nombreFicha=nombreFicha[0];
                    console.log(nombreFicha)
                    ficha.position({
                        x: eval("fichas."+nombreFicha+".x"),
                        y: eval("fichas."+nombreFicha+".y"),
                    });
                    fichaLayer.draw();
                    ficha.inRightPlace = false;
                }
            });
            // make ficha glow on mouseover
            ficha.on('mouseover', function () {
                document.body.style.cursor = 'pointer';
            });
            // return ficha on mouseout
            ficha.on('mouseout', function () {
                ficha.image(images[privKey]);
                fichaLayer.draw();
                document.body.style.cursor = 'default';
            });

            ficha.on('dragmove', function () {
                document.body.style.cursor = 'pointer';
            });

            fichaLayer.add(ficha);
        })();
    }

    // create ficha outlines
    for (var key in outlines) {
        // anonymous function to induce scope
        (function () {
            var imageObj = images[key];
            var out = outlines[key];

            var outline = new Konva.Image({
                image: imageObj,
                x: out.x,
                y: out.y,
            });

            fichaLayer.add(outline);
        })();
    }

    stage.add(background);
    stage.add(fichaLayer);

    drawBackground(
        background,
        images.fondo,
        'Ponga cada ficha en su sitio!'
    );
}
