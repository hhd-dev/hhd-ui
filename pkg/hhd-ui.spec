%global __os_install_post %{_rpmconfigdir}/brp-compress %{_rpmconfigdir}/brp-strip-none %{_rpmconfigdir}/brp-strip-static-archive

Name:           hhd-ui
Version:        REPLACE_VERSION
Release:        1%{?dist}
Summary:        Configurator interface for Handheld Daemon.
License:        GPL-3.0-or-later
URL:            https://github.com/hhd-dev/hhd-ui
Source0:        ${URL}/archive/v%{version}.tar.gz

BuildArch:      x86_64

BuildRequires:  npm
BuildRequires:  fuse-devel
BuildRequires:  git
BuildRequires:  desktop-file-utils
BuildRequires:  systemd-rpm-macros

Requires: hhd
Requires: fuse

%description
Configurator interface for Handheld Daemon.

%prep
%setup -q -n %{name}-v%{version}

%build
cd %{name}-v%{version}
VERSION=$(cat package.json | grep -E '"version": "[0-9\.]+"' -o | grep -E "[0-9\.]+" -o)
sed -i "s|\"version\": \"1.0.0\"|\"version\": \"$VERSION\"|" "electron/package.json"
npm ci
npm run electron-build
cd electron
npm ci
npm run build
chmod +x dist/hhd-ui.AppImage

%install
cd %{name}-v%{version}
mkdir -p %{buildroot}%{_bindir}
cp -a hhd-ui/electron/dist/hhd-ui.AppImage %{buildroot}%{_bindir}/hhd-ui
install -Dm644 hhd-ui/LICENSE %{buildroot}%{_licensedir}/%{name}/LICENSE
install -Dm644 hhd-ui/pkg/hhd-ui.desktop %{buildroot}%{_datadir}/applications/hhd-ui.desktop

mkdir -p %{buildroot}%{_datadir}/applications/hhd-ui/
install -Dm644 hhd-ui/art/library_capsule.png %{buildroot}%{_datadir}/applications/hhd-ui/library_capsule.png
install -Dm644 hhd-ui/art/library_hero.png %{buildroot}%{_datadir}/applications/hhd-ui/library_hero.png
install -Dm644 hhd-ui/art/library_logo.png %{buildroot}%{_datadir}/applications/hhd-ui/library_logo.png
install -Dm644 hhd-ui/art/main_capsule.png %{buildroot}%{_datadir}/applications/hhd-ui/main_capsule.png
install -Dm644 hhd-ui/art/icon.png %{buildroot}%{_datadir}/applications/hhd-ui/icon.png

%post

%postun

%files
%license %{_licensedir}/%{name}/LICENSE
%{_bindir}/hhd-ui
%{_datadir}/applications/hhd-ui.desktop

%{_datadir}/applications/hhd-ui/library_capsule.png
%{_datadir}/applications/hhd-ui/library_hero.png
%{_datadir}/applications/hhd-ui/library_logo.png
%{_datadir}/applications/hhd-ui/main_capsule.png
%{_datadir}/applications/hhd-ui/icon.png

%changelog
* Wed Apr 3 2024 Matthew Schwartz <njtransit215@gmail.com> - 2.2.0-1
- Initial package creation