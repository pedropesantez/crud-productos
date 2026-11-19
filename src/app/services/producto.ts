
import { Service } from '@angular/core';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  runTransaction
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { db } from '../firebase.config';
import { ProductoData, DatosProducto } from '../modelo/producto.model';
import { getAuth, signInAnonymously } from 'firebase/auth';

@Service()
export class Producto {
    async iniciarSesionDemo(): Promise<void> {

    const auth = getAuth(db.app);

    await auth.authStateReady();

    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

  }
  // READ: Escuchar productos en tiempo real
  observarProductos(): Observable<ProductoData[]> {

    return new Observable<ProductoData[]>(observer => {

      const referencia = collection(db, 'productos');

      const unsubscribe = onSnapshot(
        referencia,
        snapshot => {

          const productos = snapshot.docs.map(documento => ({
            ...(documento.data() as DatosProducto),
            id: documento.id
          }));

          observer.next(productos);
        },
        error => {
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }
  
  // CREATE: Crear producto con ID consecutivo
  async crearProducto(producto: DatosProducto): Promise<string> {

    const contadorRef = doc(db, 'contadores', 'productos');

    return await runTransaction(db, async (transaction) => {

      // Obtener el último identificador
      const contador = await transaction.get(contadorRef);

      if (!contador.exists()) {
        throw new Error('No existe el contador de productos');
      }

      const ultimoId = contador.data()['ultimoId'];

      // Incrementar el contador
      const siguienteId = ultimoId + 1;

      // Generar identificador personalizado
      const id = 'producto' +
        String(siguienteId).padStart(2, '0');

      const productoRef = doc(db, 'productos', id);

      // Comprobar que el identificador no exista
      const existente = await transaction.get(productoRef);

      if (existente.exists()) {
        throw new Error('El identificador ya existe');
      }

      // Guardar el producto
      transaction.set(productoRef, producto);

      // Actualizar el contador
      transaction.update(contadorRef, {
        ultimoId: siguienteId
      });

      return id;
    });
  }


  // CREATE: Crear producto con ID personalizado
  async crearProductoConId(
    id: string,
    producto: DatosProducto
  ): Promise<void> {
    await setDoc(
      doc(db, 'productos', id),
      producto
    );
  }

  // READ: Obtener todos los productos
  async obtenerProductos(): Promise<ProductoData[]> {
    const resultado = await getDocs(
      collection(db, 'productos')
    );

    return resultado.docs.map(documento => ({
      ...(documento.data() as DatosProducto),
      id: documento.id
    }));
  }

  // READ: Obtener un producto por ID
  async obtenerProducto(id: string): Promise<ProductoData | null> {
    const resultado = await getDoc(
      doc(db, 'productos', id)
    );

    if (resultado.exists()) {
      return {
        ...(resultado.data() as DatosProducto),
        id: resultado.id
      };
    }

    return null;
  }

  // UPDATE: Actualizar un producto
  async actualizarProducto(
    id: string,
    cambios: Partial<DatosProducto>
  ): Promise<void> {
    await updateDoc(
      doc(db, 'productos', id),
      { ...cambios }
    );
  }

  // DELETE: Eliminar un producto
  async eliminarProducto(id: string): Promise<void> {
    await deleteDoc(
      doc(db, 'productos', id)
    );
  }

  // READ: Buscar por categoría
  async buscarPorCategoria(
    categoria: string
  ): Promise<ProductoData[]> {

    const consulta = query(
      collection(db, 'productos'),
      where('categoria', '==', categoria)
    );

    const resultado = await getDocs(consulta);

    return resultado.docs.map(documento => ({
      ...(documento.data() as DatosProducto),
      id: documento.id
    }));
  }
}
