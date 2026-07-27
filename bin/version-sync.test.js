/**
 * @file version-sync.test.js
 * @description Automated Semantic Versioning (SemVer) synchronization test across package.json, herdr-plugin.toml and CHANGELOG.md
 * @author Thomas Gauthier
 * @version 1.0.0
 * @date 2026-07-27
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Semantic Versioning (SemVer) Synchronization Tests', () => {
  const rootDir = process.cwd();
  const packageJsonPath = path.join(rootDir, 'package.json');
  const pluginTomlPath = path.join(rootDir, 'herdr-plugin.toml');
  const changelogPath = path.join(rootDir, 'CHANGELOG.md');

  // Read package.json version as absolute single source of truth
  const pkgContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const currentVersion = pkgContent.version;

  test('package.json has a valid SemVer version string', () => {
    assert.ok(currentVersion, 'package.json must contain a version field');
    assert.match(currentVersion, /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?$/, 'Version must adhere to Semantic Versioning (SemVer)');
  });

  test('herdr-plugin.toml version matches package.json version exactly', () => {
    const tomlContent = fs.readFileSync(pluginTomlPath, 'utf-8');
    const match = tomlContent.match(/^version\s*=\s*"([^"]+)"/m);

    assert.ok(match, 'herdr-plugin.toml must contain a valid version = "..." field');
    const tomlVersion = match[1];

    assert.equal(
      tomlVersion,
      currentVersion,
      `herdr-plugin.toml version ("${tomlVersion}") does not match package.json version ("${currentVersion}")`
    );
  });

  test('CHANGELOG.md contains [Unreleased] or matching release header', () => {
    const changelogContent = fs.readFileSync(changelogPath, 'utf-8');
    const escapedVersion = currentVersion.replace(/\./g, '\\.');
    const hasVersionHeader = new RegExp(`##\\s+\\[${escapedVersion}\\]`, 'm').test(changelogContent);
    const hasUnreleasedHeader = /##\s+\[Unreleased\]/i.test(changelogContent);

    assert.ok(
      hasVersionHeader || hasUnreleasedHeader,
      `CHANGELOG.md must contain either an "## [Unreleased]" section or a matching release header "## [${currentVersion}]"`
    );
  });
});
