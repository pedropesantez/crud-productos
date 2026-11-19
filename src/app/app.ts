
import {
  Component,
  signal,
  inject,
  OnInit,
  DestroyRef,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser, CurrencyPipe } from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { from, switchMap } from 'rxjs';

import { Producto } from './services/producto';

import {
  ProductoData,
  DatosProducto
} from './modelo/producto.model';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private productoService = inject(Producto);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  // Variables reactivas
  productos = signal<ProductoData[]>([]);
  idEdicion = signal<string | null>(null);

  mensaje = signal('');
  error = signal('');

  cargando = signal(true);
  guardando = signal(false);
  conectado = signal(false);

  // Formulario reactivo
  formulario = new FormGroup({

    nombre: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/)
      ]
    }),

    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      this.numeroValido
    ]),

    stock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      this.numeroEntero
    ]),

    categoria: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/)
      ]
    })

  });

  // Validar que el precio sea numérico y finito
  private numeroValido(control: AbstractControl) {
    return Number.isFinite(control.value)
      ? null
      : { numeroInvalido: true };
  }

  // Validar que el stock sea entero
  private numeroEntero(control: AbstractControl) {
    return Number.isInteger(control.value)
      ? null
      : { noEntero: true };
  }

  // Escuchar los productos al iniciar
  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    from(this.productoService.iniciarSesionDemo())
      .pipe(
        switchMap(() =>
          this.productoService.observarProductos()
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({

        next: productos => {
          this.productos.set(productos);
          this.cargando.set(false);
          this.conectado.set(true);
        },

        error: error => {
          console.error(error);
          this.error.set(
            'No se pudo conectar o consultar Firestore.'
          );
          this.cargando.set(false);
          this.conectado.set(false);
        }

      });
  }

  // CREATE y UPDATE
  async guardar(): Promise<void> {

    if (this.guardando() || !this.conectado()) {
      return;
    }

    this.mensaje.set('');
    this.error.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.error.set('Complete correctamente los campos.');
      return;
    }

    const valores = this.formulario.getRawValue();

    if (valores.precio === null || valores.stock === null) {
      return;
    }

    const producto: DatosProducto = {
      nombre: valores.nombre.trim(),
      precio: valores.precio,
      stock: valores.stock,
      categoria: valores.categoria.trim()
    };

    const id = this.idEdicion();

    this.guardando.set(true);

    try {

      if (id !== null) {

        // UPDATE
        await this.productoService.actualizarProducto(
          id,
          producto
        );

        this.mensaje.set('Producto actualizado correctamente.');

      } else {

        // CREATE
        await this.productoService.crearProducto(producto);

        this.mensaje.set('Producto registrado correctamente.');
      }

      this.limpiarFormulario();

    } catch (error) {

      console.error(error);
      this.error.set('No se pudo guardar el producto.');

    } finally {

      this.guardando.set(false);
    }
  }

  // Cargar producto en el formulario
  editar(producto: ProductoData): void {

    if (!producto.id || this.guardando()) {
      return;
    }

    this.idEdicion.set(producto.id);

    this.formulario.setValue({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria
    });

    this.mensaje.set('');
    this.error.set('');
  }

  // DELETE
  async eliminar(producto: ProductoData): Promise<void> {

    if (!producto.id || this.guardando() || !this.conectado()) {
      return;
    }

    const confirmado = confirm(
      `¿Desea eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    this.mensaje.set('');
    this.error.set('');
    this.guardando.set(true);

    try {

      await this.productoService.eliminarProducto(producto.id);

      if (this.idEdicion() === producto.id) {
        this.limpiarFormulario();
      }

      this.mensaje.set('Producto eliminado correctamente.');

    } catch (error) {

      console.error(error);
      this.error.set('No se pudo eliminar el producto.');

    } finally {

      this.guardando.set(false);
    }
  }

  // Reiniciar formulario
  limpiarFormulario(): void {

    this.formulario.reset({
      nombre: '',
      precio: null,
      stock: null,
      categoria: ''
    });

    this.idEdicion.set(null);
  }

  // Cancelar edición
  cancelarEdicion(): void {

    this.limpiarFormulario();
    this.mensaje.set('');
    this.error.set('');
  }

}
