import * as fs from 'node:fs'

import * as semver from 'semver'
import * as core from '@actions/core'


const dockerfile = fs.readFileSync('./Dockerfile', 'utf-8')

const pattern = /FROM ghcr\.io\/flexget\/flexget:(.*)(\r)?\n/

const version = pattern.exec(dockerfile)

const s = semver.parse(version[1])

console.log(s);

core.setOutput("tags", [
    `ghcr.io/trim21/flexget:latest`,
    `ghcr.io/trim21/flexget:${s.major}.${s.minor}.${s.patch}`,
    `ghcr.io/trim21/flexget:${s.major}.${s.minor}`,
    `ghcr.io/trim21/flexget:${s.major}`,
].join('\n'))
