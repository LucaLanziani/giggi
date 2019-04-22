const fs = require('fs');
const chalk = require('chalk');

function dirExist(repoPath) {
    let stat = fs.statSync(repoPath);

    if (fs.existsSync(repoPath) && stat.isDirectory()) {
        return true;
    }

    console.error(`${repoPath} directory doesn't exist`);
    return false
}

function formatTrackingString(status) {
    let trackingString;
    if (! status.tracking) {
      trackingString = chalk.red(`o`);
    } else {
      let remote = status.tracking.indexOf('/');
      if (status.tracking.substring(remote + 1) === status.current) {
        trackingString = chalk.magenta(`${status.tracking.substring(0, remote)}`);
      } else {
        trackingString = `${status.tracking}`;
      }
    }
    return `${trackingString}`;
};

function formatStagedString(status) {
    let staged = status.created.length + status.deleted.length + status.renamed.length;
    let stagedString = `${staged}`.padStart(2) + ' staged';
    return staged > 0 ? chalk.yellow(stagedString) : stagedString;
}

function formatUnstagedString(status) {
    let unstaged = status.modified.length + status.not_added.length;
    let unstagedString = `${unstaged}`.padStart(2) + ' unstaged';
    return unstaged > 0 ? chalk.yellow(unstagedString) : unstagedString;
}

function formatAheadBehind(status) {
    let aheadString = '▴' + `${status.ahead}`.padStart(2);
    aheadString = status.ahead > 0 ? chalk.green(aheadString) : aheadString;

    let behindString = '▾' + `${status.behind}`.padStart(2);
    behindString = status.behind > 0 ? chalk.red(behindString) : behindString;

    return { aheadString, behindString };
}

module.exports = {
    dirExist,
    formatTrackingString,
    formatUnstagedString,
    formatStagedString,
    formatAheadBehind
}
