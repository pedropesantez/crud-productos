
export interface ProductoData {
  id?: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export type DatosProducto = Omit<ProductoData, 'id'>;
