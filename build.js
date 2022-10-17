const fs = require("fs");

const { exec } = require("@actions/exec");
const { context } = require("@actions/github");

function getFlexgetVersion() {
  const req = fs.readFileSync("./requirements.txt").toString().split('\n')[0]

  return req.split('==')[1]
}

async function main() {
  const FLEXGET_VERSION = getFlexgetVersion();
  const dockerFile = fs.readFileSync("./docker_file_tmpl.txt").toString().replace('${VERSION}', FLEXGET_VERSION);

  fs.writeFileSync("Dockerfile", dockerFile)

  const silent = {};

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
