const fs = require("fs");

const { get, trimStart } = require("lodash");
const { exec } = require("@actions/exec");
const { context } = require("@actions/github");
const toml = require("@iarna/toml");

async function main() {
  const pyproject = toml.parse(fs.readFileSync("./pyproject.toml").toString());
  const FLEXGET_VERSION = trimStart(get(pyproject, "tool.poetry.dependencies.flexget"), "=");

  console.log(`build version ${FLEXGET_VERSION}`);

  const baseImage = `ghcr.io/trim21/flexget:base-${FLEXGET_VERSION}`;
  const remote = `https://github.com/Flexget/Flexget.git#v${FLEXGET_VERSION}`;
  const silent = {
    silent: true,
  };

  try {
    await exec("docker", ["pull", baseImage], silent);
    console.log("pulling base image");
  } catch {
    console.log("build base image");
    await exec("docker", ["build", remote, "--tag", baseImage], silent);
    if (context.eventName === "push") {
      await exec("docker", ["push", baseImage], silent);
    }
  }

  await exec("docker", ["tag", baseImage, "flexget-base:latest"], silent);
  await exec("docker", ["build", "--tag", "flexget:current", "."], silent);

  const [major, minor, _] = FLEXGET_VERSION.split(".");
  const versions = ["latest", major, `${major}.${minor}`, FLEXGET_VERSION];

  console.log(versions);
  if (context.eventName !== "push") {
    return;
  }
  for (const version of versions) {
    console.log(`push tag ${version}`);
    const dst = `ghcr.io/trim21/flexget:${version}`;
    await exec("docker", ["tag", "flexget:current", dst], silent);
    await exec("docker", ["push", dst], silent);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
