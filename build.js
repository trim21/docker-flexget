const { exec, getExecOutput } = require("@actions/exec");
const fs = require("fs");

async function main() {
  const FLEXGET_VERSION = fs.readFileSync("./requirements.txt").toString().trim().split("==").pop();

  const baseImage = `ghcr.io/trim21/flexget:base-${FLEXGET_VERSION}`;
  const remote = `https://github.com/Flexget/Flexget.git#v${FLEXGET_VERSION}`;

  try {
    await getExecOutput("docker", ["pull", baseImage]);
  } catch {
    await getExecOutput("docker", ["build", remote, "--tag", baseImage]);
    await getExecOutput("docker", ["push", baseImage]);
  }

  await exec("docker", ["tag", baseImage, "flexget-base:latest"]);
  await getExecOutput("docker", ["build", "--tag", "flexget:current", "."]);

  const [major, minor, _] = FLEXGET_VERSION.split(".");
  const versions = ["latest", major, `${major}.${minor}`, FLEXGET_VERSION];

  console.log(versions);

  for (const version of versions) {
    const dst = `ghcr.io/trim21/flexget:${version}`;
    await exec("docker", ["tag", "flexget:current", dst]);
    await getExecOutput("docker", ["push", dst]);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
