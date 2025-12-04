# Tauri + React

This template should help get you started developing with Tauri and React in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

## Building for Release

To create a production build of the application, you can run the following command:

```sh
npm run tauri build
```

This command will bundle the frontend and the Rust backend into a single executable file for your specific platform (Windows, macOS, or Linux).

### Finding the Artifacts

The compiled application files will be located in the `src-tauri/target/release/bundle/` directory.

-   On **Windows**, you will find an `.exe` installer and a `.msi` file.
-   On **Linux**, you will find a `.deb` file and an `.AppImage`.
-   On **macOS**, you will find a `.dmg` file.

### Creating a GitHub Release

1.  **Tag a new version:**
    ```sh
    git tag -a v0.1.0 -m "Release version 0.1.0"
    git push origin v0.1.0
    ```
    (Replace `v0.1.0` with your desired version number.)

2.  **Navigate to Releases:** Go to the "Releases" section of your GitHub repository.

3.  **Draft a new release:** Click "Draft a new release".

4.  **Choose the tag:** Select the tag you just pushed.

5.  **Upload the artifacts:** Drag and drop the compiled application files from the `src-tauri/target/release/bundle/` directory into the "Attach binaries" box.

6.  **Publish:** Write a title and description for your release and click "Publish release".
