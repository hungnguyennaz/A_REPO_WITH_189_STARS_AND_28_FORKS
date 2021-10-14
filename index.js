const core = require("@actions/core"),
    github = require("@actions/github");
function toOrd(e) {
    const t = ["th", "st", "nd", "rd"],
        r = e % 100;
    return e + (t[(r - 20) % 10] || t[r] || t[0]);
}
async function run() {
    try {
        const e = core.getInput("githubToken"),
            t = core.getInput("actor") || "",
            r = github.getOctokit(e),
            o = "JayantGoel001";
        let a = [],
            n = 1;
        for (;;) {
            const e = await r.request("GET /users/{username}/repos", { username: o, type: "public", page: n, per_page: 100, mediaType: { previews: ["mercy"] } });
            if (((n += 1), 0 === e.data.length)) break;
            const t = e.data.map((e) => ({ name: e.name, full_name: e.full_name, stargazers_count: e.stargazers_count, forks_count: e.forks_count }));
            a = a.concat(t.filter((e) => e.name.includes("A_REPO_WITH_")));
        }
        a.forEach(async ({ full_name: e, stargazers_count: o, forks_count: a }) => {
            const [n, s] = e.split("/"),
                c = `A_REPO_WITH_${o}_STARS_AND_${a}_FORKS`,
                u = `A REPO WITH ${o} STARS ⭐️ AND ${a} FORKS`,
                i = `[${t}](https://github.com/${t}) helped me reach ${toOrd(o)} stars and ${toOrd(a)} forks.`;
            await r.request("PATCH /repos/{owner}/{repo}", { owner: n, repo: s, name: c });
            const p = await r.request("GET /repos/{owner}/{repo}/contents/{path}", { owner: n, repo: s, path: "README.md" });
            
            const m = `# ${u}` +"\n\n"+  (new Buffer(p.data.content, "base64").toString().split("\n").slice(1)).join() + "\n\n" + " - " + i;
            console.log(m);
            await r.request("PUT /repos/{owner}/{repo}/contents/{path}", {
                owner: n,
                repo: s,
                path: "README.md",
                message: `⭐️ ${o}`,
                content: Buffer.from(m).toString("base64"),
                sha: p.data.sha,
                author: { name: t, email: `${t}@users.noreply.github.com` },
                committer: { name: "Jayant goel", email: "jgoel92@gmail.com" },
            });
        });
    } catch (e) {
        core.setFailed(e.message);
    }
}
run();
