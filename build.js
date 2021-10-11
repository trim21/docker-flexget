const { exec } = require("@actions/exec");
const fs = require("fs");

async function main() {
  const FLEXGET_VERSION = fs
    .readFileSync("./requirements.txt")
    .toString()
    .trim()
    .split("==")
    .pop();

  const baseImage = `ghcr.io/trim21/flexget:base-${FLEXGET_VERSION}`;
  try {
    await exec("docker", ["pull", baseImage], { silent: true });
  } catch {
    await exec(
      "docker",
      [
        "build",
        `https://github.com/Flexget/Flexget.git#v${FLEXGET_VERSION}`,
        "--tag",
        baseImage,
      ],
      { silent: true }
    );
    await exec("docker", ["push", baseImage], { silent: true });
  }
  await exec("docker", ["tag", baseImage, "flexget-base:latest"]);

  await exec("docker", ["build", "--tag", "flexget:current", "."], {
    silent: true,
  });

  const tag = FLEXGET_VERSION;
  const [major, minor, _] = tag.split(".");
  const versions = ["latest", tag, `${major}.${minor}`, major];

  console.log(versions);

  for (const version of versions) {
    const dst = `ghcr.io/trim21/flexget:${version}`;
    await exec("docker", ["tag", "flexget:current", dst]);
    await exec("docker", ["push", dst], { silent: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
