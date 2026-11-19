
# CRUD de Productos con Angular y Firebase

## Descripción

Aplicación web desarrollada con Angular y Cloud Firestore
para la administración de productos de un inventario.

El sistema permite crear, consultar, actualizar y eliminar
productos mediante una interfaz gráfica con validaciones,
persistencia de datos y sincronización en tiempo real.

Los productos utilizan identificadores consecutivos
generados mediante transacciones de Firebase.

## Enlaces del proyecto

- Aplicación web: https://TU-PROYECTO.vercel.app
- Repositorio: https://github.com/TU-USUARIO/crud-productos

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Firebase SDK
- Cloud Firestore
- Firebase Authentication
- RxJS
- Git
- GitHub
- Vercel

## Funcionalidades

### Crear productos

Permite registrar productos mediante un formulario
y almacenarlos en la colección productos de Firestore.

### Consultar productos

Recupera los documentos almacenados en Firebase
y muestra sus datos en una tabla HTML.

### Actualizar productos

Permite cargar los datos de un producto en el formulario
y modificar el documento mediante su identificador.

### Eliminar productos

Solicita confirmación antes de eliminar un producto.

Si el usuario cancela la operación, el documento
permanece almacenado en Firestore.

### Sincronización en tiempo real

Utiliza onSnapshot del SDK de Firebase y Observable
de RxJS para escuchar cambios en la colección productos.

La tabla se actualiza automáticamente cuando se crea,
modifica o elimina un documento, incluso cuando los
cambios se realizan directamente desde Firebase.

### Identificadores consecutivos

Los productos utilizan identificadores personalizados:

- producto01
- producto02
- producto03
- producto04
- productoN

Se utiliza una colección adicional llamada contadores
que almacena el último identificador generado.

El método runTransaction permite registrar el producto
y actualizar el contador en una sola operación atómica.

Cuando se elimina un producto, el contador no disminuye,
evitando reutilizar identificadores anteriores.

## Modelo de datos

### Colección productos

| Campo | Tipo | Descripción |
|---|---|---|
| id | string | Identificador del documento |
| nombre | string | Nombre del producto |
| precio | number | Precio unitario |
| stock | number | Cantidad disponible |
| categoria | string | Categoría del producto |

El campo id se obtiene del identificador del documento
de Firestore y no se almacena como un campo adicional.

Ejemplo de documento:

    producto01
        nombre: "Teclado"
        precio: 25.50
        stock: 15
        categoria: "Periféricos"

### Colección contadores

Documento: productos

| Campo | Tipo | Descripción |
|---|---|---|
| ultimoId | number | Último identificador generado |

Ejemplo:

    contadores/
        productos/
            ultimoId: 6

Si ultimoId es igual a 6, el siguiente producto
se registrará con el identificador producto07.

## Estructura de Firestore

    Cloud Firestore
    ├── productos
    │   ├── producto01
    │   ├── producto02
    │   ├── producto03
    │   └── productoN
    └── contadores
        └── productos
            └── ultimoId

## Métodos del servicio Producto

| Método | Descripción |
|---|---|
| iniciarSesionDemo() | Inicia una sesión anónima |
| crearProducto() | Crea un producto con ID consecutivo |
| crearProductoConId() | Escribe un producto con ID personalizado |
| obtenerProductos() | Consulta todos los productos |
| obtenerProducto() | Consulta un producto por ID |
| actualizarProducto() | Actualiza un producto existente |
| eliminarProducto() | Elimina un producto |
| buscarPorCategoria() | Filtra productos por categoría |
| observarProductos() | Escucha cambios en tiempo real |

La creación desde el formulario utiliza crearProducto()
para mantener actualizado el contador.

## Validaciones

El formulario implementa las siguientes validaciones:

- Nombre obligatorio y diferente de espacios en blanco.
- Categoría obligatoria y diferente de espacios en blanco.
- Precio numérico y mayor o igual a cero.
- Stock entero y mayor o igual a cero.
- Confirmación antes de eliminar un producto.
- Mensajes de éxito, error y validación.
- Restricción del envío de información inválida.

También se aplican validaciones mediante las reglas
de seguridad de Cloud Firestore.

## Estructura del proyecto

    crud-productos/
    ├── public/
    ├── src/
    │   └── app/
    │       ├── modelo/
    │       │   └── producto.model.ts
    │       ├── servicios/
    │       │   └── producto.ts
    │       ├── firebase.config.ts
    │       ├── app.ts
    │       ├── app.html
    │       └── app.css
    ├── angular.json
    ├── firestore.rules
    ├── package.json
    ├── package-lock.json
    └── README.md

## Instalación y ejecución local

### Requisitos

- Node.js compatible con la versión de Angular.
- npm.
- Git.
- Proyecto Firebase.

### 1. Clonar el repositorio

    git clone https://github.com/TU-USUARIO/crud-productos.git

    cd crud-productos

### 2. Instalar dependencias

    npm ci

### 3. Configurar Firebase

1. Crear un proyecto en Firebase Console.
2. Habilitar Cloud Firestore.
3. Registrar una aplicación web.
4. Copiar la configuración del SDK web de Firebase.
5. Configurar el archivo src/app/firebase.config.ts.
6. Habilitar Firebase Authentication.
7. Habilitar el proveedor de autenticación anónima.
8. Crear la colección productos e ingresar datos iniciales.
9. Crear la colección contadores.
10. Crear el documento productos dentro de contadores.
11. Agregar el campo ultimoId de tipo numérico entero.
12. Configurar y publicar las reglas de firestore.rules.

Si la colección productos está vacía, ultimoId
debe inicializarse en 0.

Si ya existen productos con identificadores consecutivos,
ultimoId debe corresponder al mayor número utilizado.

### 4. Ejecutar el proyecto localmente

    npm start

Abrir la aplicación en:

http://localhost:4200

### 5. Compilar el proyecto

    npm run build

Los archivos compilados se generan en la carpeta dist.

## Seguridad

La aplicación utiliza Firebase Authentication mediante
autenticación anónima para facilitar la demostración.

Las reglas de seguridad restringen el acceso a las
colecciones productos y contadores.

Las reglas validan los campos de cada producto y
permiten incrementar el contador de forma controlada.

La autenticación anónima y los permisos compartidos
se utilizan exclusivamente con datos ficticios para
una demostración académica temporal.

Cualquier visitante autenticado anónimamente puede
modificar los productos compartidos.

Las reglas deben revisarse y restringirse antes de
utilizar la aplicación en un entorno real.

No se incluyen contraseñas, tokens privados ni claves
de cuentas de servicio en el repositorio.

## Despliegue en Vercel

La aplicación se publica en Vercel mediante la
integración con el repositorio de GitHub.

Configuración:

- Framework Preset: Angular.
- Root Directory: ./
- Build Command: npm run build.
- Install Command: npm ci.
- Output Directory: dist/crud-productos/browser.
- Node.js: versión compatible con Angular.

Los cambios realizados en la rama principal de GitHub
generan nuevos despliegues automáticamente.

## Pruebas de funcionamiento

Las pruebas de verificación incluyen:

- Registro de productos válidos.
- Consulta de productos almacenados.
- Actualización de documentos existentes.
- Cancelación y confirmación de eliminación.
- Rechazo de nombres vacíos.
- Rechazo de precios negativos.
- Rechazo de stock fraccionario.
- Generación de identificadores consecutivos.
- Actualización de la tabla en tiempo real.
- Persistencia después de recargar la página.

## Persistencia de datos

Los productos se almacenan en Cloud Firestore.

La información permanece disponible después de
recargar la aplicación, cerrar el navegador o acceder
desde otro dispositivo.

## Autor

Pedro Pesántez

Proyecto académico de Programación Web.
