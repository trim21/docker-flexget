const fs = require("fs");

const { get, trimStart, flatMap } = require("lodash");
const { exec } = require("@actions/exec");
const { context } = require("@actions/github");
const toml = require("@ltd/j-toml");

async function main() {
  const dockerFile = fs.readFileSync("./Dockerfile").toString().replace(/\r\n/g, "\n").trim();
  const fromLine = dockerFile.split("\n").shift();
  const FLEXGET_VERSION = fromLine.split(":").pop();

  const silent = { silent: true };

  console.log(`build version ${FLEXGET_VERSION}`);

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
