const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Configuración de vistas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware para poder manejar los datos del formulario
app.use(express.urlencoded({ extended: true }));


// Configurar la carpeta 'public' para archivos estáticos
app.use(express.static('public'));
// Array para almacenar los resultados
let commandResults = [];

// Página principal
app.get("/", (req, res) => {
  res.render("index", { commandResults });
});

// Función para ejecutar comandos elevados
function runCommandAsAdmin(command, callback) {
  const elevatedCommand = `powershell -Command "Start-Process cmd -ArgumentList '/c ${command}' -Verb runAs"`;
  exec(elevatedCommand, (err, stdout, stderr) => {
    if (stderr) {
      callback(stderr, null, stderr);
    } else {
      callback(null, stdout, stderr);
    }
  });
}

// Función para ejecutar comandos sin privilegios elevados
function runCommandWithoutAdmin(command, callback) {
  exec(command, (err, stdout, stderr) => {
    if (stderr) {
      callback(stderr, null, stderr);
    } else {
      callback(null, stdout, stderr);
    }
  });
}

// Ruta para ejecutar comandos
app.post("/run-command", (req, res) => {
  const command = req.body.command;

  if (!command) {
    return res.status(400).send("Comando no especificado");
  }

  const commands = {
    bios_serial: "wmic bios get serialnumber", // Sin privilegios
    csproduct_name: "wmic csproduct get name", // Sin privilegios
    chkdsk: "chkdsk C: /f /r",
    cleanmgr: "cleanmgr",
    defrag: "defrag C: /O",
    net_reset: "netsh int ip reset",
    sfc_scan: "sfc /scannow",
    cleanup: "del /q /s %temp%\\* && del /q /s temp\\* && del /q /s prefetch\\* && del /q /s eventvwr\\*",
  };

  const cmdToRun = commands[command];

  if (!cmdToRun) {
    return res.status(400).send("Comando no reconocido");
  }

  // Usar la función adecuada según el comando
  if (command === 'bios_serial' || command === 'csproduct_name') {
    // Ejecutar sin privilegios
    runCommandWithoutAdmin(cmdToRun, (err, stdout, stderr) => {
      if (err) {
        console.error("Error:", err);
        const errorMessage = `Error ejecutando el comando ${command}: ${err}`;
        commandResults.push(errorMessage); // Agregar error a la lista
        return res.redirect('/'); // Redirigir para evitar reejecución
      }

      const output = stdout || stderr || "No hubo salida del comando.";
      commandResults.push(`Resultado del comando ${command}: ${output}`); // Almacenar el resultado
      res.redirect('/'); // Redirigir a la página principal después de ejecutar
    });
  } else {
    // Ejecutar con privilegios elevados
    runCommandAsAdmin(cmdToRun, (err, stdout, stderr) => {
      if (err) {
        console.error("Error:", err);
        const errorMessage = `Error ejecutando el comando ${command}: ${err}`;
        commandResults.push(errorMessage); // Agregar error a la lista
        return res.redirect('/'); // Redirigir para evitar reejecución
      }

      const output = stdout || stderr || "No hubo salida del comando.";
      commandResults.push(`Resultado del comando ${command}: ${output}`); // Almacenar el resultado
      res.redirect('/'); // Redirigir a la página principal después de ejecutar
    });
  }
});

// Ruta para eliminar un resultado específico
app.get("/delete-result", (req, res) => {
  const resultIndex = req.query.index;

  if (resultIndex !== undefined && !isNaN(resultIndex)) {
    commandResults.splice(resultIndex, 1); // Eliminar el resultado en el índice indicado
  }

  res.redirect('/'); // Redirigir a la página principal después de eliminar
});

// Ruta para descargar todos los resultados en formato txt
app.get("/download-results", (req, res) => {
  const fileName = "resultados_mantenimiento.txt";
  const fileContent = commandResults.join("\n\n"); // Unir todos los resultados con saltos de línea

  // Crear un archivo temporal y enviarlo como descarga
  fs.writeFile(fileName, fileContent, (err) => {
    if (err) {
      return res.status(500).send("Error al crear el archivo.");
    }

    res.download(fileName, (err) => {
      if (err) {
        console.error("Error descargando el archivo:", err);
      }
      // Eliminar el archivo después de la descarga
      fs.unlink(fileName, (err) => {
        if (err) {
          console.error("Error al eliminar el archivo:", err);
        }
      });
    });
  });
});

// Servidor corriendo
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
