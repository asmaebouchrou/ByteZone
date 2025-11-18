
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
|   GET  | `/tshirts`         | Listado general de tshirts (grid, filtros)      | `client/tshirt/list.pug`   |   ✅  |
|   GET  | `/tshirts/:id`     | Detalle de camiseta con variantes (color, talla)  | `client/tshirt/detail.pug` |   ✅  |
|   GET  | `/api/tshirts`     | Devuelve JSON con listado de tshirts            | —                             |   ❌  |
|   GET  | `/api/tshirts/:id` | Devuelve JSON con detalle de camiseta y variantes | —                             |   ❌  |


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
|   GET  | `/admin/tshirt`            | Listado de tshirts                    | `admin/tshirt/list.pug`   | 🔒 Admin |
|   GET  | `/admin/tshirt/add`        | Formulario para añadir camiseta       | `admin/tshirt/add.pug`    | 🔒 Admin |
|  POST  | `/admin/tshirt/add`        | Insertar nueva camiseta en la BD      | —                         | 🔒 Admin |
|   GET  | `/admin/tshirt/update/:id` | Formulario para editar camiseta       | `admin/tshirt/update.pug` | 🔒 Admin |
|  POST  | `/admin/tshirt/update/:id` | Actualizar camiseta                   | —                         | 🔒 Admin |
|  POST  | `/admin/tshirt/delete/:id` | Eliminar camiseta                     | —                         | 🔒 Admin |
|   GET  | `/admin/user`              | Listado de usuarios                   | `admin/user/list.pug`     | 🔒 Admin |
|   GET  | `/admin/order`             | Listado de pedidos                    | `admin/order/list.pug`    | 🔒 Admin |
