const { exec } = require("@actions/exec");
const github = require("@actions/github");

const context = github.context;
const ref = context.ref;

const FLEXGET_VERSION = process.env.VERSION;

async function main() {
  const baseImage = `ghcr.io/trim21/flexget:base-${FLEXGET_VERSION}`;
  try {
    await exec("docker", ["pull", baseImage]);
  } catch {
    await exec("docker", [
      "build",
      `https://github.com/Flexget/Flexget.git#v${FLEXGET_VERSION}`,
      "--tag",
      baseImage,
    ]);
    await exec("docker", ["push", baseImage]);
  }
  await exec("docker", ["tag", baseImage, "flexget-base:latest"]);

  await exec("docker", ["build", "--tag", "flexget:current", "."]);

  const tag = FLEXGET_VERSION;
  const [major, minor, _] = tag.split(".");
  const versions = ["latest", tag, `${major}.${minor}`, major];

  console.log(versions);

  for (const version of versions) {
    const dst = `ghcr.io/trim21/flexget:${version}`;
    await exec("docker", ["tag", "flexget:current", dst]);
    await exec("docker", ["push", dst]);
  }
}

main();
