Libreria JS para crear ventanas flotantes.
Esta libreria no contiene ninguna dependencias de otras librerias, por lo cual hace facil su uso, tambien puedes revisar el css y modificarlo a tu gusto.
No puse mucho diseño a la venta porque el objetivo es la creacion de ventanas flotantes, que el usario las pueda cambiar de tamaño y las pueda minimizar.
Queda a gusto del usuario el poder moejorar el diseño de la ventana.

Pasos para el uso de la libreria
1. Todos los div que se usen como una ventana tienen que ser hijos directamente de la etiqueta body.
2. A estos div tienes que asignarles la clase "winWebApp".
3. Agrega un id a la ventana
    <idv class="winWebApp resizeWin" id="miVentana"> 
    </div>
4. Agrega un titulo a la ventana de la siguiente manera.
    <idv class="winWebApp" id="miVentana">
       <h3 class="titleWin">Mi Ventana</h3>
    </div>
5. Agrega dos botones con sus respectivas clases que serviran para minizar o eliminar la ventana.
    <idv class="winWebApp" id="miVentana">
        <h3 class="titleWin">Estudiantes</h3>
        <button class="controlWinClose">X</button><button class="controlWinMinimize">-</button>
    </div>
6. Agrega una etiqueta hr como separador del titulo y los botones del cuerpo de la ventana.
    <idv class="winWebApp" id="miVentana">
        <h3 class="titleWin">Estudiantes</h3>
        <button class="controlWinClose">X</button><button class="controlWinMinimize">-</button>
        <hr class="controlHrWin">
    </div>
7. Agrega el cuerpo de la ventana de la siguiente manera.
     <idv class="winWebApp" id="miVentana">
          <h3 class="titleWin">Estudiantes</h3>
          <button class="controlWinClose">X</button><button class="controlWinMinimize">-</button>
          <hr class="controlHrWin">
          <div class="bodyWin">

          </div>
      </div>
8. Esta seria la estructura principal de la ventana, lo siguiente es agregar un boton para activar la ventana.
   Este boton puede ser cualquier elemento que se le pueda agregar un evento click, tambien puede estar ubicado en cualquier parte del documento.
    <button class="activeWin" data-toggle="estudiante">Activar Ventana</button>
   Ten en cuenta que en la propiedad data-toggle tiene que tener el id de la ventana que deseas que se active al hacer click en este elemento.
9. Puedes decidir si el usuario puede modificar el tamaño de la ventana, simplemente quita la clase "resizeWin" de div que usas como ventana

