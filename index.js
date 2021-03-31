const simpleGit = require('simple-git');
const git = simpleGit();
const chalk = require('chalk');

checkoutUnchangedFiles = () => {
    return new Promise((resolve, reject) => {
        git.status({}, (error, response) => {
            if (!error && response && response.files) {
                const size = response.modified.length;
                let counter=1;
                let counterCheckedOut=0;
                response.modified.forEach((file) => {
                    git.diff({[file]:null}, (err, diff) => {
                        const log = 'Checking file ' + (counter++)+ '/' + size + ' : ' + file;
                        if (err || !diff) {
                            console.log(log + chalk.red('Error: ') + err);
                        } else if (diff.length) {
                            console.log(log + chalk.blue(' File has diffs '));
                        } else {
                            counterCheckedOut++
                            console.log(log + chalk.green(' Identical File. Checked out: ') + counterCheckedOut);
                        }
                        if (counter > size) {
                            resolve('Checked Out ' + counterCheckedOut + '/' + size);
                        }
                    })
                })
                if (!size) {
                    resolve(chalk.yellow('No files to check'));
                }
            } else {
                console.error('Error while getting git status', error);
                reject(error);
            }
        })

    })
}

module.exports = { checkoutUnchangedFiles };
