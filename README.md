
# Proyecto de Mantenimiento Preventivo de Sistema

Este proyecto consiste en una aplicación web de mantenimiento preventivo de sistema para entornos Windows. Los usuarios pueden ejecutar una serie de comandos de administración del sistema directamente desde su navegador. Los comandos disponibles incluyen:

1. **Obtener información del serial de BIOS y nombre del producto.**
2. **Verificar y reparar discos con `chkdsk`.**
3. **Liberar espacio en disco usando `cleanmgr`.**
4. **Desfragmentar el disco duro con `defrag`.**
5. **Restablecer la configuración de red con `netsh`.**
6. **Verificar y reparar archivos del sistema con `sfc /scannow`.**
7. **Eliminar archivos temporales y de prefetch.**

Los resultados de los comandos ejecutados se almacenan y se muestran en una lista en la interfaz web, con la opción de eliminar resultados específicos o descargar todos los resultados en un archivo `.txt`. Además, se utiliza el patrón **POST-REDIRECT-GET** para evitar la repetición automática de comandos cuando se recarga la página.

### **Características adicionales:**

- **Ejecución de comandos con privilegios de administrador**: Algunos comandos requieren permisos elevados, por lo que se ejecutan con `powershell` para invocar la terminal de Windows con privilegios de administrador.
- **Interfaz amigable**: Los usuarios pueden interactuar con los comandos mediante botones, ver los resultados, eliminar entradas y descargar los resultados.

---

## **Dependencias del Proyecto:**

Este proyecto utiliza las siguientes dependencias:

- **Express**: Framework para Node.js que facilita la creación de aplicaciones web.
- **EJS**: Motor de plantillas para generar HTML dinámico en el servidor.
- **Child Process**: Módulo nativo de Node.js utilizado para ejecutar comandos del sistema operativo.
- **fs**: Módulo nativo de Node.js utilizado para trabajar con el sistema de archivos (para la descarga de archivos).

---

## **Comandos para Instalar las Dependencias:**

Para instalar todas las dependencias necesarias para este proyecto, sigue estos pasos:

1. **Inicializa el proyecto de Node.js (si aún no lo has hecho):**
   
   ```bash
   npm init -y
   ```

2. **Instala las dependencias necesarias:**

   ```bash
   npm install express ejs
   ```

   Estas dependencias son las que el proyecto utiliza para gestionar el servidor web (Express) y renderizar las vistas (EJS).

3. **Las dependencias `child_process` y `fs` son módulos nativos de Node.js**, por lo que no necesitan ser instaladas.

---

## **Resumen de los Comandos:**

```bash
npm init -y                  # Inicializa el proyecto de Node.js si no se ha hecho
npm install express ejs       # Instala Express y EJS como dependencias del proyecto
```

---

### **Cómo Ejecutar el Proyecto:**

1. Clona el repositorio:

   ```bash
   git clone https://github.com/relativitydev3/ascara.git
   cd tu-repositorio
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor:

   ```bash
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`.


