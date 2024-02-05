import { exec } from "child_process";

export async function loginToDockerHub(username, password) {
    return new Promise((resolve, reject) => {
        const loginCommand = `docker login -u ${username} --password-stdin`;
        const child = exec(loginCommand, (error, stdout, stderr) => {
            if(error) {
                reject(error);
            } else {
                resolve();
            }
        });a
        child.stdin.write(password);
        child.stdin.end();
    });
}
