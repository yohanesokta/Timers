# Tauri Rust

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
-   On **Linux**, the build produces two main files:
    -   A `.deb` file for Debian-based systems (like Ubuntu).
    -   An `.AppImage` file. **This is the recommended universal package** that is designed to run on most Linux distributions (including Arch, Fedora, openSUSE, etc.). You can make it executable (`chmod +x *.AppImage`) and run it directly.
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

---

## Building on other Linux Distributions

Before running `npm run tauri build`, you need to install several system dependencies. The required packages vary by distribution.

### Arch Linux

```sh
sudo pacman -Syu
sudo pacman -S --needed \
  webkit2gtk-4.1 \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  libappindicator-gtk3 \
  librsvg \
  xdotool
```

### Fedora

```sh
sudo dnf check-update
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel \
  libxdo-devel
sudo dnf group install "c-development"
```

### Gentoo

```sh
sudo emerge --ask \
  net-libs/webkit-gtk:4.1 \
  dev-libs/libappindicator \
  net-misc/curl \
  net-misc/wget \
  sys-apps/file
```

### openSUSE / OSTree-based (e.g., Fedora Silverblue)

```sh
sudo rpm-ostree install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel \
  libxdo-devel \
  gcc \
  gcc-c++ \
  make
sudo systemctl reboot
```

### Alpine Linux

```sh
sudo apk add \
  build-base \
  webkit2gtk-4.1-dev \
  curl \
  wget \
  file \
  openssl \
  libayatana-appindicator-dev \
  librsvg
```
