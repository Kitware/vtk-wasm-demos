export const openDirectory = async (mode = "read") => {
    // Feature detection. The API needs to be supported
    // and the app not run in an iframe.
    const supportsFileSystemAccess =
      "showDirectoryPicker" in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();
    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      let directoryStructure = undefined;
  
      // Recursive function that walks the directory structure.
      const getFiles = async (dirHandle, path = dirHandle.name) => {
        const dirs = [];
        const files = [];
        for await (const entry of dirHandle.values()) {
          const nestedPath = `${path}/${entry.name}`;
          if (entry.kind === "file") {
            files.push(
              entry.getFile().then((file) => {
                file.directoryHandle = dirHandle;
                file.handle = entry;
                return Object.defineProperty(file, "webkitRelativePath", {
                  configurable: true,
                  enumerable: true,
                  get: () => nestedPath,
                });
              })
            );
          } else if (entry.kind === "directory") {
            dirs.push(getFiles(entry, nestedPath));
          }
        }
        return [
          ...(await Promise.all(dirs)).flat(),
          ...(await Promise.all(files)),
        ];
      };
  
      try {
        // Open the directory.
        const handle = await showDirectoryPicker({
          mode: mode,
          multiple: true
        });
        // Get the directory structure.
        directoryStructure = getFiles(handle, undefined);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err.name, err.message);
        }
      }
      return directoryStructure;
    }
    // Fallback if the File System Access API is not supported.
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
  
      input.addEventListener('change', () => {
        let files = Array.from(input.files);
        resolve(files);
      });
      if ('showPicker' in HTMLInputElement.prototype) {
        input.showPicker();
      } else {
        input.click();
      }
    });
  };