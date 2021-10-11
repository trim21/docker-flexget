const { exec } = require("@actions/exec");
const fs = require("fs");
const Stream = require("stream");

async function main() {
  const FLEXGET_VERSION = fs.readFileSync("./requirements.txt").toString().trim().split("==").pop();

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
    await exec("docker", ["push", baseImage], silent);
  }

  await exec("docker", ["tag", baseImage, "flexget-base:latest"]);
  await exec("docker", ["build", "--tag", "flexget:current", "."], silent);

  const [major, minor, _] = FLEXGET_VERSION.split(".");
  const versions = ["latest", major, `${major}.${minor}`, FLEXGET_VERSION];

  console.log(versions);

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
