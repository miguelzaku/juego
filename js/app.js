
// Título Match Game

function tituloAmarillo() {
       $(".main-titulo").animate({
           color: "#FFFF00"
         }, 1000,
         function () {
           tituloBlanco();
         }
       )
     }

function tituloBlanco() {
       $(".main-titulo").animate({
         color: "#FFFFFF"
       }, 1000,
         function () {
           tituloAmarillo();
         }
       );
     }
$(document).ready(function () {

tituloBlanco();

});

$(".btn-reinicio").click(function(){
  i=0;
  score=0;
  mov=0;
  $(".panel-score").css("width","25%");
  $('.panel-tablero').show();
  $("#score-text").html("0");
  $("#movimientos-text").html("0");
  $(this).html("REINICIAR");
  $('#timer').timer('remove');
  $('#timer').timer({
  countdown: true,
  duration: '2m',
  format: '%M:%S',
  callback: function() {
      alert('Time up!');
      $('.panel-tablero').hide();
      $(".panel-score").css("width","100%");
    }
});
});


// inicio armando tablero
var rows=7;
var cols = 7;
var grid = [];
var validFigures=0;
var score = 0;
var moves = 0;


function candy(r,c,obj,src) {
  return {
  r: r, // fila
  c: c,  // columna
  src:src, // imagen
  locked:false,
  isInCombo:false,
  o:obj
  }
}

// arreglo con imagenes para cada tipo de caramelo
var candyType=[];
candyType[0]="image/1.png";
candyType[1]="image/2.png";
candyType[2]="image/3.png";
candyType[3]="image/4.png";

// función que devuelve un caramelo aleatorio.
function pickRandomCandy() {
  var pickInt = Math.floor((Math.random()*4));
  return candyType[pickInt];
}

// preparando el tablero
for (var r = 0; r < rows; r++) {
 grid[r]=[];
 for (var c =0; c< cols; c++) {
    grid[r][c]= new candy(r,c,null,pickRandomCandy());
 }
}

// Coordenadas iniciales:
var width = $('.panel-tablero').width();
var height = $('.panel-tablero').height();
var cellWidth = width / 7;
var cellHeight = height / 7;
var marginWidth = cellWidth/7;
var marginHeight = cellHeight/7;

// creando imagenes en el tablero
for (var r = 0; r < rows; r++) {
  for (var c =0; c< cols; c++) {
    var cell = $("<img class='candy' id='candy_"+r+"_"+c+"' r='"+r+"' c='"+c+
      "'ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'src='"+
      grid[r][c].src+"' style='height:"+cellHeight+"px'/>");
    cell.attr("ondragstart","_ondragstart(event)");
    $(".col-"+(c+1)).append(cell);
    grid[r][c].o = cell;
  }
}

reponer();


score= 0 ;
moves= 0 ;
$("#score-text").html("0");
$("#movimientos-text").html("0");


// -------------------------------------------------------------------------------------- ETAPA 2

 // cuando se hace click sobre un candy
function _ondragstart(a)
{
  a.dataTransfer.setData("text/plain", a.target.id);
 }

 // cuando se mueve un dulce por encima de otro sin soltarlo
 function _onDragOverEnabled(e)
 {
   e.preventDefault();
   console.log("pasando sobre caramelo " + e.target.id);
  }

  // cuando soltas un caramelo sobre otro
  function _onDrop(e)
  {
    // solo para firefox
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      console.log("firefox compatibility");
      e.preventDefault();
    }

   // obtener origen del candy
   var src = e.dataTransfer.getData("text");
   var sr = src.split("_")[1];
   var sc = src.split("_")[2];

   // obtener destino del candy
   var dst = e.target.id;
   var dr = dst.split("_")[1];
   var dc = dst.split("_")[2];

   // si la distancia es mayor a 1, no permitir el movimiento y alertar
   var ddx = Math.abs(parseInt(sr)-parseInt(dr));
   var ddy = Math.abs(parseInt(sc)-parseInt(dc));
   if (ddx > 1 || ddy > 1)
   {
     alert("Los movimientos no pueden tener una distancia mayor a 1");
     return;
   }
   else{
      console.log("intercambio " + sr + "," + sc+ " to " + dr + "," + dc);
      // intercambio de candys
      var tmp = grid[sr][sc].src;
      grid[sr][sc].src = grid[dr][dc].src;
      grid[sr][sc].o.attr("src",grid[sr][sc].src);
      grid[dr][dc].src = tmp;
      grid[dr][dc].o.attr("src",grid[dr][dc].src);

      // sumar un movimiento a mi cantidad
      moves+=1;
      $("#movimientos-text").html(moves);

      //buscar combinaciones
      destruirCombos();

   }


}

// buscar combinaciones horizontales y verticales para destruirlas
    function destruirCombos()
    {

     // busqueda horizontal


      for (var r = 0; r < rows; r++)
      {


        var prevCell = null;
        var figureLen = 0;
        var figureStart = null;
        var figureStop = null;

        for (var c=0; c< cols; c++)
        {

          // saltear candys locked o que estan en combo.
          if (grid[r][c].locked || grid[r][c].isInCombo)
          {
            figureStart = null;
            figureStop = null;
            prevCell = null;
            figureLen = 1;
            continue;
          }

          // primer objeto del combo
          if (prevCell==null)
          {
            prevCell = grid[r][c].src;
            figureStart = c;
            figureLen = 1;
            figureStop = null;
            continue;
          }
          else
          {
            // segundo o posterior objeto del combo
            var curCell = grid[r][c].src;
            if (!(prevCell==curCell))
            {
              prevCell = grid[r][c].src;
              figureStart = c;
              figureStop=null;
              figureLen = 1;
              continue;
            }
            else
            {
              // incrementar combo
              figureLen+=1;
              if (figureLen==3)
              {
                validFigures+=1;
                score+=10;
                $("#score-text").html(score);
                figureStop = c;
                console.log("Combo de columna " + figureStart + " a columna " + figureStop);
                for (var ci=figureStart;ci<=figureStop;ci++)
                {

                  grid[r][ci].isInCombo=true;
                  grid[r][ci].src=null;
                }
                prevCell=null;
                figureStart = null;
                figureStop = null;
                figureLen = 1;
                continue;
              }
            }
          }

        }
      }

     // busqueda vertical


      for (var c=0; c< cols; c++)
      {
        var prevCell = null;
        var figureLen = 0;
        var figureStart = null;
        var figureStop = null;

        for (var r = 0; r < rows; r++)
        {

          if (grid[r][c].locked || grid[r][c].isInCombo)
          {
            figureStart = null;
            figureStop = null;
            prevCell = null;
            figureLen = 1;
            continue;
          }

          if (prevCell==null)
          {
            prevCell = grid[r][c].src;
            figureStart = r;
            figureLen = 1;
            figureStop = null;
            continue;
          }
          else
          {
            var curCell = grid[r][c].src;
            if (!(prevCell==curCell))
            {
              prevCell = grid[r][c].src;
              figureStart = r;
              figureStop=null;
              figureLen = 1;
              continue;
            }
            else
            {
              figureLen+=1;
              if (figureLen==3)
              {
                validFigures+=1;
                score+=10;
                $("#score-text").html(score);
                figureStop = r;
                console.log("Combo de fila " + figureStart + " a fila " + figureStop );
                for (var ci=figureStart;ci<=figureStop;ci++)
                {
                  grid[ci][c].isInCombo=true;
                  grid[ci][c].src=null;
                }
                prevCell=null;
                figureStart = null;
                figureStop = null;
                figureLen = 1;
                continue;
              }
            }
          }

        }
      }


      // destruir combos

       var isCombo=false;
       for (var r = 0;r<rows;r++)
        for (var c=0;c<cols;c++)
          if (grid[r][c].isInCombo)
          {
            console.log("Combo disponible");
            isCombo=true;
             reponer()
          }
    }

    function reponer() {
        // mover celdas vacias hacia arriba
       for (var r=0;r<rows;r++)
       {
        for (var c=0;c<cols;c++)
        {
          if (grid[r][c].isInCombo)  // celda vacia
          {
            grid[r][c].o.attr("src","");
              // deshabilitar celda del combo
            grid[r][c].isInCombo=false;
            for (var sr=r;sr>=0;sr--)
            {
              if (sr==0) break;
              if (grid[sr-1][c].locked) break;
              var tmp = grid[sr][c].src;
              grid[sr][c].src=grid[sr-1][c].src;
              grid[sr-1][c].src=tmp;
            }
          }
        }
      }

        // reordenando y reponiendo celdas
        for (var r=0;r<rows;r++)
        { for (var c = 0;c<cols;c++)
          {
            grid[r][c].o.attr("src",grid[r][c].src);
            grid[r][c].isInCombo=false;
            if (grid[r][c].src==null)
              grid[r][c].respawn=true;
            if (grid[r][c].respawn==true)
            {
              grid[r][c].o.off("ondragover");
              grid[r][c].o.off("ondrop");
              grid[r][c].o.off("ondragstart");
              grid[r][c].respawn=false;
              console.log("Reponiendo fila " + r+ " , columna " + c);
              grid[r][c].src=pickRandomCandy();
              grid[r][c].locked=false;
              grid[r][c].o.attr("src",grid[r][c].src);
              grid[r][c].o.attr("ondragstart","_ondragstart(event)");
              grid[r][c].o.attr("ondrop","_onDrop(event)");
              grid[r][c].o.attr("ondragover","_onDragOverEnabled(event)");
            }
          }
        }



        console.log("celdas repuestas");
        destruirCombos();

    }
