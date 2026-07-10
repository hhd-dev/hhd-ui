%global __os_install_post %{_rpmconfigdir}/brp-compress %{_rpmconfigdir}/brp-strip-none %{_rpmconfigdir}/brp-strip-static-archive
%global debug_package %{nil}

# This spec is evaluated from a Git checkout. Build it from the repository root:
#   rpmbuild -ba pkg/hhd-ui-git.spec
%global commit %(git rev-parse --verify HEAD)
%global shortcommit %(git rev-parse --short=12 %{commit})
%global gitversion %(tag=$(git describe --tags --abbrev=0 --match 'v[0-9]*' %{commit} 2>/dev/null || :); if test -n "$tag"; then version=${tag#v}; commits=$(git rev-list --count "$tag..%{commit}"); if test "$commits" -eq 0; then printf '%%s' "$version"; else printf '%%s+git.%%s.g%%s' "$version" "$commits" "%{shortcommit}"; fi; else commits=$(git rev-list --count %{commit}); printf '0.0.0+git.%%s.g%%s' "$commits" "%{shortcommit}"; fi)

Name:           hhd-ui
Version:        %{gitversion}
Release:        1%{?dist}
Summary:        Configurator interface for Handheld Daemon.
License:        LGPL-2.1-or-later
URL:            https://github.com/hhd-dev/hhd-ui
Source0:        %{URL}/archive/%{commit}/%{name}-%{commit}.tar.gz

BuildArch:      x86_64

BuildRequires:  npm
BuildRequires:  git
BuildRequires:  desktop-file-utils
BuildRequires:  systemd-rpm-macros

Requires:       fuse
Requires:       fuse-devel

%description
Configurator interface for Handheld Daemon.

%prep
%autosetup -n %{name}-%{commit}

%build
npm pkg set version="%{version}"
npm pkg set version="%{version}" --prefix electron
npm ci
npm run electron-build
cd electron
npm ci
npm run build
chmod +x dist/hhd-ui.AppImage

%install
mkdir -p %{buildroot}%{_bindir}
cp -a electron/dist/hhd-ui.AppImage %{buildroot}%{_bindir}/hhd-ui
install -Dm644 LICENSE %{buildroot}%{_licensedir}/%{name}/LICENSE
install -Dm644 pkg/hhd-ui.desktop %{buildroot}%{_datadir}/applications/hhd-ui.desktop

mkdir -p %{buildroot}%{_datadir}/applications/hhd-ui/
install -Dm644 art/library_capsule.png %{buildroot}%{_datadir}/applications/hhd-ui/library_capsule.png
install -Dm644 art/library_hero.png %{buildroot}%{_datadir}/applications/hhd-ui/library_hero.png
install -Dm644 art/library_logo.png %{buildroot}%{_datadir}/applications/hhd-ui/library_logo.png
install -Dm644 art/main_capsule.png %{buildroot}%{_datadir}/applications/hhd-ui/main_capsule.png
install -Dm644 art/icon.png %{buildroot}%{_datadir}/applications/hhd-ui/icon.png

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
