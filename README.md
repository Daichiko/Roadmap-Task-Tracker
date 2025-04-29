# task-cli: Aplicación de Gestión de Tareas por Línea de Comandos

Esta es una sencilla aplicación de línea de comandos (CLI) escrita en TypeScript y Node.js que te permite gestionar tus tareas directamente desde la terminal. Puedes agregar, actualizar, eliminar, marcar el estado y listar tus tareas.

**Inspiración:** La idea para este proyecto de práctica fue obtenida de [https://roadmap.sh/projects/task-tracker](https://roadmap.sh/projects/task-tracker).

## Prerrequisitos

Antes de poder ejecutar la aplicación, asegúrate de tener instalado lo siguiente en tu sistema:

* **Node.js:** (Se recomienda la version v23.11.0).

## Instalación

1.  **Clona el repositorio (si tienes el código en un repositorio):**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_PROYECTO>
    ```

2.  **Instala las dependencias:**

    ```bash
    npm install
    ```

## Ejecución (Modo Desarrollo)

Este proyecto está configurado para ejecutarse directamente en modo de desarrollo utilizando `npm run dev`. Esto probablemente utiliza herramientas como `ts-node` o un script similar en tu `package.json` para transpilar y ejecutar el código TypeScript al vuelo.

1.  **Ejecuta la aplicación en modo desarrollo:**

    Abre tu terminal en la raíz del proyecto y ejecuta el siguiente comando:

    ```bash
    npm run dev
    ```

    Esto iniciará la aplicación y te mostrará un prompt en la terminal donde puedes ingresar los comandos.

## Uso

Una vez que la aplicación se esté ejecutando, verás un prompt en la terminal donde puedes ingresar los comandos. Todos los comandos deben comenzar con `task-cli` seguido de la acción y sus argumentos.

**Comandos disponibles:**

* **`task-cli add <descripción>`**: Agrega una nueva tarea con la descripción proporcionada.

    ```bash
    task-cli add Comprar víveres
    ```

* **`task-cli update <id> <nueva descripción>`**: Actualiza la descripción de la tarea con el ID especificado. El ID es el número que se muestra al listar las tareas.

    ```bash
    task-cli update 1 Llamar al técnico
    ```

* **`task-cli delete <id>`**: Elimina la tarea con el ID especificado.

    ```bash
    task-cli delete 2
    ```

* **`task-cli mark-in-progress <id>`**: Marca la tarea con el ID especificado como "en progreso".

    ```bash
    task-cli mark-in-progress 3
    ```

* **`task-cli mark-done <id>`**: Marca la tarea con el ID especificado como "completada".

    ```bash
    task-cli mark-done 3
    ```

* **`task-cli list [todo|in-progress|done]`**: Lista todas las tareas o las tareas con un estado específico. Si no se especifica un estado, se listan todas las tareas.

    ```bash
    task-cli list
    task-cli list todo
    task-cli list in-progress
    task-cli list done
    ```

* **`exit`**: Sale de la aplicación.

    ```bash
    exit
    ```
