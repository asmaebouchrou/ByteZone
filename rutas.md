
## Adrián
### AUTH
| Método | Ruta             | Descripción                        | Vista               | Auth |
| :----: | :--------------- | :--------------------------------- | :------------------ | :--: |
|   GET  | `/auth/login`    | Mostrar formulario de login        | `auth/login.pug`    |   ❌  |
|  POST  | `/auth/login`    | Procesar login y crear sesión      | —                   |   ❌  |
|   GET  | `/auth/signup` | Mostrar formulario de registro     | `auth/signup.pug` |   ❌  |
|  POST  | `/auth/signup` | Registrar nuevo usuario            | —                   |   ❌  |
|   GET  | `/logout`        | Cerrar sesión y redirigir al login | —                   |   ✅  |
|   GET  | `/profile`        | Ver perfil del usuario autenticado | `auth/profile.pug`  |   ✅  |
|  POST  | `/profile`        | Actualizar datos del usuario       | —                   |   ✅  |


## Antonio
### CATÁLOGO Y DETALLE DE PRODUCTO

| Método | Ruta                 | Descripción                                       | Vista                         | Auth |
| :----: | :------------------- | :------------------------------------------------ | :---------------------------- | :--: |
|   GET  | `/`                  | Landing page (productos destacados)               | `client/home.pug`            |   ✅  |
|   GET  | `/products`         | Listado general de productos informáticos       | `client/product/list.pug`   |   ✅  |
|   GET  | `/products/:id`     | Detalle de componente o periférico              | `client/product/detail.pug` |   ✅  |
|   GET  | `/api/products`     | Devuelve JSON con listado de productos          | —                             |   ❌  |
|   GET  | `/api/products/:id` | Devuelve JSON con detalle de producto           | —                             |   ❌  |


## Asmae
### CARRITO Y PEDIDOS

| Método | Ruta                    | Descripción                           | Vista                        | Auth |
| :----: | :---------------------- | :------------------------------------ | :--------------------------- | :--: |
|   GET  | `/cart`              | Ver carrito actual del usuario        | `client/cart/index.pug`    |   ✅  |
|  POST  | `/cart/agregar/:id`  | Añadir producto al carrito            | —                            |   ✅  |
|  POST  | `/cart/delete/:id` | Eliminar producto del carrito         | —                            |   ✅  |
|   GET  | `/cart/process`     | Confirmar compra (resumen del pedido) | `client/cart/process.pug` |   ✅  |
|  POST  | `/cart/process`     | Crear pedido en la BD                 | —                            |   ✅  |
|   GET  | `/orders`              | Listado de pedidos del usuario        | `client/order/list.pug`    |   ✅  |
|   GET  | `/orders/:id`          | Detalle de un pedido                  | `client/order/detail.pug`  |   ✅  |


## Víctor
### ADMIN
| Método | Ruta                       | Descripción                           | Vista                     |   Auth   |
| :----: | :------------------------- | :------------------------------------ | :------------------------ | :------: |
|   GET  | `/admin`                   | Dashboard principal del administrador | `admin/dashboard.pug`     | 🔒 Admin |
|   GET  | `/admin/products`            | Listado de productos                  | `admin/product/list.pug`   | 🔒 Admin |
|   GET  | `/admin/products/add`        | Formulario para añadir producto       | `admin/product/add.pug`    | 🔒 Admin |
|  POST  | `/admin/products/add`        | Insertar nuevo producto en la BD      | —                         | 🔒 Admin |
|   GET  | `/admin/products/update/:id` | Formulario para editar producto       | `admin/product/update.pug` | 🔒 Admin |
|  POST  | `/admin/products/update/:id` | Actualizar producto                   | —                         | 🔒 Admin |
|  POST  | `/admin/products/delete/:id` | Eliminar producto                     | —                         | 🔒 Admin |
|   GET  | `/admin/user`              | Listado de usuarios                   | `admin/user/list.pug`     | 🔒 Admin |
|   GET  | `/admin/order`             | Listado de pedidos                    | `admin/order/list.pug`    | 🔒 Admin |
