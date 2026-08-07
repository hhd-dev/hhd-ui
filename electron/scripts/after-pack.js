const fs = require("fs/promises");
const path = require("path");

exports.default = async function addLauncher(context) {
  if (context.electronPlatformName !== "linux") return;

  const executableName = context.packager.executableName;
  const executable = path.join(context.appOutDir, executableName);
  const electronExecutable = `${executable}-bin`;
  const rootPackage = JSON.parse(
    await fs.readFile(
      path.resolve(context.packager.projectDir, "..", "package.json"),
      "utf8"
    )
  );

  await fs.rename(executable, electronExecutable);
  await fs.writeFile(
    executable,
    `#!/bin/sh

if [ "$#" -eq 1 ] && [ "$1" = "--version" ]; then
    printf '%s\\n' '${rootPackage.version}'
    exit 0
fi

if [ -n "$APPDIR" ]; then
    app_dir=$APPDIR
else
    app_dir=$(CDPATH= cd "$(dirname "$0")" && pwd)
fi

exec "$app_dir/${path.basename(electronExecutable)}" "$@"
`,
    { mode: 0o755 }
  );
};
