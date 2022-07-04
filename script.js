class Figura {
    constructor(figura) {
        this.id = figura.id;
        this.name = figura.name;
        this.group = figura.group;
        this.Price = figura.Price;
        this.quantity = 1;
        this.totalPrice = figura.Price;
    }
    agregarUnidadAlStock() {
        return this.quantity++;
      }
    quitarUnidad() {
        return this.quantity--;
    }
      actualizarPrecio() {
        return (this.totalPrice= this.Price * this.quantity);
      }
}

let carrito = [];
let figurasJSON = [];
let body = document.querySelector("body");
body.className = ("container bg-warning");
//RECUPERO DEL STORAGE LOS PRODUCTOS PREVIAMENTE SELECCIONADOS

function recuperarDelStorage() {
    let figurasEnStorage = JSON.parse(localStorage.getItem("carritoStorage"));
  if (figurasEnStorage) {
    let carro = [];
    for (let i = 0; i < figurasEnStorage.length; i++) {
        carro.push(new Figura(figurasEnStorage[i]));
    }
    console.log("carro: ", carro);
    return carro;
  }
    //En caso que no exista el carro en el Local, devolvera un array vacio
    return [];
}

function crearCardsEnHTML(carro) {
    let cards = document.getElementById("contenedor");
    for (const figura of carro) {
      cards.innerHTML += `
          <div class="card my-3 bg-light border border-secondary" style="width: 18rem;">
    <img src="${figura.imagen}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${figura.name}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${figura.group}</h6>
      <h6 class="card-subtitle mb-2 text-muted">${figura.Year}</h6>
      <p class="card-text">${figura.Price}$</p>
      <button id="btn${figura.id}" type="button" class="btn btn-dark">COMPRAR!</button>
    </div>
  </div>`;
    }
    //Asigna un evento a cada boton
    figurasJSON.forEach(figura => {
        document.getElementById(`btn${figura.id}`).addEventListener('click', function() {
          agregarCarrito(figura.id);
        });
      });
}

function agregarCarrito(id) {
    let figuraCarrito = carrito.find((figura) => figura.id === id);
    if (figuraCarrito) {
        let index = carrito.findIndex((element) => {
            if (element.id === figuraCarrito.id) {
              return true;
            }
          });
          carrito[index].quantity++;
          carrito[index].actualizarPrecio();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Agregaste otra unidad de tu producto al carrito!`,
            showConfirmButton: false,
            timer: 1500
          })
    } else {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se agrego tu producto al carrito con exito!`,
            showConfirmButton: false,
            timer: 1500
          })
        figuraCarrito = figurasJSON.find((figura) => figura.id === id);
        let newFigura = new Figura(figuraCarrito)
        newFigura.quantity = 1;
        carrito.push(newFigura);
    }
    localStorage.setItem("carritoStorage", JSON.stringify(carrito));
    imprimirDatosEnTabla(carrito);
}

function quitarDelCarrito(id) {
    let index=carrito.findIndex(figura => figura.id==id);
    carrito.splice(index, 1);
    let fila=document.getElementById(`fila${id}`);
    let tablabody=document.getElementById("tableBody");
    tablabody.removeChild(fila);
    Swal.fire({
        position: 'top-start',
        icon: 'error',
        title: `Eliminaste el producto del carrito`,
        showConfirmButton: false,
        timer: 1500
      })
}

function borrarCarrito() {
    carrito = [];
    localStorage.removeItem("carritoStorage");
    document.getElementById("carrito").innerHTML = "";
    document.getElementById("deleteCarrito").innerHTML = "";
    document.getElementById("tableBody").innerHTML = "";
}

function getTotalPrice(carro) {
    return carro.reduce((total, el) => total + el.totalPrice, 0);
}

function imprimirDatosEnTabla(carro) {
    let totalPrice = getTotalPrice(carro);
    let tableBody = document.getElementById("tableBody");
    carro.forEach(figura => {
        tableBody.innerHTML += `
        <tr id="fila${figura.id}">
        <td>${figura.id}</td>
        <td>${figura.name}</td>
        <td>${figura.group}</td>
        <td>${figura.quantity}</td>
        <td>${figura.Price}$</td>
        <td><button id="eliminar${figura.id}" class="btn btn-dark">🗑️</button></td>
    </tr>
        `;
        let botonEliminar = document.getElementById(`eliminar${figura.id}`);
        botonEliminar.addEventListener("click", () => quitarDelCarrito(figura.id));
      })
      let deleteCarrito = document.getElementById("deleteCarrito");
      deleteCarrito.innerHTML = `
          <h5>PrecioTotal: $${totalPrice}</h5></br>
          <button id="vaciarCarrito" onclick="borrarCarrito()" class="btn btn-dark">Vaciar Carrito</button>
      `;
}

function searchFilter(e) {
    e.preventDefault();
    let entrada = document.getElementById("search").value.toLowerCase();
    let filterCart = figurasJSON.filter((el) => el.name.toLowerCase().includes(entrada));
    imprimirDatosEnTabla(filterCart);
}
let filter = document.getElementById("btnFilter");
filter.addEventListener("click", searchFilter);

//TRAIGO LOS PRODUCTOS DEL JSON / IMPLEMENTO FETCH-(ASINC-AWAIT)
async function traerJSON() {
    const URLJSON = "./figuras.json"
    const resp = await fetch(URLJSON)
    const data = await resp.json()
    figurasJSON = data;
    crearCardsEnHTML(figurasJSON);
}
traerJSON(); 

